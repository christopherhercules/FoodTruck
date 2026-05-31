const { Amplify } = require('aws-amplify');
const { generateClient } = require('aws-amplify/api');
const config = require('../amplify_outputs.json');

Amplify.configure(config);
const client = generateClient();

const menuItems = [
  // BREAKFAST
  { itemId: 'ITEM-FT-001', category: 'Breakfast', name: 'Huevo a la Mexicana', price: 10.44, description: 'Mexican-style scrambled eggs with beans, potatoes, tortillas', available: true, customizationOptions: JSON.stringify(['Corn Tortillas', 'Flour Tortillas']) },
  { itemId: 'ITEM-FT-002', category: 'Breakfast', name: 'Chorizo and Eggs', price: 10.44, description: 'Spicy Mexican sausage with eggs, beans, potatoes', available: true, customizationOptions: JSON.stringify(['Corn Tortillas', 'Flour Tortillas']) },
  { itemId: 'ITEM-FT-003', category: 'Breakfast', name: 'Bacon and Eggs', price: 10.44, description: 'Classic bacon and eggs with beans, potatoes', available: true, customizationOptions: JSON.stringify(['Corn Tortillas', 'Flour Tortillas']) },
  { itemId: 'ITEM-FT-004', category: 'Breakfast', name: 'Breakfast Tacos', price: 4.15, description: 'Choice of filling', available: true, customizationOptions: JSON.stringify(['Egg & Bacon', 'Egg & Chorizo', 'Egg & Ham']) },
  { itemId: 'ITEM-FT-005', category: 'Breakfast', name: 'Breakfast Burritos', price: 9.39, description: 'Large burrito with eggs, beans, cheese', available: true, customizationOptions: JSON.stringify(['Bacon', 'Ham', 'Chorizo']) },

  // MAIN
  { itemId: 'ITEM-FT-006', category: 'Main', name: 'Street Tacos', price: 4.94, description: 'Authentic street tacos with cilantro and onion', available: true, customizationOptions: JSON.stringify(['Carne Asada', 'Al Pastor', 'Chicken Fajita', 'Campechana']) },
  { itemId: 'ITEM-FT-007', category: 'Main', name: 'Quesadillas', price: 4.94, description: 'Grilled with cheese and choice of meat', available: true, customizationOptions: JSON.stringify(['Carne Asada', 'Chicken', 'Al Pastor', 'Cheese Only']) },
  { itemId: 'ITEM-FT-008', category: 'Main', name: 'Burritos', price: 10.44, description: 'Choice of meat, lettuce, tomato, cheese, beans', available: true, customizationOptions: JSON.stringify(['Carne Asada', 'Chicken', 'Al Pastor', 'Carnitas']) },
  { itemId: 'ITEM-FT-009', category: 'Main', name: 'Gorditas', price: 7.29, description: 'Thick corn tortilla with beans, cheese, meat, pico de gallo', available: true, customizationOptions: JSON.stringify(['Carne Asada', 'Chicken', 'Al Pastor']) },
  { itemId: 'ITEM-FT-010', category: 'Main', name: 'Tortas', price: 10.44, description: 'Mexican sandwich with meat, lettuce, tomato, sour cream, avocado', available: true, customizationOptions: JSON.stringify(['Carne Asada', 'Chicken', 'Ham', 'Milanesa']) },
  { itemId: 'ITEM-FT-011', category: 'Main', name: 'Asada Fries', price: 13.59, description: 'French fries with meat, cheese, sour cream, pico de gallo', available: true, customizationOptions: JSON.stringify(['Carne Asada', 'Chicken', 'Al Pastor']) },

  // ANTOJITOS
  { itemId: 'ITEM-FT-012', category: 'Antojitos', name: 'Tostada de Ceviche Shrimp', price: 8.34, description: 'Fresh shrimp ceviche on crispy tostada', available: true, customizationOptions: JSON.stringify([]) },
  { itemId: 'ITEM-FT-013', category: 'Antojitos', name: 'Vaso de Elote', price: 8.34, description: 'Mexican street corn in a cup', available: true, customizationOptions: JSON.stringify([]) },
  { itemId: 'ITEM-FT-014', category: 'Antojitos', name: 'Duros Preparado', price: 10.44, description: 'With cabbage, cueritos, tomato, cream, avocado, salsa', available: true, customizationOptions: JSON.stringify([]) },

  // SPECIALTY
  { itemId: 'ITEM-FT-015', category: 'Specialty', name: 'El Jefe de Jefes', price: 18.84, description: '3 steak tacos with pico de gallo & 3 cheese quesadillas', available: true, customizationOptions: JSON.stringify([]) },
  { itemId: 'ITEM-FT-016', category: 'Specialty', name: 'El Chapo', price: 16.74, description: '4 tacos: Have it your way', available: true, customizationOptions: JSON.stringify(['Carne Asada', 'Chicken', 'Al Pastor', 'Campechana']) },
  { itemId: 'ITEM-FT-017', category: 'Specialty', name: 'Caro Quintero', price: 15.69, description: '2 tacos & 2 quesadillas (your choice of meat)', available: true, customizationOptions: JSON.stringify(['Carne Asada', 'Chicken', 'Al Pastor']) },
  { itemId: 'ITEM-FT-018', category: 'Specialty', name: 'Los Ninis', price: 12.54, description: '5 mini tacos (1 choice of meat)', available: true, customizationOptions: JSON.stringify(['Carne Asada', 'Chicken', 'Al Pastor']) },
  { itemId: 'ITEM-FT-019', category: 'Specialty', name: 'La Chapiza', price: 29.35, description: '15 mini tacos (one choice of meat)', available: true, customizationOptions: JSON.stringify(['Carne Asada', 'Chicken', 'Al Pastor']) },

  // DRINKS
  { itemId: 'ITEM-FT-020', category: 'Drinks', name: 'Aguas Frescas', price: 8.09, description: 'Fresh fruit waters', available: true, customizationOptions: JSON.stringify(['Horchata', 'Jamaica', 'Tamarindo']) },
  { itemId: 'ITEM-FT-021', category: 'Drinks', name: 'Smoothie', price: 8.34, description: 'Blended fruit smoothie', available: true, customizationOptions: JSON.stringify(['Strawberry', 'Mango', 'Mixed Berry']) },
  { itemId: 'ITEM-FT-022', category: 'Drinks', name: 'Snow Cone', price: 9.39, description: 'Shaved ice with syrup', available: true, customizationOptions: JSON.stringify(['Cherry', 'Blue Raspberry', 'Mango']) },
  { itemId: 'ITEM-FT-023', category: 'Drinks', name: 'Fruit Cup', price: 9.39, description: 'Fresh fruit cup', available: true, customizationOptions: JSON.stringify([]) },
];

async function populateMenu() {
  console.log('Seeding Mas Chingon Food Truck Menu...\n');

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

  for (const item of menuItems) {
    try {
      const result = await client.graphql({ query: mutation, variables: { input: item } });
      const r = result.data.createMenuItem;
      console.log(`OK  ${r.category.padEnd(12)} | ${r.name.padEnd(40)} | $${r.price}`);
    } catch (error) {
      console.error(`ERR ${item.name}:`, error.errors?.[0]?.message || error.message);
    }
  }

  console.log(`\nDone. ${menuItems.length} items seeded.`);
}

populateMenu();
