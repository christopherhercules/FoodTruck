const { SSMClient, GetParametersCommand } = require('@aws-sdk/client-ssm');

// Maps SSM parameter paths → environment variable names
const SSM_PARAMS = {
  '/foodtruck/appsync/api_key':           'APPSYNC_API_KEY',
  '/foodtruck/twilio/account_sid':        'TWILIO_ACCOUNT_SID',
  '/foodtruck/twilio/auth_token':         'TWILIO_AUTH_TOKEN',
  '/foodtruck/twilio/from_number':        'TWILIO_FROM_NUMBER',
  '/foodtruck/toast/client_id':           'TOAST_CLIENT_ID',
  '/foodtruck/toast/client_secret':       'TOAST_CLIENT_SECRET',
  '/foodtruck/toast/restaurant_guid':     'TOAST_RESTAURANT_GUID',
  '/foodtruck/toast/webhook_secret':      'TOAST_WEBHOOK_SECRET',
  '/foodtruck/anthropic/api_key':         'ANTHROPIC_API_KEY',
  '/contractor/hunter/notify_phone':      'HUNTER_NOTIFY_PHONE',
  '/contractor/hunter/email_from':        'HUNTER_EMAIL_FROM',
  '/contractor/hunter/email_to':          'HUNTER_EMAIL_TO',
  '/contractor/cabinets/notify_email':    'CABINETS_NOTIFY_EMAIL',
  '/contractor/hunter/mapbox_token':      'MAPBOX_TOKEN',
  '/contractor/hunter/facebook_token':    'HUNTER_FB_PAGE_TOKEN',
  '/contractor/hunter/facebook_page_id':  'HUNTER_FB_PAGE_ID',
  '/contractor/hunter/instagram_id':      'HUNTER_IG_USER_ID',
};

async function loadSecrets() {
  // Set SSM_SKIP=true in local .env to use env vars directly without hitting SSM
  if (process.env.SSM_SKIP === 'true') {
    console.log('SSM_SKIP=true — using environment variables directly');
    return;
  }

  const client = new SSMClient({ region: process.env.AWS_DEFAULT_REGION || 'us-east-1' });
  const names  = Object.keys(SSM_PARAMS);

  let loaded  = 0;
  const missing = [];

  // GetParameters supports max 10 names per call
  for (let i = 0; i < names.length; i += 10) {
    const chunk = names.slice(i, i + 10);
    const { Parameters = [], InvalidParameters = [] } = await client.send(
      new GetParametersCommand({ Names: chunk, WithDecryption: true })
    );

    missing.push(...InvalidParameters);

    for (const param of Parameters) {
      const envKey = SSM_PARAMS[param.Name];
      // Don't overwrite a value that was already set in the environment
      if (!process.env[envKey]) {
        process.env[envKey] = param.Value;
        loaded++;
      }
    }
  }

  if (missing.length) {
    console.warn('⚠️  SSM: parameters not yet created:', missing.join(', '));
  }
  console.log(`✓ Loaded ${loaded} secrets from SSM`);
}

module.exports = { loadSecrets };
