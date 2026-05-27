const { Amplify } = require('aws-amplify');
const { generateClient } = require('aws-amplify/api');
const config = require('../amplify_outputs.json');

Amplify.configure(config);
const client = generateClient();

const menuItems = [
  // BREAKFAST PLATES
  { itemId: 'ITEM-001', category: 'Breakfast', name: 'Huevo a la Mexicana', price: 10.44, description: 'Mexican-style scrambled eggs with beans, potatoes, tortillas', available: true, customizationOptions: JSON.stringify(['Corn Tortillas', 'Flour Tortillas']) },
  { itemId: 'ITEM-002', category: 'Breakfast', name: 'Chorizo and Eggs', price: 10.44, description: 'Spicy Mexican sausage with eggs, beans, potatoes', available: true, customizationOptions: JSON.stringify(['Corn Tortillas', 'Flour Tortillas']) },
  { itemId: 'ITEM-003', category: 'Breakfast', name: 'Bacon and Eggs', price: 10.44, description: 'Classic bacon and eggs with beans, potatoes', available: true, customizationOptions: JSON.stringify(['Corn Tortillas', 'Flour Tortillas']) },
  { itemId: 'ITEM-004', category: 'Breakfast', name: 'Ham and Eggs', price: 10.44, description: 'Ham and eggs with beans, potatoes', available: true, customizationOptions: JSON.stringify(['Corn Tortillas', 'Flour Tortillas']) },
  { itemId: 'ITEM-005', category: 'Breakfast', name: 'Pancake Plate', price: 12.54, description: '2 bacon, 2 eggs, 2 pancakes', available: true, customizationOptions: JSON.stringify([]) },
  { itemId: 'ITEM-006', category: 'Breakfast', name: 'Breakfast Croissant', price: 7.29, description: 'Egg, cheese, choice of bacon or ham', available: true, customizationOptions: JSON.stringify(['Bacon', 'Ham']) },
  { itemId: 'ITEM-007', category: 'Breakfast', name: 'Breakfast Sandwich', price: 9.39, description: 'Egg, bacon, cheese, avocado on toasted bread', available: true, customizationOptions: JSON.stringify([]) },
  
  // BREAKFAST TACOS/BURRITOS
  { itemId: 'ITEM-008', category: 'Breakfast', name: 'Breakfast Tacos', price: 4.15, description: 'Choice of filling', available: true, customizationOptions: JSON.stringify(['Egg & Bacon', 'Egg & Chorizo', 'Egg & Ham']) },
  { itemId: 'ITEM-009', category: 'Breakfast', name: 'Breakfast Tortas', price: 9.39, description: 'Mexican sandwich with eggs and choice of meat', available: true, customizationOptions: JSON.stringify(['Bacon', 'Ham', 'Chorizo']) },
  { itemId: 'ITEM-010', category: 'Breakfast', name: 'Breakfast Burritos', price: 9.39, description: 'Large burrito with eggs, beans, cheese', available: true, customizationOptions: JSON.stringify(['Bacon', 'Ham', 'Chorizo']) },
  
  // ANTOJITOS
  { itemId: 'ITEM-011', category: 'Antojitos', name: 'Tostada de Ceviche Shrimp', price: 8.34, description: 'Fresh shrimp ceviche on crispy tostada', available: true, customizationOptions: JSON.stringify([]) },
  { itemId: 'ITEM-012', category: 'Antojitos', name: 'Cevichaso', price: 20.95, description: '32oz bowl with cucumber, avocado, tostadas', available: true, customizationOptions: JSON.stringify([]) },
  { itemId: 'ITEM-013', category: 'Antojitos', name: 'Shrimp Cocktail', price: 16.74, description: 'Mexican-style shrimp cocktail', available: true, customizationOptions: JSON.stringify([]) },
  { itemId: 'ITEM-014', category: 'Antojitos', name: 'Vaso de Elote', price: 8.34, description: 'Mexican street corn in a cup', available: true, customizationOptions: JSON.stringify([]) },
  { itemId: 'ITEM-015', category: 'Antojitos', name: 'Duros Preparado', price: 10.44, description: 'With cabbage, cueritos, tomato, cream, avocado, salsa', available: true, customizationOptions: JSON.stringify([]) },
  
  // MAIN MENU
  { itemId: 'ITEM-016', category: 'Main', name: 'Street Tacos', price: 4.94, description: 'Authentic street tacos with cilantro and onion', available: true, customizationOptions: JSON.stringify(['Carne Asada', 'Al Pastor', 'Chicken Fajita', 'Campechana', 'Corn Tortillas', 'Flour Tortillas']) },
  { itemId: 'ITEM-017', category: 'Main', name: 'Quesadillas', price: 4.94, description: 'Grilled with cheese and choice of meat', available: true, customizationOptions: JSON.stringify(['Carne Asada', 'Chicken', 'Al Pastor', 'Cheese Only']) },
  { itemId: 'ITEM-018', category: 'Main', name: 'Burritos', price: 10.44, description: 'Choice of meat, lettuce, tomato, cheese, beans', available: true, customizationOptions: JSON.stringify(['Carne Asada', 'Chicken', 'Al Pastor', 'Carnitas']) },
  { itemId: 'ITEM-019', category: 'Main', name: 'Gorditas', price: 7.29, description: 'Thick corn tortilla with beans, cheese, meat, pico de gallo', available: true, customizationOptions: JSON.stringify(['Carne Asada', 'Chicken', 'Al Pastor']) },
  { itemId: 'ITEM-020', category: 'Main', name: 'Tortas', price: 10.44, description: 'Mexican sandwich with meat, lettuce, tomato, sour cream, avocado', available: true, customizationOptions: JSON.stringify(['Carne Asada', 'Chicken', 'Ham', 'Milanesa']) },
  { itemId: 'ITEM-021', category: 'Main', name: 'Torta Cubana', price: 12.54, description: 'Steak, ham, white cheese, lettuce, tomato, sour cream, avocado', available: true, customizationOptions: JSON.stringify([]) },
  { itemId: 'ITEM-022', category: 'Main', name: 'Asada Fries', price: 13.59, description: 'French fries with meat, cheese, sour cream, pico de gallo', available: true, customizationOptions: JSON.stringify(['Carne Asada', 'Chicken', 'Al Pastor']) },
  { itemId: 'ITEM-023', category: 'Main', name: 'Mas Chingon Double Bacon Cheeseburger', price: 16.74, description: 'With ham, grilled onion, jalapeño, white cheese, lettuce, tomatoes, avocado, fries', available: true, customizationOptions: JSON.stringify([]) },
  
  // SPECIALTY COMBOS
  { itemId: 'ITEM-024', category: 'Specialty', name: 'El Jefe de Jefes', price: 18.84, description: '3 steak tacos with pico de gallo & 3 cheese quesadillas', available: true, customizationOptions: JSON.stringify([]) },
  { itemId: 'ITEM-025', category: 'Specialty', name: 'El Señor De Los Cielos', price: 16.74, description: '4 steak tacos a la mexicana', available: true, customizationOptions: JSON.stringify([]) },
  { itemId: 'ITEM-026', category: 'Specialty', name: 'Caro Quintero', price: 15.69, description: '2 tacos & 2 quesadillas (your choice of meat)', available: true, customizationOptions: JSON.stringify(['Carne Asada', 'Chicken', 'Al Pastor']) },
  { itemId: 'ITEM-027', category: 'Specialty', name: 'El Chapo', price: 16.74, description: '4 tacos: Have it your way', available: true, customizationOptions: JSON.stringify(['Carne Asada', 'Chicken', 'Al Pastor', 'Campechana']) },
  { itemId: 'ITEM-028', category: 'Specialty', name: 'El Mayo Zambada', price: 16.74, description: '1 torta with side of french fries', available: true, customizationOptions: JSON.stringify(['Carne Asada', 'Chicken', 'Ham']) },
  { itemId: 'ITEM-029', category: 'Specialty', name: 'El Azul', price: 12.54, description: 'Large quesadilla with side salad', available: true, customizationOptions: JSON.stringify(['Carne Asada', 'Chicken', 'Cheese Only']) },
  { itemId: 'ITEM-030', category: 'Specialty', name: 'Los Ninis', price: 12.54, description: '5 mini tacos (1 choice of meat)', available: true, customizationOptions: JSON.stringify(['Carne Asada', 'Chicken', 'Al Pastor']) },
  { itemId: 'ITEM-031', category: 'Specialty', name: 'Fonseca', price: 14.64, description: '2 molletes with beans, chorizo, ham, cheese, pico de gallo', available: true, customizationOptions: JSON.stringify([]) },
  { itemId: 'ITEM-032', category: 'Specialty', name: 'La Chapiza', price: 29.35, description: '15 mini tacos (one choice of meat)', available: true, customizationOptions: JSON.stringify(['Carne Asada', 'Chicken', 'Al Pastor']) },
  { itemId: 'ITEM-033', category: 'Specialty', name: 'Ivan Archivaldo', price: 17.79, description: 'Burrito with choice of meat, fries, cheese quesadilla', available: true, customizationOptions: JSON.stringify(['Carne Asada', 'Chicken', 'Al Pastor']) },
  { itemId: 'ITEM-034', category: 'Specialty', name: 'Ovidio Guzmán', price: 14.64, description: 'Quesabirrias plate: 3 quesadillas, flour or corn', available: true, customizationOptions: JSON.stringify(['Corn', 'Flour']) },
  
  // DRINKS
  { itemId: 'ITEM-035', category: 'Drinks', name: 'Aguas Frescas', price: 8.09, description: 'Fresh fruit waters', available: true, customizationOptions: JSON.stringify(['Horchata', 'Jamaica', 'Tamarindo']) },
  { itemId: 'ITEM-036', category: 'Drinks', name: 'Smoothie', price: 8.34, description: 'Blended fruit smoothie', available: true, customizationOptions: JSON.stringify(['Strawberry', 'Mango', 'Mixed Berry']) },
  { itemId: 'ITEM-037', category: 'Drinks', name: 'Snow Cone', price: 9.39, description: 'Shaved ice with syrup', available: true, customizationOptions: JSON.stringify(['Cherry', 'Blue Raspberry', 'Mango']) },
  { itemId: 'ITEM-038', category: 'Drinks', name: 'Fruit Cup', price: 9.39, description: 'Fresh fruit cup', available: true, customizationOptions: JSON.stringify([]) },
];

async function populateMenu() {
  console.log('🍽️  Populating Mas Chingon Restaurant Menu...\n');
  
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
      const result = await client.graphql({
        query: mutation,
        variables: { input: item }
      });
      console.log(`✅ ${result.data.createMenuItem.category.padEnd(12)} | ${result.data.createMenuItem.name.padEnd(40)} | $${result.data.createMenuItem.price}`);
    } catch (error) {
      console.error(`❌ Error adding ${item.name}:`, error.errors?.[0]?.message || error.message);
    }
  }
  
  console.log('\n✨ Menu population complete! Added ' + menuItems.length + ' items');
}

populateMenu();
