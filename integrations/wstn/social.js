/**
 * WSTN Apartment Locating — Social Media Poster
 *
 * POST /wstn/social/caption  (multipart/form-data, field: "photo")
 *   Uploads photo to S3, asks Claude Vision to write 3 captions.
 *   Returns: { ok, captions, imageUrl }
 *
 * POST /wstn/social/post  (application/json)
 *   Body: { imageUrl, caption }
 *   Posts to Facebook Page and Instagram Business account via Meta Graph API.
 *   Returns: { ok, facebook, instagram }
 *
 * Required SSM params (loaded by secrets.js before startup):
 *   /contractor/wstn/facebook_token   → WSTN_FB_PAGE_TOKEN
 *   /contractor/wstn/facebook_page_id → WSTN_FB_PAGE_ID
 *   /contractor/wstn/instagram_id     → WSTN_IG_USER_ID
 *
 * Required S3 bucket: wstn-social.myserviceflows.com
 *   Must allow public-read (Block Public Access off) so Instagram can fetch the image URL.
 *   Create: aws s3api create-bucket --bucket wstn-social.myserviceflows.com --region us-east-1 --profile contractor
 *   Then apply a public-read bucket policy.
 */

const express = require('express');
const router  = require('express').Router();
const multer  = require('multer');
const crypto  = require('crypto');
const path    = require('path');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const upload = multer({
  storage: multer.memoryStorage(),
  limits:  { fileSize: 20 * 1024 * 1024 },
});

const ANTHROPIC_API  = 'https://api.anthropic.com/v1/messages';
const META_API       = 'https://graph.facebook.com/v19.0';
const UPLOADS_BUCKET = 'contractor-social.myserviceflows.com';
const UPLOADS_URL    = `https://s3.amazonaws.com/${UPLOADS_BUCKET}`;

const s3 = new S3Client({
  region:      process.env.AWS_DEFAULT_REGION || 'us-east-1',
  credentials: {
    accessKeyId:     process.env.CONTRACTOR_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.CONTRACTOR_AWS_SECRET_ACCESS_KEY,
  },
});

router.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// ── POST /wstn/social/caption ────────────────────────────────────────────────
router.post('/wstn/social/caption', upload.single('photo'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No photo uploaded' });

  const { mimetype, buffer, originalname } = req.file;

  // 1. Upload to S3 (public URL needed for the Instagram post step)
  let imageUrl = null;
  try {
    const ext = path.extname(originalname || 'photo').toLowerCase() || '.jpg';
    const key = `wstn/social/${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`;
    await s3.send(new PutObjectCommand({
      Bucket:      UPLOADS_BUCKET,
      Key:         key,
      Body:        buffer,
      ContentType: mimetype,
    }));
    imageUrl = `${UPLOADS_URL}/${key}`;
    console.log(`[wstn/social] Uploaded: ${key}`);
  } catch (err) {
    console.error('[wstn/social] S3 upload failed:', err.message);
    return res.status(500).json({ error: 'Image upload failed — check S3 bucket config' });
  }

  // 2. Generate 3 captions with Claude Vision
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'ANTHROPIC_API_KEY not configured' });

  const base64Data = buffer.toString('base64');
  const prompt =
    'This photo is from WSTN Apartment Locating, a Texas-based real estate service that helps people find apartments, buy homes, and sell properties across Texas. ' +
    'Write 3 different social media captions for this photo — suitable for both Facebook and Instagram. ' +
    'Each caption should be warm, professional, and aspirational — speaking to people searching for their next home in Texas. ' +
    'Focus on the feeling of finding the right place, the lifestyle it enables, and WSTN\'s personalized, expert service. ' +
    'Captions should feel like they come from a trusted local real estate advisor, not a generic listing service. ' +
    'Include relevant hashtags at the end of each caption (e.g. #ApartmentLocating #TexasRealEstate #WSTNApartments #FindYourPlace #HomeSearch #Austin #SanAntonio #NewBraunfels). ' +
    'Keep each caption under 2000 characters. ' +
    'Return ONLY a valid JSON array of 3 strings — no markdown, no explanation. ' +
    'Example format: ["Caption one...\\n\\n#Hashtag1 #Hashtag2", "Caption two...", "Caption three..."]';

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
        max_tokens: 1200,
        messages: [{
          role:    'user',
          content: [
            { type: 'image', source: { type: 'base64', media_type: mimetype, data: base64Data } },
            { type: 'text',  text: prompt },
          ],
        }],
      }),
    });

    if (!apiRes.ok) throw new Error(`Anthropic API returned ${apiRes.status}`);

    const data     = await apiRes.json();
    const text     = data.content?.[0]?.text?.trim() || '';
    const match    = text.match(/\[[\s\S]*\]/);
    const captions = match ? JSON.parse(match[0]) : [];

    if (!Array.isArray(captions) || captions.length === 0) throw new Error('No captions in response');

    console.log(`[wstn/social] Generated ${captions.length} captions`);
    return res.json({ ok: true, captions, imageUrl });

  } catch (err) {
    console.error('[wstn/social] Caption generation failed:', err.message);
    return res.status(500).json({ error: 'Caption generation failed', detail: err.message });
  }
});

