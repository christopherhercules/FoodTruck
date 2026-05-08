/**
 * Toast POS Integration — Menu Sync
 *
 * Pulls the live menu from Toast and upserts items into our DynamoDB
 * via AppSync. Runs as a one-shot script or can be called on a schedule.
 *
 * Usage:
 *   node menu-sync.js                     ← sync Restaurant menu
 *   node menu-sync.js --source FoodTruck  ← sync Food Truck menu
 *
 * What it does:
 *   1. Fetches all menu groups + items from Toast API
 *   2. Maps Toast item structure → our MenuItem schema
 *   3. Creates or updates each item in DynamoDB via AppSync
 *   4. Marks items no longer in Toast as unavailable (soft delete)
 */

const { TOAST_BASE_URL, TOAST_RESTAURANT_GUID, APPSYNC_URL, API_KEY, SOURCE_MAP } = require('./config');
const { getHeaders } = require('./auth');

// ── CLI ARG ────────────────────────────────────────────────────────────────
const source = process.argv.includes('--source')
  ? process.argv[process.argv.indexOf('--source') + 1]
  : 'Restaurant';

const restaurantGuid = SOURCE_MAP[source] || TOAST_RESTAURANT_GUID;

// ── APPSYNC HELPERS ────────────────────────────────────────────────────────
async function gql(query, variables = {}) {
  const res = await fetch(APPSYNC_URL, {
    method:  "POST",
    headers: { "Content-Type": "application/json", "x-api-key": API_KEY },
    body:    JSON.stringify({ query, variables })
  });
  const json = await res.json();
  if (json.errors) throw new Error(json.errors[0].message);
  return json.data;
}

async function getExistingItems() {
  const data = await gql(`
    query {
      listMenuItems(limit: 500, filter: { itemId: { beginsWith: "${source.substring(0,2).toUpperCase()}-" } }) {
        items { id itemId name }
      }
    }
  `);
  return data.listMenuItems.items || [];
}

async function upsertMenuItem(item) {
  // Try create first — if it fails with duplicate, update instead
  try {
    await gql(`
      mutation CreateMenuItem($input: CreateMenuItemInput!) {
        createMenuItem(input: $input) { id itemId name }
      }
    `, { input: item });
    return 'created';
  } catch (err) {
    if (err.message.includes('already exists') || err.message.includes('ConditionalCheckFailed')) {
      // Find existing record id and update
      const existing = await gql(`
        query {
          listMenuItems(filter: { itemId: { eq: "${item.itemId}" } }) {
            items { id }
          }
        }
      `);
      const id = existing.listMenuItems.items[0]?.id;
      if (id) {
        await gql(`
          mutation UpdateMenuItem($input: UpdateMenuItemInput!) {
            updateMenuItem(input: $input) { id itemId name }
          }
        `, { input: { ...item, id } });
        return 'updated';
      }
    }
    throw err;
  }
}

async function markUnavailable(id) {
  await gql(`
    mutation UpdateMenuItem($input: UpdateMenuItemInput!) {
      updateMenuItem(input: $input) { id }
    }
  `, { input: { id, available: false } });
}

// ── TOAST API FETCH ────────────────────────────────────────────────────────

/**
 * Fetch full menu from Toast.
 * Returns array of menu groups each containing items.
 *
 * Toast Menu structure:
 *   menus[] → menuGroups[] → menuItems[]
 */
async function fetchToastMenu() {
  const headers = await getHeaders(restaurantGuid);

  const res = await fetch(`${TOAST_BASE_URL}/menus/v2/menus`, { headers });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Toast menu fetch failed (${res.status}): ${err}`);
  }

  return res.json();
}

// ── MAP TOAST ITEM → OUR SCHEMA ────────────────────────────────────────────

/**
 * Toast item fields we care about:
 *   guid, name, description, price, salesCategory.name,
 *   modifierGroups (→ customizationOptions), outOfStock (→ available)
 */
function mapToastItem(toastItem, groupName, index) {
  const prefix    = source.substring(0, 2).toUpperCase();
  const itemId    = `${prefix}-TOAST-${toastItem.guid.substring(0, 8).toUpperCase()}`;
  const price     = toastItem.price ?? 0;
  const available = !toastItem.outOfStock;

  // Flatten modifier group option names into our customizationOptions array
  const customizationOptions = [];
  if (toastItem.modifierGroups?.length) {
    toastItem.modifierGroups.forEach(group => {
      group.modifiers?.forEach(mod => {
        customizationOptions.push(mod.name);
      });
    });
  }

  return {
    itemId,
    name:                 toastItem.name,
    description:          toastItem.description || "",
    price,
    category:             groupName,
    available,
    customizationOptions: JSON.stringify(customizationOptions)
  };
}

// ── MAIN ───────────────────────────────────────────────────────────────────
async function syncMenu() {
  console.log(`\n🍞 Toast Menu Sync — Source: ${source}`);
  console.log(`   Restaurant GUID: ${restaurantGuid}\n`);

  // 1. Get existing items from our DB (to detect removed items)
  const existingItems = await getExistingItems();
  const existingIds   = new Set(existingItems.map(i => i.itemId));
  const seenIds       = new Set();

  // 2. Fetch from Toast
  let toastMenus;
  try {
    toastMenus = await fetchToastMenu();
  } catch (err) {
    console.error(`❌ Could not fetch Toast menu: ${err.message}`);
    console.error(`   (This is expected until credentials are configured)`);
    process.exit(1);
  }

  let created = 0, updated = 0, skipped = 0, errors = 0;

  // 3. Walk Toast menu tree: menus → groups → items
  for (const menu of toastMenus) {
    for (const group of menu.menuGroups || []) {
      for (const toastItem of group.menuItems || []) {

        const mapped = mapToastItem(toastItem, group.name);
        seenIds.add(mapped.itemId);

        try {
          const result = await upsertMenuItem(mapped);
          if (result === 'created') {
            console.log(`  ✅ Created  | ${mapped.category.padEnd(20)} | ${mapped.name}`);
            created++;
          } else {
            console.log(`  🔄 Updated  | ${mapped.category.padEnd(20)} | ${mapped.name}`);
            updated++;
          }
        } catch (err) {
          console.error(`  ❌ Error    | ${mapped.name}: ${err.message}`);
          errors++;
        }
      }
    }
  }

  // 4. Mark items no longer in Toast as unavailable
  for (const existing of existingItems) {
    if (!seenIds.has(existing.itemId)) {
      await markUnavailable(existing.id);
      console.log(`  ⚠️  Disabled | ${existing.name} (no longer in Toast)`);
      skipped++;
    }
  }

  console.log(`\n✨ Sync complete!`);
  console.log(`   Created:  ${created}`);
  console.log(`   Updated:  ${updated}`);
  console.log(`   Disabled: ${skipped}`);
  console.log(`   Errors:   ${errors}`);
}

syncMenu().catch(err => {
  console.error("Fatal error:", err.message);
  process.exit(1);
});
