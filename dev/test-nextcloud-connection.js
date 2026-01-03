import { readFileSync } from 'fs';
import { DAVClient } from 'tsdav';

function loadEnvFile(path) {
  try {
    const content = readFileSync(path, 'utf-8');
    content.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;
      const [key, ...rest] = trimmed.split('=');
      if (key && rest.length) {
        process.env[key.trim()] = rest.join('=').trim();
      }
    });
  } catch (e) {
  }
}

loadEnvFile('.env.local');
loadEnvFile('.env');

const NEXTCLOUD_CALDAV_URL = process.env.NEXTCLOUD_CALDAV_URL;
const NEXTCLOUD_USERNAME = process.env.NEXTCLOUD_USERNAME;
const NEXTCLOUD_PASSWORD = process.env.NEXTCLOUD_PASSWORD;

async function testConnection() {
  console.log('🔍 Testing Nextcloud CalDAV Connectivity\n');
  console.log('='.repeat(50));

  if (!NEXTCLOUD_CALDAV_URL || !NEXTCLOUD_USERNAME || !NEXTCLOUD_PASSWORD) {
    console.log('❌ Credentials not configured in .env.local');
    console.log('Required environment variables:');
    console.log('  - NEXTCLOUD_CALDAV_URL');
    console.log('  - NEXTCLOUD_USERNAME');
    console.log('  - NEXTCLOUD_PASSWORD');
    process.exit(1);
  }

  console.log(`📡 Server URL: ${NEXTCLOUD_CALDAV_URL}`);
  console.log(`👤 Username: ${NEXTCLOUD_USERNAME}`);
  console.log('');

  try {
    console.log('1️⃣  Testing HTTP connectivity...');
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(NEXTCLOUD_CALDAV_URL, {
      method: 'OPTIONS',
      signal: controller.signal,
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${NEXTCLOUD_USERNAME}:${NEXTCLOUD_PASSWORD}`).toString('base64'),
      }
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      console.log('   ✅ Server is reachable');
    } else {
      console.log(`   ⚠️  Server responded with status: ${response.status}`);
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('   ❌ Connection timed out (10s)');
    } else {
      console.log(`   ❌ Connection failed: ${error.message}`);
    }
  }

  console.log('\n2️⃣  Testing DAV authentication...');
  const client = new DAVClient({
    serverUrl: NEXTCLOUD_CALDAV_URL,
    credentials: {
      username: NEXTCLOUD_USERNAME,
      password: NEXTCLOUD_PASSWORD,
    },
    authMethod: 'Basic',
    defaultAccountType: 'caldav',
  });

  try {
    await client.login();
    console.log('   ✅ Authentication successful');

    console.log('\n3️⃣  Fetching calendars...');
    const calendars = await client.fetchCalendars();
    console.log(`   ✅ Found ${calendars.length} calendar(s):`);

    calendars.forEach((cal, i) => {
      console.log(`   ${i + 1}. ${cal.displayName} (${cal.url})`);
    });

    console.log('\n' + '='.repeat(50));
    console.log('🎉 All connectivity tests passed!');
    process.exit(0);

  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    console.log('\n' + '='.repeat(50));
    console.log('💥 Connectivity test failed');
    process.exit(1);
  }
}

testConnection();
