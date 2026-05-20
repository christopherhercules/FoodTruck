/**
 * Cabinets — Floor Plan Room Analyzer
 *
 * POST /cabinets/analyze-plan  (multipart/form-data, field name: "plan")
 *
 * Accepts a floor plan image or PDF, sends it to Claude Vision,
 * and returns the rooms detected in the plan as a JSON array.
 * Falls back to a generic room list if no file is provided or analysis fails.
 */

const express = require('express');
const router  = express.Router();
const multer  = require('multer');

const upload = multer({
  storage: multer.memoryStorage(),
  limits:  { fileSize: 20 * 1024 * 1024 }, // 20 MB
});

const ANTHROPIC_API = 'https://api.anthropic.com/v1/messages';

const FALLBACK_ROOMS = [
  'Kitchen',
  'Primary Bathroom',
  'Bathroom 2',
  'Bathroom 3',
  'Laundry Room',
  'Pantry',
  'Bar / Wet Bar',
  'Mudroom',
  'Office / Study',
  'Other',
];

router.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

router.post('/cabinets/analyze-plan', upload.single('plan'), async (req, res) => {
  if (!req.file) {
    return res.json({ ok: true, rooms: FALLBACK_ROOMS, source: 'fallback' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.warn('[analyze-plan] ANTHROPIC_API_KEY not set — returning fallback rooms');
    return res.json({ ok: true, rooms: FALLBACK_ROOMS, source: 'fallback' });
  }

  const { mimetype, buffer } = req.file;
  const base64Data = buffer.toString('base64');
  const isPdf      = mimetype === 'application/pdf';

  // Build the content block — Claude uses 'document' for PDFs, 'image' for everything else
  const fileBlock = isPdf
    ? { type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: base64Data } }
    : { type: 'image',    source: { type: 'base64', media_type: mimetype,           data: base64Data } };

  const prompt =
    'This is a floor plan for a home. Identify every room that could need custom cabinets ' +
    '(kitchens, bathrooms, laundry rooms, pantries, wet bars, mudrooms, offices with built-ins, etc.). ' +
    'Use the room labels exactly as shown on the plan when they are visible. ' +
    'Return ONLY a valid JSON array of room name strings — no explanation, no markdown, no extra text. ' +
    'Example: ["Kitchen","Master Bathroom","Bathroom 2","Laundry Room","Pantry"]';

  try {
    const apiRes = await fetch(ANTHROPIC_API, {
      method: 'POST',
      headers: {
        'x-api-key':         apiKey,
        'anthropic-version': '2023-06-01',
        'content-type':      'application/json',
      },
      body: JSON.stringify({
        model:      'claude-haiku-4-5-20251001',
        max_tokens: 512,
        messages: [{ role: 'user', content: [fileBlock, { type: 'text', text: prompt }] }],
      }),
    });

    if (!apiRes.ok) {
      throw new Error(`Anthropic API returned ${apiRes.status}`);
    }

    const data  = await apiRes.json();
    const text  = data.content?.[0]?.text?.trim() || '';
    const match = text.match(/\[[\s\S]*\]/);  // extract JSON array even if wrapped in prose
    const rooms = match ? JSON.parse(match[0]) : [];

    if (!Array.isArray(rooms) || rooms.length === 0) {
      throw new Error('No rooms detected in response');
    }

    console.log(`[analyze-plan] Detected ${rooms.length} rooms: ${rooms.join(', ')}`);
    return res.json({ ok: true, rooms, source: 'ai' });

  } catch (err) {
    console.error('[analyze-plan] Analysis failed:', err.message);
    return res.json({ ok: true, rooms: FALLBACK_ROOMS, source: 'fallback', error: err.message });
  }
});

module.exports = router;
