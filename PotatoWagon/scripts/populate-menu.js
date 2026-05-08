// Populate Potato Wagon menu — run: node scripts/populate-menu.js
const APPSYNC_URL="https://d2zlzofjerf4hd6gltypy2rnlm.appsync-api.us-east-1.amazonaws.com/graphql";
const API_KEY="da2-6l2dtmahczbbnlp3m2vmgihqby";
const menuItems=[
  {
    "itemId": "PW-001",
    "category": "Chicken",
    "name": "6 Tender Meal",
    "price": 12.99,
    "description": "6 crispy tenders, 1 side, gravy, roll, and drink",
    "available": true,
    "customizationOptions": "[\"Original\",\"Spicy\",\"Honey Butter\"]"
  },
  {
    "itemId": "PW-002",
    "category": "Chicken",
    "name": "3-Piece Fried Chicken",
    "price": 10.99,
    "description": "3 pieces fried chicken, 1 side, roll, and drink",
    "available": true,
    "customizationOptions": "[\"Original\",\"Spicy\"]"
  },
  {
    "itemId": "PW-003",
    "category": "Chicken",
    "name": "2-Piece Fried Chicken",
    "price": 8.99,
    "description": "2 pieces fried chicken, 1 side, roll, and drink",
    "available": true,
    "customizationOptions": "[\"Original\",\"Spicy\"]"
  },
  {
    "itemId": "PW-004",
    "category": "Chicken",
    "name": "Family Meal — 20 Tenders",
    "price": 43.84,
    "description": "20 tenders, 2 family sides, family gravy, 5 rolls",
    "available": true,
    "customizationOptions": "[\"Original\",\"Spicy\",\"Mixed\"]"
  },
  {
    "itemId": "PW-005",
    "category": "Loaded Potatoes",
    "name": "Classic Loaded Potato",
    "price": 9.99,
    "description": "Baked potato with butter, sour cream, cheddar, bacon bits, chives",
    "available": true,
    "customizationOptions": "[\"Extra Cheese\",\"Extra Bacon\"]"
  },
  {
    "itemId": "PW-006",
    "category": "Loaded Potatoes",
    "name": "Buffalo Chicken Potato",
    "price": 11.99,
    "description": "Baked potato topped with buffalo chicken, blue cheese, celery",
    "available": true,
    "customizationOptions": "[\"Mild\",\"Hot\",\"Extra Hot\"]"
  },
  {
    "itemId": "PW-007",
    "category": "Loaded Potatoes",
    "name": "Beef Chili Potato",
    "price": 11.99,
    "description": "Baked potato with hearty beef chili, cheddar, sour cream",
    "available": true,
    "customizationOptions": "[\"Extra Chili +$1\"]"
  },
  {
    "itemId": "PW-008",
    "category": "Loaded Potatoes",
    "name": "Meatballs Marinara Potato",
    "price": 11.99,
    "description": "Baked potato with meatballs, marinara, mozzarella",
    "available": true,
    "customizationOptions": "[]"
  },
  {
    "itemId": "PW-009",
    "category": "Sides",
    "name": "Mac & Cheese",
    "price": 3.99,
    "description": "Creamy house-made mac & cheese",
    "available": true,
    "customizationOptions": "[]"
  },
  {
    "itemId": "PW-010",
    "category": "Sides",
    "name": "Corn Nuggets",
    "price": 3.99,
    "description": "Crispy deep-fried corn nuggets",
    "available": true,
    "customizationOptions": "[]"
  },
  {
    "itemId": "PW-011",
    "category": "Sides",
    "name": "Coleslaw",
    "price": 2.99,
    "description": "Creamy southern coleslaw",
    "available": true,
    "customizationOptions": "[]"
  },
  {
    "itemId": "PW-012",
    "category": "Drinks",
    "name": "Fountain Drink",
    "price": 2.99,
    "description": "Your choice of soda",
    "available": true,
    "customizationOptions": "[\"Coke\",\"Diet Coke\",\"Sprite\",\"Dr Pepper\"]"
  }
];
const mutation=`mutation CreateMenuItem($input:CreateMenuItemInput!){createMenuItem(input:$input){id name category price}}`;
async function gql(q,v={}){const r=await fetch(APPSYNC_URL,{method:"POST",headers:{"Content-Type":"application/json","x-api-key":API_KEY},body:JSON.stringify({query:q,variables:v})});const j=await r.json();if(j.errors)throw new Error(j.errors[0].message);return j.data}
async function run(){console.log("🍴 Populating Potato Wagon menu...\n");let ok=0,fail=0;for(const item of menuItems){try{const r=await gql(mutation,{input:item});const m=r.createMenuItem;console.log("✅ "+m.category.padEnd(20)+"|  "+m.name.padEnd(40)+"| $"+m.price.toFixed(2));ok++}catch(e){console.error("❌ "+item.name+": "+e.message);fail++}}console.log("\n✨ Done! "+ok+" added, "+fail+" failed.")}
run();
