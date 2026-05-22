const express   = require('express');
const multer    = require('multer');
const Anthropic = require('@anthropic-ai/sdk');
const router    = express.Router();

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 15 * 1024 * 1024 } });

router.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

router.post('/hunter/social/caption', upload.single('photo'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No photo uploaded' });

  const mediaType = req.file.mimetype;
  if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(mediaType)) {
    return res.status(400).json({ error: 'Unsupported image type. Use JPEG, PNG, or WebP.' });
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const prompt = `You are a social media copywriter for Hunter Land Clearing, a land clearing and brush removal contractor in New Braunfels, Texas Hill Country, run by Jason Merz.

Look at this job photo and write 3 caption options for Facebook and Instagram:

1. Professional — highlight the quality of the finished work and results
2. Transformation — emphasize the before/after, the cleared land, the space created
3. Local — speak to the Texas Hill Country community, pride in local craftsmanship

Rules:
- 1–3 sentences each, conversational but professional
- Reference specific details visible in the photo when possible (cedar, brush, equipment, terrain, acreage)
- Sound like a real local business owner, not corporate marketing
- No filler phrases like "We're proud to" or "Excited to share"

Also provide 10 relevant hashtags for land clearing in Texas.

Respond ONLY with valid JSON in this exact format, no other text:
{
  "captions": [
    { "label": "Professional", "text": "..." },
    { "label": "Transformation", "text": "..." },
    { "label": "Local", "text": "..." }
  ],
  "hashtags": ["#HunterLandClearing", "#LandClearing", "#BrushRemoval", "#NewBraunfels", "#TexasHillCountry", "#CedarClearing", "#TreeRemoval", "#TexasLandClearing", "#HillCountryLiving", "#LandManagement"]
}`;

  try {
    const message = await client.messages.create({
      model:      'claude-sonnet-4-6',
      max_tokens: 1024,
      messages:   [{
        role:    'user',
        content: [
          {
            type:   'image',
            source: { type: 'base64', media_type: mediaType, data: req.file.buffer.toString('base64') }
          },
          { type: 'text', text: prompt }
        ]
      }]
    });

    const raw       = message.content[0].text.trim();
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON in response');

    const result = JSON.parse(jsonMatch[0]);
    return res.json(result);

  } catch (err) {
    console.error('[hunter/social] error:', err.message);
    return res.status(500).json({ error: 'Caption generation failed: ' + err.message });
  }
});

module.exports = router;
