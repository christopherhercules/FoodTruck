/**
 * Cabinets — Floor Plan Analyzer & Uploader
 *
 * POST /cabinets/analyze-plan  (multipart/form-data, field name: "plan")
 *
 * 1. Uploads the floor plan to S3 (cabinets-uploads.myserviceflows.com)
 * 2. Sends it to Claude Vision to detect rooms and estimate linear footage
 * 3. Returns { rooms, linearFootage, planUrl, source }
 *
 * Falls back gracefully if S3 upload or Claude analysis fails.
 */

const express  = require('express');
const router   = express.Router();
const multer   = require('multer');
const crypto   = require('crypto');
const path     = require('path');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const upload = multer({
  storage: multer.memoryStorage(),
  limits:  { fileSize: 20 * 1024 * 1024 },
});

const ANTHROPIC_API  = 'https://api.anthropic.com/v1/messages';
const UPLOADS_BUCKET = 'cabinets-uploads.myserviceflows.com';
const UPLOADS_URL    = `https://s3.amazonaws.com/${UPLOADS_BUCKET}`;

const s3 = new S3Client({ region: process.env.AWS_DEFAULT_REGION || 'us-east-1' });

const FALLBACK_ROOMS = [
  'Kitchen','Primary Bathroom','Bathroom 2','Bathroom 3',
  'Laundry Room','Pantry','Bar / Wet Bar','Mudroom','Office / Study','Other',
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
    return res.json({ ok: true, rooms: FALLBACK_ROOMS, linearFootage: {}, planUrl: null, source: 'fallback' });
  }

  const { mimetype, buffer, originalname } = req.file;

  // ── 1. Upload to S3 ──────────────────────────────────────────────────────
  let planUrl = null;
  try {
    const ext = path.extname(originalname || 'plan').toLowerCase() || '.jpg';
    const key = `plans/${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`;
    await s3.send(new PutObjectCommand({
      Bucket:      UPLOADS_BUCKET,
      Key:         key,
      Body:        buffer,
      ContentType: mimetype,
    }));
    planUrl = `${UPLOADS_URL}/${key}`;
    console.log(`[analyze-plan] Uploaded to S3: ${key}`);
  } catch (err) {
    console.error('[analyze-plan] S3 upload failed:', err.message);
    // Continue with analysis even if upload failed
  }

  // ── 2. Analyze with Claude Vision ────────────────────────────────────────
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.warn('[analyze-plan] ANTHROPIC_API_KEY not set — returning fallback');
    return res.json({ ok: true, rooms: FALLBACK_ROOMS, linearFootage: {}, planUrl, source: 'fallback' });
  }

  const isPdf      = mimetype === 'application/pdf';
  const base64Data = buffer.toString('base64');

  const fileBlock = isPdf
    ? { type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: base64Data } }
    : { type: 'image',    source: { type: 'base64', media_type: mimetype,           data: base64Data } };

  const prompt =
    'This is a residential floor plan. Analyze it and return ONLY a valid JSON object — no markdown, no explanation.\n\n' +
    'The JSON must have two keys:\n' +
    '1. "rooms": array of every room name that would need custom cabinets (kitchens, bathrooms, laundry, pantry, wet bar, mudroom, office with built-ins, etc). ' +
    'Use the exact labels from the plan when visible.\n' +
    '2. "linearFootage": object mapping each room name to an estimated integer number of linear feet of cabinets. ' +
    'Base estimates on the room dimensions shown and typical cabinet placement:\n' +
    '   - Kitchen: count wall runs along countertop walls (base + upper cabinets share the same LF)\n' +
    '   - Bathrooms: vanity width plus any linen/storage walls\n' +
    '   - Laundry: overhead cabinets + base cabinets along the wall\n' +
    '   - Pantry/Bar: all usable wall runs\n\n' +
    'Example: {"rooms":["Kitchen","Master Bath","Bath 2","Laundry"],"linearFootage":{"Kitchen":28,"Master Bath":10,"Bath 2":6,"Laundry":8}}';

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
        max_tokens: 1024,
        messages:   [{ role: 'user', content: [fileBlock, { type: 'text', text: prompt }] }],
      }),
    });

    if (!apiRes.ok) throw new Error(`Anthropic API returned ${apiRes.status}`);

    const data   = await apiRes.json();
    const text   = data.content?.[0]?.text?.trim() || '';
    const match  = text.match(/\{[\s\S]*\}/);
    const parsed = match ? JSON.parse(match[0]) : null;

    const rooms         = Array.isArray(parsed?.rooms) ? parsed.rooms : null;
    const linearFootage = (parsed?.linearFootage && typeof parsed.linearFootage === 'object')
      ? parsed.linearFootage : {};

    if (!rooms || rooms.length === 0) throw new Error('No rooms in response');

    console.log(`[analyze-plan] ${rooms.length} rooms detected with footage: ${JSON.stringify(linearFootage)}`);
    return res.json({ ok: true, rooms, linearFootage, planUrl, source: 'ai' });

  } catch (err) {
    console.error('[analyze-plan] Analysis failed:', err.message);
    return res.json({ ok: true, rooms: FALLBACK_ROOMS, linearFootage: {}, planUrl, source: 'fallback', error: err.message });
  }
});

module.exports = router;
