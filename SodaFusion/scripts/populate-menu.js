// Populate Soda Fusion menu — run: node scripts/populate-menu.js
const APPSYNC_URL="https://d2zlzofjerf4hd6gltypy2rnlm.appsync-api.us-east-1.amazonaws.com/graphql";
const API_KEY="da2-6l2dtmahczbbnlp3m2vmgihqby";
const menuItems=[
  {
    "itemId": "SF-001",
    "category": "Specialty Drinks",
    "name": "Specialty Blended Soda",
    "price": 5.99,
    "description": "Custom-blended specialty soda — ask for today's creations",
    "available": true,
    "customizationOptions": "[\"Classic\",\"Tropical\",\"Berry Blast\",\"Citrus Fusion\"]"
  },
  {
    "itemId": "SF-002",
    "category": "Specialty Drinks",
    "name": "16-Hour Cold Brew",
    "price": 5.99,
    "description": "Cold brew steeped in-house for 16 hours — smooth and rich",
    "available": true,
    "customizationOptions": "[\"Black\",\"Sweet Cream\",\"Vanilla\",\"Caramel\"]"
  },
  {
    "itemId": "SF-003",
    "category": "Specialty Drinks",
    "name": "16-Hour Iced Tea",
    "price": 4.99,
    "description": "Iced tea steeped in-house for 16 hours",
    "available": true,
    "customizationOptions": "[\"Sweet\",\"Unsweet\",\"Half & Half\",\"Peach\",\"Raspberry\"]"
  },
  {
    "itemId": "SF-004",
    "category": "Specialty Drinks",
    "name": "Specialty Lemonade",
    "price": 5.49,
    "description": "Fresh-squeezed lemonade with house blend flavoring",
    "available": true,
    "customizationOptions": "[\"Classic\",\"Strawberry\",\"Mango\",\"Lavender\"]"
  },
  {
    "itemId": "SF-005",
    "category": "Loaded Hot Dogs",
    "name": "Classic Loaded Dog",
    "price": 7.99,
    "description": "All-beef hot dog with mustard, ketchup, onions, relish",
    "available": true,
    "customizationOptions": "[]"
  },
  {
    "itemId": "SF-006",
    "category": "Loaded Hot Dogs",
    "name": "Bacon Chili Dog",
    "price": 9.99,
    "description": "All-beef dog with beef chili, cheddar, bacon, jalapeños",
    "available": true,
    "customizationOptions": "[\"Extra Chili\",\"Extra Jalapeños\"]"
  },
  {
    "itemId": "SF-007",
    "category": "Loaded Hot Dogs",
    "name": "Mac & Cheese Dog",
    "price": 9.99,
    "description": "All-beef dog topped with creamy mac & cheese and bacon bits",
    "available": true,
    "customizationOptions": "[]"
  },
  {
    "itemId": "SF-008",
    "category": "Loaded Hot Dogs",
    "name": "BBQ Brisket Dog",
    "price": 10.99,
    "description": "All-beef dog with chopped brisket, BBQ sauce, crispy onions",
    "available": true,
    "customizationOptions": "[]"
  },
  {
    "itemId": "SF-009",
    "category": "Loaded Fries & Sides",
    "name": "Loaded Fries",
    "price": 8.99,
    "description": "Fries loaded with cheese sauce, bacon, jalapeños, sour cream",
    "available": true,
    "customizationOptions": "[\"Add Chili +$2\",\"Add Brisket +$3\"]"
  },
  {
    "itemId": "SF-010",
    "category": "Loaded Fries & Sides",
    "name": "Loaded Tots",
    "price": 8.99,
    "description": "Crispy tots with cheese sauce, bacon, ranch drizzle",
    "available": true,
    "customizationOptions": "[]"
  },
  {
    "itemId": "SF-011",
    "category": "Loaded Fries & Sides",
    "name": "Chicken Tenders",
    "price": 8.99,
    "description": "3 crispy chicken tenders with dipping sauce",
    "available": true,
    "customizationOptions": "[\"Ranch\",\"Honey Mustard\",\"BBQ\",\"Buffalo\"]"
  }
];
const mutation=`mutation CreateMenuItem($input:CreateMenuItemInput!){createMenuItem(input:$input){id name category price}}`;
async function gql(q,v={}){const r=await fetch(APPSYNC_URL,{method:"POST",headers:{"Content-Type":"application/json","x-api-key":API_KEY},body:JSON.stringify({query:q,variables:v})});const j=await r.json();if(j.errors)throw new Error(j.errors[0].message);return j.data}
async function run(){console.log("🍴 Populating Soda Fusion menu...\n");let ok=0,fail=0;for(const item of menuItems){try{const r=await gql(mutation,{input:item});const m=r.createMenuItem;console.log("✅ "+m.category.padEnd(20)+"|  "+m.name.padEnd(40)+"| $"+m.price.toFixed(2));ok++}catch(e){console.error("❌ "+item.name+": "+e.message);fail++}}console.log("\n✨ Done! "+ok+" added, "+fail+" failed.")}
run();
