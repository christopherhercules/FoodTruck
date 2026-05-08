// Populate Hecho en Queso menu — run: node scripts/populate-menu.js
const APPSYNC_URL="https://d2zlzofjerf4hd6gltypy2rnlm.appsync-api.us-east-1.amazonaws.com/graphql";
const API_KEY="da2-6l2dtmahczbbnlp3m2vmgihqby";
const menuItems=[
  {
    "itemId": "HEQ-001",
    "category": "Tacos",
    "name": "Fajita Steak Tacos",
    "price": 12.99,
    "description": "Grilled fajita steak, onions & peppers, fresh tortillas",
    "available": true,
    "customizationOptions": "[\"Corn Tortilla\",\"Flour Tortilla\",\"Keto Lettuce Wrap\"]"
  },
  {
    "itemId": "HEQ-002",
    "category": "Tacos",
    "name": "Al Pastor Tacos",
    "price": 11.99,
    "description": "Marinated pork pastor with pineapple, cilantro, onion",
    "available": true,
    "customizationOptions": "[\"Corn Tortilla\",\"Flour Tortilla\"]"
  },
  {
    "itemId": "HEQ-003",
    "category": "Tacos",
    "name": "Vegan Street Tacos",
    "price": 10.99,
    "description": "Seasoned black beans, roasted peppers, avocado, pico",
    "available": true,
    "customizationOptions": "[\"Corn Tortilla\",\"Flour Tortilla\"]"
  },
  {
    "itemId": "HEQ-004",
    "category": "Tortas",
    "name": "Chicken Banh Mi Torta",
    "price": 13.99,
    "description": "Korean-inspired chicken, pickled veggies, cilantro, jalapeño aioli",
    "available": true,
    "customizationOptions": "[\"Extra Jalapeño\",\"No Spice\"]"
  },
  {
    "itemId": "HEQ-005",
    "category": "Tortas",
    "name": "Steak Torta",
    "price": 14.99,
    "description": "Fajita steak, beans, avocado, cheese, chipotle mayo",
    "available": true,
    "customizationOptions": "[]"
  },
  {
    "itemId": "HEQ-006",
    "category": "Breakfast",
    "name": "Migas Plate",
    "price": 10.99,
    "description": "Scrambled eggs with tortilla chips, peppers, cheese, pico",
    "available": true,
    "customizationOptions": "[\"Add Chorizo +$2\",\"Add Avocado +$1\"]"
  },
  {
    "itemId": "HEQ-007",
    "category": "Breakfast",
    "name": "Breakfast Burrito",
    "price": 11.99,
    "description": "Eggs, bacon, sausage, or chorizo with beans and cheese",
    "available": true,
    "customizationOptions": "[\"Bacon\",\"Sausage\",\"Chorizo\",\"Veggie\"]"
  },
  {
    "itemId": "HEQ-008",
    "category": "Sides",
    "name": "Chips & Queso",
    "price": 6.99,
    "description": "Tortilla chips with house queso, rice, beans, lettuce, tomato",
    "available": true,
    "customizationOptions": "[\"Add Protein +$3\"]"
  },
  {
    "itemId": "HEQ-009",
    "category": "Sides",
    "name": "Side of Rice & Beans",
    "price": 3.99,
    "description": "Mexican rice and refried beans",
    "available": true,
    "customizationOptions": "[]"
  },
  {
    "itemId": "HEQ-010",
    "category": "Drinks",
    "name": "Agua Fresca",
    "price": 3,
    "description": "Fresh house-made agua fresca",
    "available": true,
    "customizationOptions": "[\"Horchata\",\"Jamaica\",\"Tamarindo\"]"
  }
];
const mutation=`mutation CreateMenuItem($input:CreateMenuItemInput!){createMenuItem(input:$input){id name category price}}`;
async function gql(q,v={}){const r=await fetch(APPSYNC_URL,{method:"POST",headers:{"Content-Type":"application/json","x-api-key":API_KEY},body:JSON.stringify({query:q,variables:v})});const j=await r.json();if(j.errors)throw new Error(j.errors[0].message);return j.data}
async function run(){console.log("🍴 Populating Hecho en Queso menu...\n");let ok=0,fail=0;for(const item of menuItems){try{const r=await gql(mutation,{input:item});const m=r.createMenuItem;console.log("✅ "+m.category.padEnd(20)+"|  "+m.name.padEnd(40)+"| $"+m.price.toFixed(2));ok++}catch(e){console.error("❌ "+item.name+": "+e.message);fail++}}console.log("\n✨ Done! "+ok+" added, "+fail+" failed.")}
run();
