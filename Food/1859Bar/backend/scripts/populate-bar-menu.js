/**
 * Populates Bar 1859 menu items into the shared MasChingon DynamoDB backend.
 * Uses direct fetch — no Amplify SDK needed.
 *
 * Run: node scripts/populate-bar-menu.js
 */

const APPSYNC_URL = "https://d2zlzofjerf4hd6gltypy2rnlm.appsync-api.us-east-1.amazonaws.com/graphql";
const API_KEY = "da2-6l2dtmahczbbnlp3m2vmgihqby";

const menuItems = [
  // ── COCKTAILS ───────────────────────────────────────────────────────────
  { itemId: 'BAR-001', category: 'Cocktails', name: 'Classic Margarita', price: 11.00, description: 'Tequila, triple sec, fresh lime, salted rim', available: true, customizationOptions: JSON.stringify(['On the Rocks', 'Frozen', 'No Salt', 'Salt Rim']) },
  { itemId: 'BAR-002', category: 'Cocktails', name: 'Spicy Ranch Water', price: 12.00, description: 'Tequila, Topo Chico, fresh lime, jalapeño', available: true, customizationOptions: JSON.stringify(['Mild', 'Medium', 'Extra Spicy']) },
  { itemId: 'BAR-003', category: 'Cocktails', name: 'Old Fashioned', price: 13.00, description: 'Bourbon, Angostura bitters, orange peel, sugar cube', available: true, customizationOptions: JSON.stringify(['Bourbon', 'Rye', 'Rocks', 'Neat']) },
  { itemId: 'BAR-004', category: 'Cocktails', name: 'Paloma', price: 11.00, description: 'Tequila, grapefruit juice, fresh lime, soda', available: true, customizationOptions: JSON.stringify(['Salt Rim', 'No Salt', 'Extra Lime']) },
  { itemId: 'BAR-005', category: 'Cocktails', name: 'Whiskey Sour', price: 12.00, description: 'Bourbon, fresh lemon juice, simple syrup, egg white', available: true, customizationOptions: JSON.stringify(['With Egg White', 'Without Egg White']) },
  { itemId: 'BAR-006', category: 'Cocktails', name: 'Espresso Martini', price: 14.00, description: 'Vodka, fresh espresso, coffee liqueur, sugar syrup', available: true, customizationOptions: JSON.stringify([]) },
  { itemId: 'BAR-007', category: 'Cocktails', name: 'Aperol Spritz', price: 12.00, description: 'Aperol, Prosecco, soda, orange slice', available: true, customizationOptions: JSON.stringify([]) },
  { itemId: 'BAR-008', category: 'Cocktails', name: 'Moscow Mule', price: 12.00, description: 'Vodka, ginger beer, fresh lime, mint', available: true, customizationOptions: JSON.stringify([]) },

  // ── BEER ────────────────────────────────────────────────────────────────
  { itemId: 'BAR-010', category: 'Beer', name: 'Draft Beer', price: 4.00, description: 'Ask your bartender what\'s on tap today', available: true, customizationOptions: JSON.stringify([]) },
  { itemId: 'BAR-011', category: 'Beer', name: 'Domestic Bottle', price: 5.00, description: 'Bud Light, Coors Light, Miller Lite', available: true, customizationOptions: JSON.stringify(['Bud Light', 'Coors Light', 'Miller Lite']) },
  { itemId: 'BAR-012', category: 'Beer', name: 'Import / Craft Bottle', price: 6.00, description: 'Shiner Bock, Modelo, Dos Equis, rotating craft', available: true, customizationOptions: JSON.stringify(['Shiner Bock', 'Modelo Especial', 'Dos Equis', 'Ask Bartender']) },

  // ── WINE ────────────────────────────────────────────────────────────────
  { itemId: 'BAR-020', category: 'Wine', name: 'House Red Wine', price: 9.00, description: 'Glass of house red — full-bodied with smooth finish', available: true, customizationOptions: JSON.stringify(['Glass', 'Large Pour']) },
  { itemId: 'BAR-021', category: 'Wine', name: 'House White Wine', price: 9.00, description: 'Glass of house white — crisp and light', available: true, customizationOptions: JSON.stringify(['Glass', 'Large Pour']) },
  { itemId: 'BAR-022', category: 'Wine', name: 'House Rosé', price: 9.00, description: 'Dry, refreshing Provence-style rosé', available: true, customizationOptions: JSON.stringify(['Glass', 'Large Pour']) },
  { itemId: 'BAR-023', category: 'Wine', name: 'Premium Wine', price: 12.00, description: 'Ask about our old & new world selections', available: true, customizationOptions: JSON.stringify([]) },

  // ── BOURBON BAR ─────────────────────────────────────────────────────────
  { itemId: 'BAR-030', category: 'Bourbon', name: 'Bourbon — Standard', price: 10.00, description: 'Buffalo Trace, Bulleit, Maker\'s Mark, Four Roses', available: true, customizationOptions: JSON.stringify(['Buffalo Trace', "Bulleit", "Maker's Mark", 'Four Roses', 'Neat', 'Rocks', 'Water Back']) },
  { itemId: 'BAR-031', category: 'Bourbon', name: 'Bourbon — Premium', price: 14.00, description: 'Woodford Reserve, Knob Creek, Angel\'s Envy, Blanton\'s', available: true, customizationOptions: JSON.stringify(["Woodford Reserve", "Knob Creek", "Angel's Envy", "Blanton's", 'Neat', 'Rocks', 'Water Back']) },
  { itemId: 'BAR-032', category: 'Bourbon', name: 'Rye Whiskey', price: 11.00, description: 'High West, Rittenhouse, WhistlePig', available: true, customizationOptions: JSON.stringify(['High West', 'Rittenhouse', 'WhistlePig', 'Neat', 'Rocks']) },
  { itemId: 'BAR-033', category: 'Bourbon', name: 'Scotch', price: 13.00, description: 'Glenfiddich 12, Macallan 12, Laphroaig', available: true, customizationOptions: JSON.stringify(['Glenfiddich 12', 'Macallan 12', 'Laphroaig', 'Neat', 'Rocks']) },

  // ── SHAREABLES ──────────────────────────────────────────────────────────
  { itemId: 'BAR-040', category: 'Shareables', name: 'Bar 1859 Dip Trio', price: 13.00, description: 'Beer cheese queso, Hatch chile verde crema, house-made salsa with chips', available: true, customizationOptions: JSON.stringify([]) },
  { itemId: 'BAR-041', category: 'Shareables', name: 'Housemade Queso & Chips', price: 9.00, description: 'Bell peppers, onion, jalapeño heat', available: true, customizationOptions: JSON.stringify(['Add Jalapeños', 'Extra Chips +$2']) },
  { itemId: 'BAR-042', category: 'Shareables', name: 'Sherry Spinach Artichoke Dip', price: 10.00, description: 'Bacon, parmesan crust, served with warm baguettes', available: true, customizationOptions: JSON.stringify([]) },
  { itemId: 'BAR-043', category: 'Shareables', name: 'Warm Pretzel with Queso', price: 16.00, description: '12" pretzel with coarse salt and beer cheese queso', available: true, customizationOptions: JSON.stringify([]) },
  { itemId: 'BAR-044', category: 'Shareables', name: 'Santa Fe Egg Rolls', price: 13.00, description: 'Baked rolls with chicken, beans, corn; avocado ranch & salsa', available: true, customizationOptions: JSON.stringify([]) },
  { itemId: 'BAR-045', category: 'Shareables', name: 'Garlic & Cheese Artisan Bread', price: 8.00, description: 'House-crafted garlic spread, mozzarella, parmesan', available: true, customizationOptions: JSON.stringify([]) },

  // ── BOARDS & SMALL PLATES ───────────────────────────────────────────────
  { itemId: 'BAR-050', category: 'Boards', name: 'Charcuterie Board', price: 29.00, description: 'Cured meats, artisan cheeses, seasonal fruit, nuts & baguettes (serves 2)', available: true, customizationOptions: JSON.stringify([]) },
  { itemId: 'BAR-051', category: 'Boards', name: 'Crab Cake Canapés', price: 14.00, description: 'Five mini crab cakes on cucumber with bell pepper coulis', available: true, customizationOptions: JSON.stringify([]) },
  { itemId: 'BAR-052', category: 'Boards', name: 'Bruschetta Caprese', price: 12.00, description: 'Fresh mozzarella, heirloom tomato, basil, balsamic glaze', available: true, customizationOptions: JSON.stringify([]) },
  { itemId: 'BAR-053', category: 'Boards', name: 'Petite Beef Wellington', price: 16.00, description: 'Tenderloin wrapped in pastry with demi-glace', available: true, customizationOptions: JSON.stringify([]) },

  // ── FROM THE KITCHEN ────────────────────────────────────────────────────
  { itemId: 'BAR-060', category: 'Kitchen', name: 'Brisket Nachos', price: 16.00, description: 'Chips, queso, slow-smoked brisket, jalapeños, sour cream', available: true, customizationOptions: JSON.stringify(['Extra Jalapeños', 'Extra Sour Cream']) },
  { itemId: 'BAR-061', category: 'Kitchen', name: 'Korean BBQ Chicken Skewers', price: 18.00, description: 'Three skewers with Asian slaw & Hatch Valley Mac & Cheese', available: true, customizationOptions: JSON.stringify([]) },
  { itemId: 'BAR-062', category: 'Kitchen', name: 'Asian Chicken Tacos', price: 14.00, description: 'Three tacos with Korean BBQ chicken, Asian slaw, soy vinaigrette', available: true, customizationOptions: JSON.stringify([]) },
  { itemId: 'BAR-063', category: 'Kitchen', name: 'Tequila-Lime Skirt Steak Tacos', price: 14.00, description: 'Marinated skirt steak, cotija cheese, fresh cilantro', available: true, customizationOptions: JSON.stringify([]) },
  { itemId: 'BAR-064', category: 'Kitchen', name: 'B.Y.O. Burger', price: 11.00, description: '7oz patty, brioche bun, fries — customize your way', available: true, customizationOptions: JSON.stringify(['Add Bacon +$2', 'Add Cheese +$1', 'Medium', 'Well Done']) },
  { itemId: 'BAR-065', category: 'Kitchen', name: 'Hatch Valley Mac & Cheese', price: 5.00, description: 'White cheddar mac with green chilis and bacon', available: true, customizationOptions: JSON.stringify([]) },

  // ── ARTISAN PIZZA ───────────────────────────────────────────────────────
  { itemId: 'BAR-070', category: 'Pizza', name: 'Cheese Pizza', price: 15.00, description: 'Classic house tomato sauce, fresh mozzarella', available: true, customizationOptions: JSON.stringify(['Gluten-Free Crust +$3']) },
  { itemId: 'BAR-071', category: 'Pizza', name: 'Pepperoni Pizza', price: 16.00, description: 'House sauce, mozzarella, classic pepperoni', available: true, customizationOptions: JSON.stringify(['Gluten-Free Crust +$3']) },
  { itemId: 'BAR-072', category: 'Pizza', name: 'Carnivore Pizza', price: 18.00, description: 'Italian sausage, pepperoni, and crispy bacon', available: true, customizationOptions: JSON.stringify(['Gluten-Free Crust +$3']) },
  { itemId: 'BAR-073', category: 'Pizza', name: 'House-Smoked Brisket Pizza', price: 18.00, description: 'Slow-smoked brisket, BBQ drizzle, red onion, jalapeño', available: true, customizationOptions: JSON.stringify(['Gluten-Free Crust +$3']) },
  { itemId: 'BAR-074', category: 'Pizza', name: 'Blackberry Brie Pizza', price: 18.00, description: 'Brie, blackberry jam, prosciutto, jalapeño — sweet & savory', available: true, customizationOptions: JSON.stringify(['Gluten-Free Crust +$3']) },

  // ── SWEETS ──────────────────────────────────────────────────────────────
  { itemId: 'BAR-080', category: 'Sweets', name: 'New York Cheesecake', price: 9.00, description: 'Classic cheesecake with seasonal toppings', available: true, customizationOptions: JSON.stringify(['Chocolate Sauce +$1', 'Caramel Sauce +$1', 'Strawberry Sauce +$1']) },
  { itemId: 'BAR-081', category: 'Sweets', name: 'Beignets', price: 9.00, description: 'Five per order, tossed in powdered sugar', available: true, customizationOptions: JSON.stringify(['Chocolate Sauce +$1', 'Caramel Sauce +$1']) },
  { itemId: 'BAR-082', category: 'Sweets', name: 'Fudge Lava Cake', price: 9.00, description: 'Warm chocolate lava cake with molten center', available: true, customizationOptions: JSON.stringify(['Chocolate Sauce +$1', 'Caramel Sauce +$1']) },
  { itemId: 'BAR-083', category: 'Sweets', name: 'Chocolate Decadence Cake', price: 10.00, description: 'Chocolate cake, chocolate mousse, ganache — serves 2', available: true, customizationOptions: JSON.stringify(['Chocolate Sauce +$1', 'Caramel Sauce +$1', 'Strawberry Sauce +$1']) },

  // ── NON-ALCOHOLIC ────────────────────────────────────────────────────────
  { itemId: 'BAR-090', category: 'Non-Alcoholic', name: 'Soda', price: 3.00, description: 'Coke, Diet Coke, Sprite, Dr Pepper', available: true, customizationOptions: JSON.stringify(['Coke', 'Diet Coke', 'Sprite', 'Dr Pepper']) },
  { itemId: 'BAR-091', category: 'Non-Alcoholic', name: 'Topo Chico', price: 3.00, description: 'Mexican mineral water — sparkling', available: true, customizationOptions: JSON.stringify([]) },
  { itemId: 'BAR-092', category: 'Non-Alcoholic', name: 'Virgin Margarita', price: 7.00, description: 'Fresh lime, triple sec, sweet & sour — no tequila', available: true, customizationOptions: JSON.stringify(['Salt Rim', 'No Salt', 'Frozen', 'On the Rocks']) },
  { itemId: 'BAR-093', category: 'Non-Alcoholic', name: 'Fresh Lemonade', price: 5.00, description: 'House-made lemonade with fresh squeezed lemons', available: true, customizationOptions: JSON.stringify(['Regular', 'Strawberry', 'Mango']) },
];

const mutation = `
  mutation CreateMenuItem($input: CreateMenuItemInput!) {
    createMenuItem(input: $input) {
      id
      name
      category
      price
    }
  }
`;

async function gql(query, variables = {}) {
  const res = await fetch(APPSYNC_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY
    },
    body: JSON.stringify({ query, variables })
  });
  const json = await res.json();
  if (json.errors) throw new Error(json.errors[0].message);
  return json.data;
}

async function populateMenu() {
  console.log('🍺 Populating Bar 1859 Menu...\n');
  let success = 0;
  let failed = 0;

  for (const item of menuItems) {
    try {
      const result = await gql(mutation, { input: item });
      const m = result.createMenuItem;
      console.log(`✅ ${m.category.padEnd(14)} | ${m.name.padEnd(40)} | $${m.price.toFixed(2)}`);
      success++;
    } catch (error) {
      console.error(`❌ Error adding ${item.name}:`, error.message);
      failed++;
    }
  }

  console.log(`\n✨ Done! ${success} added, ${failed} failed out of ${menuItems.length} items.`);
}

populateMenu();
