// Populate Don Julio's Tacos menu — run: node scripts/populate-menu.js
const APPSYNC_URL="https://d2zlzofjerf4hd6gltypy2rnlm.appsync-api.us-east-1.amazonaws.com/graphql";
const API_KEY="da2-6l2dtmahczbbnlp3m2vmgihqby";
const menuItems=[
  {
    "itemId": "DJ-001",
    "category": "Mini Tacos",
    "name": "Mini Tacos — 5 Pack",
    "price": 10,
    "description": "5 mini tacos with frijoles charros — pastor or bistek",
    "available": true,
    "customizationOptions": "[\"Al Pastor\",\"Bistek\"]"
  },
  {
    "itemId": "DJ-002",
    "category": "Mini Tacos",
    "name": "Mini Tacos — 10 Pack",
    "price": 20,
    "description": "10 mini tacos with frijoles charros — pastor or bistek",
    "available": true,
    "customizationOptions": "[\"Al Pastor\",\"Bistek\",\"Mixed\"]"
  },
  {
    "itemId": "DJ-003",
    "category": "Mini Tacos",
    "name": "Tacos de Asada",
    "price": 3.5,
    "description": "Grilled carne asada street tacos, cilantro & onion",
    "available": true,
    "customizationOptions": "[\"Corn Tortilla\",\"Flour Tortilla\",\"Add Salsa\"]"
  },
  {
    "itemId": "DJ-004",
    "category": "Breakfast",
    "name": "Breakfast Burrito",
    "price": 7.99,
    "description": "Flour tortilla with eggs, chorizo, cheese, and potatoes",
    "available": true,
    "customizationOptions": "[\"Chorizo\",\"Bacon\",\"Potato & Egg\",\"Add Jalapeños\"]"
  },
  {
    "itemId": "DJ-005",
    "category": "Breakfast",
    "name": "Breakfast Taco",
    "price": 2.5,
    "description": "Egg, cheese, and your choice of filling on fresh tortilla",
    "available": true,
    "customizationOptions": "[\"Bacon\",\"Chorizo\",\"Potato\",\"Bean & Cheese\"]"
  },
  {
    "itemId": "DJ-006",
    "category": "Quesadillas",
    "name": "Quesadilla",
    "price": 6.99,
    "description": "Grilled flour tortilla with cheese and protein",
    "available": true,
    "customizationOptions": "[\"Cheese Only\",\"Add Asada\",\"Add Pastor\"]"
  },
  {
    "itemId": "DJ-007",
    "category": "Drinks",
    "name": "Bottled Water",
    "price": 1,
    "description": "Cold bottled water",
    "available": true,
    "customizationOptions": "[]"
  },
  {
    "itemId": "DJ-008",
    "category": "Drinks",
    "name": "Soda",
    "price": 1.5,
    "description": "Canned soda",
    "available": true,
    "customizationOptions": "[\"Coke\",\"Diet Coke\",\"Sprite\",\"Dr Pepper\"]"
  }
];
const mutation=`mutation CreateMenuItem($input:CreateMenuItemInput!){createMenuItem(input:$input){id name category price}}`;
async function gql(q,v={}){const r=await fetch(APPSYNC_URL,{method:"POST",headers:{"Content-Type":"application/json","x-api-key":API_KEY},body:JSON.stringify({query:q,variables:v})});const j=await r.json();if(j.errors)throw new Error(j.errors[0].message);return j.data}
async function run(){console.log("🍴 Populating Don Julio's Tacos menu...\n");let ok=0,fail=0;for(const item of menuItems){try{const r=await gql(mutation,{input:item});const m=r.createMenuItem;console.log("✅ "+m.category.padEnd(20)+"|  "+m.name.padEnd(40)+"| $"+m.price.toFixed(2));ok++}catch(e){console.error("❌ "+item.name+": "+e.message);fail++}}console.log("\n✨ Done! "+ok+" added, "+fail+" failed.")}
run();
