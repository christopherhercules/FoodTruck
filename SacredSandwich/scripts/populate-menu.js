// Populate Sacred Sandwich menu — run: node scripts/populate-menu.js
const APPSYNC_URL="https://d2zlzofjerf4hd6gltypy2rnlm.appsync-api.us-east-1.amazonaws.com/graphql";
const API_KEY="da2-6l2dtmahczbbnlp3m2vmgihqby";
const menuItems=[
  {
    "itemId": "SS-001",
    "category": "Sandwiches",
    "name": "MexItalian",
    "price": 12,
    "description": "Pastrami, salami, pepperoni, Oaxaca cheese, cilantro, tomatoes, red onion, balsamic vinaigrette on sourdough",
    "available": true,
    "customizationOptions": "[]"
  },
  {
    "itemId": "SS-002",
    "category": "Sandwiches",
    "name": "Cubano",
    "price": 12,
    "description": "Ham, bacon, Swiss, pickles, mustard on sourdough",
    "available": true,
    "customizationOptions": "[]"
  },
  {
    "itemId": "SS-003",
    "category": "Sandwiches",
    "name": "Turkey Bacon Pesto",
    "price": 12,
    "description": "Turkey, bacon, basil pesto, provolone, lettuce, tomato, red onion on sourdough",
    "available": true,
    "customizationOptions": "[]"
  },
  {
    "itemId": "SS-004",
    "category": "Sandwiches",
    "name": "Reuben",
    "price": 12,
    "description": "Pastrami, sauerkraut, Swiss, thousand island on rye",
    "available": true,
    "customizationOptions": "[]"
  },
  {
    "itemId": "SS-005",
    "category": "Sandwiches",
    "name": "Milano Frio",
    "price": 12,
    "description": "Ham, salami, pepperoni, provolone, lettuce, tomato, red onion, pickles, mayo, mustard on sourdough",
    "available": true,
    "customizationOptions": "[]"
  },
  {
    "itemId": "SS-006",
    "category": "Sandwiches",
    "name": "Sliced Turkey",
    "price": 12,
    "description": "Turkey, Swiss, lettuce, tomato, red onion, mayo, mustard on sourdough",
    "available": true,
    "customizationOptions": "[]"
  },
  {
    "itemId": "SS-007",
    "category": "Sides",
    "name": "Premium Baked Potato Salad",
    "price": 4.5,
    "description": "House-made loaded baked potato salad",
    "available": true,
    "customizationOptions": "[]"
  },
  {
    "itemId": "SS-008",
    "category": "Sides",
    "name": "Creamy Cole Slaw",
    "price": 4,
    "description": "House-made creamy cole slaw",
    "available": true,
    "customizationOptions": "[]"
  },
  {
    "itemId": "SS-009",
    "category": "Sides",
    "name": "Chips / Veggie Straws",
    "price": 2.77,
    "description": "Chips or veggie straws",
    "available": true,
    "customizationOptions": "[\"Chips\",\"Veggie Straws\",\"Goldfish\"]"
  },
  {
    "itemId": "SS-010",
    "category": "Drinks",
    "name": "Soda",
    "price": 2.77,
    "description": "Canned soda",
    "available": true,
    "customizationOptions": "[\"Coke\",\"Coke Zero\",\"Dr Pepper\",\"Sprite\"]"
  },
  {
    "itemId": "SS-011",
    "category": "Drinks",
    "name": "Water",
    "price": 2.77,
    "description": "Bottled water",
    "available": true,
    "customizationOptions": "[]"
  }
];
const mutation=`mutation CreateMenuItem($input:CreateMenuItemInput!){createMenuItem(input:$input){id name category price}}`;
async function gql(q,v={}){const r=await fetch(APPSYNC_URL,{method:"POST",headers:{"Content-Type":"application/json","x-api-key":API_KEY},body:JSON.stringify({query:q,variables:v})});const j=await r.json();if(j.errors)throw new Error(j.errors[0].message);return j.data}
async function run(){console.log("🍴 Populating Sacred Sandwich menu...\n");let ok=0,fail=0;for(const item of menuItems){try{const r=await gql(mutation,{input:item});const m=r.createMenuItem;console.log("✅ "+m.category.padEnd(20)+"|  "+m.name.padEnd(40)+"| $"+m.price.toFixed(2));ok++}catch(e){console.error("❌ "+item.name+": "+e.message);fail++}}console.log("\n✨ Done! "+ok+" added, "+fail+" failed.")}
run();
