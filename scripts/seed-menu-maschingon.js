/**
 * seed-menu-maschingon.js
 *
 * Seeds Mas Chingon Mexican Grill (Salado) menu items into AppSync.
 * Source: https://maschingonmexicangrill.toast.site/order/mas-chingon-mexican-grill-109-royal-street
 *
 * Usage:
 *   node scripts/seed-menu-maschingon.js
 *
 * Requires Node 18+ (native fetch). Safe to re-run — AppSync will error on
 * duplicate itemIds (caught per-item) so existing records are not overwritten.
 */

// Set these env vars before running:
//   FOOD_APPSYNC_URL=https://....appsync-api.us-east-1.amazonaws.com/graphql
//   FOOD_API_KEY=da2-...
const APPSYNC_URL  = process.env.FOOD_APPSYNC_URL;
const API_KEY      = process.env.FOOD_API_KEY;
const RESTAURANT   = process.env.FOOD_RESTAURANT_ID || 'maschingonrestaurant';

if (!APPSYNC_URL || !API_KEY) {
  console.error('Error: FOOD_APPSYNC_URL and FOOD_API_KEY env vars must be set.');
  process.exit(1);
}

async function gql(query, variables = {}) {
  const res = await fetch(APPSYNC_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': API_KEY },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors) throw new Error(json.errors.map(e => e.message).join(', '));
  return json.data;
}

const CREATE_ITEM = `
  mutation CreateMenuItem($input: CreateMenuItemInput!) {
    createMenuItem(input: $input) { id itemId name price category }
  }
`;

// Standard meat choices used across many items
const MEAT_CHOICES = JSON.stringify([
  {
    name: 'Choice of Meat',
    required: true,
    options: ['Beef Fajita', 'Chicken Fajita', 'Carne Asada', 'Al Pastor', 'Carnitas', 'Chorizo', 'Ground Beef'],
  },
]);

const TORTILLA_CHOICE = JSON.stringify([
  { name: 'Tortilla', required: false, options: ['Flour', 'Corn'] },
]);

// ─── MENU ITEMS ──────────────────────────────────────────────────────────────
const items = [

  // ── APPETIZERS ────────────────────────────────────────────────────────────
  { itemId: 'ITEM-APP-001', category: 'Appetizers', name: 'Chile Con Queso (8 oz)',    price: 6.99  },
  { itemId: 'ITEM-APP-002', category: 'Appetizers', name: 'Chile Con Queso (16 oz)',   price: 10.99 },
  { itemId: 'ITEM-APP-003', category: 'Appetizers', name: 'Chile Con Queso (32 oz)',   price: 14.99 },
  { itemId: 'ITEM-APP-004', category: 'Appetizers', name: 'Guacamole (8 oz)',          price: 6.99  },
  { itemId: 'ITEM-APP-005', category: 'Appetizers', name: 'Guacamole (16 oz)',         price: 10.99 },
  { itemId: 'ITEM-APP-006', category: 'Appetizers', name: 'Asada Fries',               price: 12.99, description: 'Topped with beef, chile con queso, pico de gallo and sour cream.' },
  { itemId: 'ITEM-APP-007', category: 'Appetizers', name: 'Queso Flameado',            price: 10.99, description: 'With melted white cheese.' },
  { itemId: 'ITEM-APP-008', category: 'Appetizers', name: 'Chile Con Queso Nachos',    price: 12.99, description: 'Topped with chile con queso, guacamole, sour cream, pico de gallo, and jalapeños.' },
  { itemId: 'ITEM-APP-009', category: 'Appetizers', name: 'Nachos Supreme',            price: 13.99, description: 'With beans, mixed cheese, lettuce, tomato, guacamole, and sour cream.' },
  { itemId: 'ITEM-APP-010', category: 'Appetizers', name: 'Nachos El Bajío',           price: 12.99, description: 'Chorizo with melted white cheese, charro beans, fresh cheese, pico de gallo, and jalapeños.' },
  { itemId: 'ITEM-APP-011', category: 'Appetizers', name: 'Queso Compuesto',           price: 14.99, description: 'Fried tortilla shell with chile con queso, ground beef, guacamole, and pico de gallo.' },
  { itemId: 'ITEM-APP-012', category: 'Appetizers', name: 'Bean and Cheese Nachos',    price: 10.99 },
  { itemId: 'ITEM-APP-013', category: 'Appetizers', name: 'Salsa Fría (8 oz)',         price: 3.00  },

  // ── MAS CHINGON PLATES ────────────────────────────────────────────────────
  { itemId: 'ITEM-MCP-001', category: 'Mas Chingon Plates', name: '#1 Jefe De Jefes',          price: 19.99, description: 'Bistec ranchero served with guacamole, rice, beans and tortillas.' },
  { itemId: 'ITEM-MCP-002', category: 'Mas Chingon Plates', name: '#2 El Señor De Los Cielos',  price: 19.99, description: 'Carne asada with nopales and grilled onions. Served with lettuce, tomatoes, guacamole, rice, beans and tortillas.' },
  { itemId: 'ITEM-MCP-003', category: 'Mas Chingon Plates', name: '#3 Caro Quintero',           price: 17.99, description: 'Three quesadillas. Served with lettuce, tomatoes, sour cream, rice and beans.', customizationOptions: MEAT_CHOICES },
  { itemId: 'ITEM-MCP-004', category: 'Mas Chingon Plates', name: '#4 El Chapo',                price: 20.00, description: '3 Tacos al carbón served with pico de gallo and charro beans.' },
  { itemId: 'ITEM-MCP-005', category: 'Mas Chingon Plates', name: '#5 Mayo Zambada',            price: 17.99, description: 'Torta Cubana with beef milanesa, ham, fresh white cheese, lettuce, tomato, sour cream and sliced avocado. Comes with French fries.' },
  { itemId: 'ITEM-MCP-006', category: 'Mas Chingon Plates', name: '#6 El Azul',                 price: 14.99, description: 'Large quesadilla with choice of meat. Served with salad, lettuce, pico de gallo and fresh guacamole.', customizationOptions: MEAT_CHOICES },
  { itemId: 'ITEM-MCP-007', category: 'Mas Chingon Plates', name: '#7 Los Ninis',               price: 14.99, description: '5 mini tacos with choice of meat. Comes with charro beans and chile toreado.', customizationOptions: MEAT_CHOICES },
  { itemId: 'ITEM-MCP-008', category: 'Mas Chingon Plates', name: '#8 Fonseca',                 price: 14.99, description: 'Molletes — 2 slices of bread with beans, chorizo, ham, fresh cheese, pico de gallo and avocado.' },
  { itemId: 'ITEM-MCP-009', category: 'Mas Chingon Plates', name: '#9 La Chapiza',              price: 40.00, description: '15 mini tacos with choice of meat. Served with onions, cilantro, grilled onions, chile toreado and 3 orders of charro beans.', customizationOptions: MEAT_CHOICES },
  { itemId: 'ITEM-MCP-010', category: 'Mas Chingon Plates', name: '#10 Ivan Archivaldo',        price: 16.99, description: 'Burrito with choice of meat. Served with lettuce, tomato, beans, cheese. Rice and French fries on the side.', customizationOptions: MEAT_CHOICES },
  { itemId: 'ITEM-MCP-011', category: 'Mas Chingon Plates', name: '#11 Obidio Guzman',          price: 18.00, description: '3 quesabirrias with 8 oz consomé, rice, served with onions and cilantro.' },
  { itemId: 'ITEM-MCP-012', category: 'Mas Chingon Plates', name: '#12 Botas Blancas',          price: 15.99, description: '3 crispy tacos with choice of meat. Served with lettuce, tomatoes, sour cream, cheese. Rice and refried beans on the side.', customizationOptions: MEAT_CHOICES },
  { itemId: 'ITEM-MCP-013', category: 'Mas Chingon Plates', name: '#13 Carne Guisada Plate',    price: 14.99, description: 'Stewed beef, served with rice, beans, guacamole and tortillas.' },
  { itemId: 'ITEM-MCP-014', category: 'Mas Chingon Plates', name: '#14 El Coronel',             price: 18.99, description: 'Cilantro, jalapeño grilled chicken served with rice, beans, and guacamole with flour or corn tortillas.', customizationOptions: TORTILLA_CHOICE },
  { itemId: 'ITEM-MCP-015', category: 'Mas Chingon Plates', name: '#15 El Vaquero',             price: 18.00, description: 'One cheese enchilada with 8 oz steak, rice, refried beans, and guacamole.' },
  { itemId: 'ITEM-MCP-016', category: 'Mas Chingon Plates', name: '#16 La Botana',              price: 23.99, description: 'Beef and chicken fajita, grilled shrimp, smoked sausage, ranchera sauce, onions, jalapeño, tomato, with a cheese quesadilla. Served with tortillas, charro beans and guacamole.' },
  { itemId: 'ITEM-MCP-017', category: 'Mas Chingon Plates', name: '#17 Chicken Chipotle',       price: 16.99, description: 'Chicken breast with chipotle sauce, Monterey cheese and avocado with rice and beans served on the side.' },
  { itemId: 'ITEM-MCP-018', category: 'Mas Chingon Plates', name: '#18 El Capi',                price: 24.99, description: 'Molcajete with beef, chicken, nopales, onions, bell peppers, sauce, tomatoes, 4 grilled shrimp and white cheese. Rice, charro beans, pico de gallo, guacamole and flour or corn tortillas on the side.' },

  // ── PARRILLADAS ───────────────────────────────────────────────────────────
  { itemId: 'ITEM-PAR-001', category: 'Parrilladas', name: '#19 Parrillada Rancho Viejo',    price: 25.99, description: 'Beef and chicken fajita, chorizo and a pork chop with rice, charro beans, pico de gallo, guacamole and tortillas.' },
  { itemId: 'ITEM-PAR-002', category: 'Parrilladas', name: '#20 Chona Parrillada',           price: 19.99, description: 'Beef with nopales on top served with rice, charro beans, pico de gallo, guacamole and tortillas on the side.' },
  { itemId: 'ITEM-PAR-003', category: 'Parrilladas', name: '#21 Fajitas Fuego',              price: 20.00, description: 'Combination of beef and chicken fajita with grilled onion and bell pepper in fuego sauce style with rice, charro beans, guacamole and tortillas on the side.' },
  { itemId: 'ITEM-PAR-004', category: 'Parrilladas', name: '#22 Parrillada Azteca',          price: 21.99, description: 'Chicken fajita, beef, mushrooms, Monterey Jack, with rice, charro beans, pico de gallo, guacamole and tortillas on the side.' },
  { itemId: 'ITEM-PAR-005', category: 'Parrilladas', name: '#23 Parrillada El Tejano',       price: 21.99, description: 'Chicken fajita, beef, and country sausage, with grilled onion and bell pepper, with rice, charro beans, pico de gallo, guacamole and tortillas on the side.' },
  { itemId: 'ITEM-PAR-006', category: 'Parrilladas', name: '#24 Parrillada Mas Chingón',     price: 25.99, description: 'Beef, chicken fajita, 4 grilled shrimps, country sausage, with grilled onion and bell pepper, with rice, charro beans, pico de gallo, guacamole and tortillas on the side.' },
  { itemId: 'ITEM-PAR-007', category: 'Parrilladas', name: 'Piña Loca',                      price: 15.99, description: 'Chicken fajita, beef fajita, bell pepper, grilled onions, chorizo, and melted white cheese on top.' },
  { itemId: 'ITEM-PAR-008', category: 'Parrilladas', name: '#25 Beef & Chicken Fajita',      price: 19.99, description: 'Grilled onions, bell peppers on the side, charro beans, rice, pico and guacamole with tortillas.' },
  { itemId: 'ITEM-PAR-009', category: 'Parrilladas', name: '#26 Parrillada De Camarón',      price: 22.99, description: '12 grilled shrimp served with grilled onion and bell pepper, with rice, charro beans, pico de gallo, guacamole, and tortillas on the side.' },
  { itemId: 'ITEM-PAR-010', category: 'Parrilladas', name: '#27 Pollo Palapa',               price: 18.99, description: 'Chicken breast served with grilled poblano, onion, mushrooms, ranchera sauce, white cheese with rice, charro beans, pico de gallo, guacamole and tortillas on the side.' },
  { itemId: 'ITEM-PAR-011', category: 'Parrilladas', name: '#28 Parrillada Queso Grilled',   price: 16.99, description: 'Grilled Monterey cheese served with bell pepper, onion, mushrooms, chicken fajita with rice, charro beans, pico de gallo, guacamole and tortillas on the side.' },
  { itemId: 'ITEM-PAR-012', category: 'Parrilladas', name: '#29 T-Bone Steak',               price: 25.99, description: '16oz T-bone steak served with grilled onion, bell pepper, with rice, charro beans, pico de gallo and guacamole on the side.' },

  // ── BURRITOS & ENCHILADAS ─────────────────────────────────────────────────
  { itemId: 'ITEM-BUR-001', category: 'Burritos & Enchiladas', name: '#30 El Bajio Burrito',            price: 15.99, description: 'Burrito with choice of meat topped with gravy and melted mixed cheese, with rice and beans on the side.', customizationOptions: MEAT_CHOICES },
  { itemId: 'ITEM-BUR-002', category: 'Burritos & Enchiladas', name: '#31 El Gringo Burrito',           price: 15.99, description: 'Chicken fajita burrito topped with chile con queso, with rice, beans, lettuce and tomato on the side.' },
  { itemId: 'ITEM-BUR-003', category: 'Burritos & Enchiladas', name: '#32 Enchiladas Rojas',            price: 14.99, description: '3 enchiladas with ground beef, cheese or shredded chicken topped with gravy and melted mixed cheese, with rice and beans on the side.' },
  { itemId: 'ITEM-BUR-004', category: 'Burritos & Enchiladas', name: '#33 Enchiladas Verdes',           price: 14.99, description: '3 enchiladas with tomatillo sauce, cheese, shredded chicken or ground beef topped with melted white cheese, with rice and beans on the side.' },
  { itemId: 'ITEM-BUR-005', category: 'Burritos & Enchiladas', name: '#35 Chile Con Queso Enchiladas',  price: 14.99, description: '3 enchiladas with shredded chicken or ground beef topped with chile con queso, with rice and beans on the side.' },

  // ── SALADS ────────────────────────────────────────────────────────────────
  { itemId: 'ITEM-SAL-001', category: 'Salads', name: 'Buffalo Chicken Tender Salad', price: 13.99, description: 'Crispy buffalo chicken tenders over lettuce, tomato, bacon, and white queso.' },
  { itemId: 'ITEM-SAL-002', category: 'Salads', name: 'Chicken Bowl',                 price: 15.99, description: 'Grilled chicken with lettuce, avocado, tomato, black beans, and fresh queso fresco.' },
  { itemId: 'ITEM-SAL-003', category: 'Salads', name: 'Salado Salad',                 price: 17.99, description: '8 oz grilled chicken, avocado, corn, romaine lettuce, cherry tomatoes, and mixed queso.' },
  { itemId: 'ITEM-SAL-004', category: 'Salads', name: 'Mas Chingón Salad',            price: 17.99, description: 'Romaine lettuce, cucumber, tomato, broccoli, corn, avocado, 8 oz grilled chicken, and white queso.' },
  { itemId: 'ITEM-SAL-005', category: 'Salads', name: 'Taco Salad',                   price: 11.99, description: 'Chicken, ground beef, or beef fajita with lettuce, tomato, guacamole, sour cream, and shredded cheese.', customizationOptions: MEAT_CHOICES },
  { itemId: 'ITEM-SAL-006', category: 'Salads', name: 'Chile Con Queso Rice Bowl',    price: 15.99, description: '8 oz grilled chicken over 16 oz rice, topped with 8 oz chile con queso.' },

  // ── SEAFOOD & SPECIALTY ───────────────────────────────────────────────────
  { itemId: 'ITEM-SEA-001', category: 'Seafood & Specialty', name: '#36 El Charro Plate',          price: 14.00, description: 'Pork asado in red sauce. Served with rice and charro beans.' },
  { itemId: 'ITEM-SEA-002', category: 'Seafood & Specialty', name: '#37 Camarones a la Diabla',    price: 14.99, description: 'Shrimp in spicy diabla sauce. Served with rice, beans, lettuce, tomato, sour cream, and tortillas.' },
  { itemId: 'ITEM-SEA-003', category: 'Seafood & Specialty', name: '#38 Camarones a la Mexicana',  price: 14.99, description: 'Grilled shrimp with grilled onions, jalapeños, and tomatoes. Served with rice, beans, lettuce, tomato, sour cream, and tortillas.' },
  { itemId: 'ITEM-SEA-004', category: 'Seafood & Specialty', name: '#39 Tamale Plate',             price: 14.99, description: '3 tamales topped with gravy and mixed cheese. Served with rice and beans.' },
  { itemId: 'ITEM-SEA-005', category: 'Seafood & Specialty', name: '#40 Guanajuato Plate',         price: 15.99, description: '3 chicken flautas topped with lettuce, sour cream, and fresh cheese. Served with rice, beans, pico de gallo, and guacamole.' },
  { itemId: 'ITEM-SEA-006', category: 'Seafood & Specialty', name: '#41 Chimichanga',              price: 15.99, description: 'Deep-fried burrito filled with ground beef, asada, or chicken fajita, topped with gravy and chile con queso. Served with rice and beans.', customizationOptions: MEAT_CHOICES },
  { itemId: 'ITEM-SEA-007', category: 'Seafood & Specialty', name: '#42 American Plate',           price: 14.99, description: '1 red enchilada with ground beef topped with gravy and mixed cheese + 1 crispy taco with ground beef, lettuce, tomato, and mixed cheese. Served with rice and beans.' },
  { itemId: 'ITEM-SEA-008', category: 'Seafood & Specialty', name: '#43 Texas Plate',              price: 12.99, description: '1 red enchilada + 1 ground beef tostada + 1 crispy taco with ground beef. Served with lettuce, tomato, sour cream, and guacamole.' },
  { itemId: 'ITEM-SEA-009', category: 'Seafood & Specialty', name: 'Mojarra Frita',               price: 15.99, description: 'Fried tilapia served with rice, lettuce, tomato, avocado, french fries, and tortillas.' },
  { itemId: 'ITEM-SEA-010', category: 'Seafood & Specialty', name: 'Coctel de Camarón',           price: 14.99, description: '12 shrimp cocktail with pico de gallo, avocado crackers and salad on the side.' },
  { itemId: 'ITEM-SEA-011', category: 'Seafood & Specialty', name: 'Ceviche de Camarón',          price: 20.00, description: 'Cucumber, avocado and tostadas on the side.' },
  { itemId: 'ITEM-SEA-012', category: 'Seafood & Specialty', name: 'Tostada de Ceviche',          price: 5.99,  description: 'With avocado.' },
  { itemId: 'ITEM-SEA-013', category: 'Seafood & Specialty', name: 'Caldo de Camarón',            price: 15.99, description: 'Cucumber, avocado and tostadas on the side.' },
  { itemId: 'ITEM-SEA-014', category: 'Seafood & Specialty', name: 'Caldo de Mariscos',           price: 15.99 },

  // ── TACOS & FAVORITES ─────────────────────────────────────────────────────
  { itemId: 'ITEM-TAC-001', category: 'Tacos & Favorites', name: 'Taco',                   price: 3.99,  customizationOptions: MEAT_CHOICES },
  { itemId: 'ITEM-TAC-002', category: 'Tacos & Favorites', name: 'Mini Taco',              price: 2.00,  customizationOptions: MEAT_CHOICES },
  { itemId: 'ITEM-TAC-003', category: 'Tacos & Favorites', name: 'Gordita',                price: 5.99,  description: 'Served with pico de gallo on the side.', customizationOptions: MEAT_CHOICES },
  { itemId: 'ITEM-TAC-004', category: 'Tacos & Favorites', name: 'Torta',                  price: 10.99, description: 'Lettuce, tomato, avocado and sour cream.', customizationOptions: MEAT_CHOICES },
  { itemId: 'ITEM-TAC-005', category: 'Tacos & Favorites', name: 'Burrito',                price: 10.99, description: 'Lettuce, tomato, cheese and beans.', customizationOptions: MEAT_CHOICES },
  { itemId: 'ITEM-TAC-006', category: 'Tacos & Favorites', name: 'Tostada',                price: 4.50,  customizationOptions: MEAT_CHOICES },
  { itemId: 'ITEM-TAC-007', category: 'Tacos & Favorites', name: 'Bean and Cheese Burrito', price: 5.99 },
  { itemId: 'ITEM-TAC-008', category: 'Tacos & Favorites', name: 'Bean and Cheese Taco',   price: 3.25 },

  // ── BURGERS ───────────────────────────────────────────────────────────────
  { itemId: 'ITEM-BRG-001', category: 'Burgers', name: 'Mas Chingon Mexican Burger', price: 14.99, description: 'Two beef patties, ham, white cheese, grilled onions and bacon. Served with French fries.' },
  { itemId: 'ITEM-BRG-002', category: 'Burgers', name: 'Bacon Cheese Burger',        price: 12.99, description: 'Served with French fries.' },
  { itemId: 'ITEM-BRG-003', category: 'Burgers', name: 'Cheese Burger',              price: 11.99, description: 'Served with French fries.' },

  // ── KIDS ──────────────────────────────────────────────────────────────────
  { itemId: 'ITEM-KID-001', category: 'Kids', name: 'Kids Enchilada Plate',       price: 10.99, description: 'One enchilada with cheese topped with gravy and mixed cheese, with rice and beans on the side.' },
  { itemId: 'ITEM-KID-002', category: 'Kids', name: 'Kids Quesadilla Plate',      price: 6.75,  description: 'Served with rice and beans.' },
  { itemId: 'ITEM-KID-003', category: 'Kids', name: 'Kids Cheese Enchilada',      price: 7.99,  description: '1 cheese enchilada with gravy and mixed cheese. Served with rice and beans.' },
  { itemId: 'ITEM-KID-004', category: 'Kids', name: 'Chicken Nuggets',            price: 9.99  },
  { itemId: 'ITEM-KID-005', category: 'Kids', name: 'Chicken Tenders',            price: 10.99 },
  { itemId: 'ITEM-KID-006', category: 'Kids', name: 'Kids Cheese Burger',         price: 11.99 },
  { itemId: 'ITEM-KID-007', category: 'Kids', name: 'Kids Crispy Taco Plate',     price: 6.99  },
  { itemId: 'ITEM-KID-008', category: 'Kids', name: 'Kids CCQ Enchilada',         price: 11.25 },

  // ── CALDOS ────────────────────────────────────────────────────────────────
  { itemId: 'ITEM-CAL-001', category: 'Caldos', name: 'Menudo Caldo',   price: 14.99 },
  { itemId: 'ITEM-CAL-002', category: 'Caldos', name: 'Tortilla Soup',  price: 10.99 },

  // ── DRINKS ────────────────────────────────────────────────────────────────
  { itemId: 'ITEM-DRK-001', category: 'Drinks', name: 'Mexican Coca Cola',      price: 3.75  },
  { itemId: 'ITEM-DRK-002', category: 'Drinks', name: 'Jarritos',               price: 3.50  },
  { itemId: 'ITEM-DRK-003', category: 'Drinks', name: 'Fountain Soda',          price: 2.50, description: 'Free refills.' },
  { itemId: 'ITEM-DRK-004', category: 'Drinks', name: 'Topo Chico',             price: 3.50  },
  { itemId: 'ITEM-DRK-005', category: 'Drinks', name: 'Aguas Frescas',          price: 6.99, description: 'Free refills only if consumed in the restaurant.' },
  { itemId: 'ITEM-DRK-006', category: 'Drinks', name: 'Orange Juice (20 oz)',   price: 8.99  },
  { itemId: 'ITEM-DRK-007', category: 'Drinks', name: 'Sweet Tea',              price: 3.99  },
  { itemId: 'ITEM-DRK-008', category: 'Drinks', name: 'Unsweetened Tea',        price: 3.99  },

  // ── DESSERTS ──────────────────────────────────────────────────────────────
  { itemId: 'ITEM-DES-001', category: 'Desserts', name: 'Sopapillas', price: 6.99 },
  { itemId: 'ITEM-DES-002', category: 'Desserts', name: 'Pastel',     price: 5.99 },
];

// ─── SEED ─────────────────────────────────────────────────────────────────────
async function seed() {
  console.log(`Seeding ${items.length} items for restaurant: ${RESTAURANT}\n`);
  let created = 0;
  let skipped = 0;
  let failed  = 0;

  for (const item of items) {
    try {
      await gql(CREATE_ITEM, {
        input: {
          itemId:               item.itemId,
          restaurant_id:        RESTAURANT,
          category:             item.category,
          name:                 item.name,
          price:                item.price,
          description:          item.description   || null,
          available:            true,
          customizationOptions: item.customizationOptions || null,
        },
      });
      console.log(`  ✓  ${item.itemId}  ${item.name}`);
      created++;
    } catch (err) {
      if (err.message.includes('ConditionalCheckFailedException') || err.message.includes('already exists')) {
        console.log(`  –  ${item.itemId}  ${item.name}  (skipped — already exists)`);
        skipped++;
      } else {
        console.error(`  ✗  ${item.itemId}  ${item.name}  ERROR: ${err.message}`);
        failed++;
      }
    }
  }

  console.log(`\n──────────────────────────────`);
  console.log(`Created: ${created}  |  Skipped: ${skipped}  |  Failed: ${failed}`);
}

seed();
