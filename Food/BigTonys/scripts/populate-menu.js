// Populate Big Tony's Cheesesteaks menu — run: node scripts/populate-menu.js
const APPSYNC_URL="https://d2zlzofjerf4hd6gltypy2rnlm.appsync-api.us-east-1.amazonaws.com/graphql";
const API_KEY="da2-6l2dtmahczbbnlp3m2vmgihqby";
const menuItems=[
  {
    "itemId": "BT-001",
    "category": "Cheesesteaks",
    "name": "Classic Philly Cheesesteak",
    "price": 14.99,
    "description": "Shaved ribeye, grilled onions, choice of provolone, whiz, or American on Amoroso roll",
    "available": true,
    "customizationOptions": "[\"Provolone\",\"Cheese Whiz\",\"American\",\"Add Peppers\",\"Add Mushrooms\"]"
  },
  {
    "itemId": "BT-002",
    "category": "Cheesesteaks",
    "name": "The Kelly Drive",
    "price": 17.99,
    "description": "Steak, bacon, Italian sausage, chicken, extra cheese, mozzarella sticks, sautéed onions",
    "available": true,
    "customizationOptions": "[\"Provolone\",\"Cheese Whiz\",\"American\"]"
  },
  {
    "itemId": "BT-003",
    "category": "Cheesesteaks",
    "name": "BBQ Cheesesteak",
    "price": 15.99,
    "description": "Shaved ribeye, BBQ sauce, caramelized onions, cheddar",
    "available": true,
    "customizationOptions": "[\"Add Jalapeños\",\"Extra BBQ\"]"
  },
  {
    "itemId": "BT-004",
    "category": "Cheesesteaks",
    "name": "Buffalo Cheesesteak",
    "price": 15.99,
    "description": "Shaved ribeye, buffalo sauce, blue cheese crumbles, celery",
    "available": true,
    "customizationOptions": "[\"Mild\",\"Hot\",\"Extra Hot\"]"
  },
  {
    "itemId": "BT-005",
    "category": "Chicken Steaks",
    "name": "Classic Chicken Cheesesteak",
    "price": 13.99,
    "description": "Shaved chicken, grilled onions, choice of cheese on Amoroso roll",
    "available": true,
    "customizationOptions": "[\"Provolone\",\"Cheese Whiz\",\"American\"]"
  },
  {
    "itemId": "BT-006",
    "category": "Chicken Steaks",
    "name": "Chicken Buffalo Steak",
    "price": 14.99,
    "description": "Shaved chicken, buffalo sauce, blue cheese, celery",
    "available": true,
    "customizationOptions": "[\"Mild\",\"Hot\"]"
  },
  {
    "itemId": "BT-007",
    "category": "Sides",
    "name": "Sweet Potato Fries",
    "price": 5.99,
    "description": "Crispy sweet potato fries with dipping sauce",
    "available": true,
    "customizationOptions": "[]"
  },
  {
    "itemId": "BT-008",
    "category": "Sides",
    "name": "Onion Straws",
    "price": 4.99,
    "description": "Crispy fried onion straws",
    "available": true,
    "customizationOptions": "[]"
  },
  {
    "itemId": "BT-009",
    "category": "Sides",
    "name": "Mozzarella Sticks",
    "price": 5.99,
    "description": "Golden fried mozzarella with marinara",
    "available": true,
    "customizationOptions": "[]"
  },
  {
    "itemId": "BT-010",
    "category": "Drinks",
    "name": "Soda",
    "price": 2.99,
    "description": "Fountain drink",
    "available": true,
    "customizationOptions": "[\"Coke\",\"Diet Coke\",\"Sprite\",\"Dr Pepper\"]"
  }
];
const mutation=`mutation CreateMenuItem($input:CreateMenuItemInput!){createMenuItem(input:$input){id name category price}}`;
async function gql(q,v={}){const r=await fetch(APPSYNC_URL,{method:"POST",headers:{"Content-Type":"application/json","x-api-key":API_KEY},body:JSON.stringify({query:q,variables:v})});const j=await r.json();if(j.errors)throw new Error(j.errors[0].message);return j.data}
async function run(){console.log("🍴 Populating Big Tony's Cheesesteaks menu...\n");let ok=0,fail=0;for(const item of menuItems){try{const r=await gql(mutation,{input:item});const m=r.createMenuItem;console.log("✅ "+m.category.padEnd(20)+"|  "+m.name.padEnd(40)+"| $"+m.price.toFixed(2));ok++}catch(e){console.error("❌ "+item.name+": "+e.message);fail++}}console.log("\n✨ Done! "+ok+" added, "+fail+" failed.")}
run();