// ── POST /wstn/social/post ───────────────────────────────────────────────────
router.post('/wstn/social/post', express.json(), async (req, res) => {
  const { imageUrl, caption } = req.body || {};
  if (!imageUrl || !caption) {
    return res.status(400).json({ error: 'imageUrl and caption are required' });
  }

  const pageToken = process.env.WSTN_FB_PAGE_TOKEN;
  const pageId    = process.env.WSTN_FB_PAGE_ID;
  const igUserId  = process.env.WSTN_IG_USER_ID;

  if (!pageToken || !pageId || !igUserId) {
    return res.status(500).json({
      error: 'Facebook/Instagram credentials not configured',
      missing: [
        !pageToken && 'WSTN_FB_PAGE_TOKEN (/contractor/wstn/facebook_token)',
        !pageId    && 'WSTN_FB_PAGE_ID (/contractor/wstn/facebook_page_id)',
        !igUserId  && 'WSTN_IG_USER_ID (/contractor/wstn/instagram_id)',
      ].filter(Boolean),
    });
  }

  const results = { facebook: null, instagram: null };

  // ── Facebook Page photo post ─────────────────────────────────────────────
  try {
    const fbRes = await fetch(`${META_API}/${pageId}/photos`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ url: imageUrl, message: caption, access_token: pageToken }),
    });
    const fbData = await fbRes.json();
    if (fbData.error) throw new Error(fbData.error.message);
    results.facebook = { postId: fbData.post_id || fbData.id };
    console.log(`[wstn/social] Facebook posted: ${results.facebook.postId}`);
  } catch (err) {
    console.error('[wstn/social] Facebook post failed:', err.message);
    results.facebook = { error: err.message };
  }

  // ── Instagram two-step post ──────────────────────────────────────────────
  try {
    const containerRes = await fetch(`${META_API}/${igUserId}/media`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ image_url: imageUrl, caption, access_token: pageToken }),
    });
    const containerData = await containerRes.json();
    if (containerData.error) throw new Error(containerData.error.message);

    const publishRes = await fetch(`${META_API}/${igUserId}/media_publish`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ creation_id: containerData.id, access_token: pageToken }),
    });
    const publishData = await publishRes.json();
    if (publishData.error) throw new Error(publishData.error.message);
    results.instagram = { postId: publishData.id };
    console.log(`[wstn/social] Instagram posted: ${results.instagram.postId}`);
  } catch (err) {
    console.error('[wstn/social] Instagram post failed:', err.message);
    results.instagram = { error: err.message };
  }

  const bothFailed = results.facebook?.error && results.instagram?.error;
  return res.status(bothFailed ? 500 : 200).json({ ok: !bothFailed, ...results });
});

module.exports = router;
