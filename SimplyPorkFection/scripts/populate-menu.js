// Populate Simply Pork Fection menu — run: node scripts/populate-menu.js
const APPSYNC_URL="https://d2zlzofjerf4hd6gltypy2rnlm.appsync-api.us-east-1.amazonaws.com/graphql";
const API_KEY="da2-6l2dtmahczbbnlp3m2vmgihqby";
const menuItems=[
  {
    "itemId": "SPF-001",
    "category": "BBQ Plates",
    "name": "Pulled Pork Plate",
    "price": 14.99,
    "description": "Slow-smoked pulled pork with 2 specialty sides",
    "available": true,
    "customizationOptions": "[\"Dry\",\"Sauced\",\"Extra Sauce +$1\"]"
  },
  {
    "itemId": "SPF-002",
    "category": "BBQ Plates",
    "name": "Rib Plate",
    "price": 18.99,
    "description": "Half rack of smoked ribs with 2 specialty sides",
    "available": true,
    "customizationOptions": "[\"Baby Back\",\"Spare Rib\"]"
  },
  {
    "itemId": "SPF-003",
    "category": "BBQ Plates",
    "name": "Smoked Meat Sampler",
    "price": 22.99,
    "description": "Pulled pork, rib tips, and smoked sausage with 2 sides",
    "available": true,
    "customizationOptions": "[]"
  },
  {
    "itemId": "SPF-004",
    "category": "Sandwiches",
    "name": "Pulled Pork Sandwich",
    "price": 10.99,
    "description": "Slow-smoked pulled pork on brioche with specialty slaw",
    "available": true,
    "customizationOptions": "[\"Extra Meat +$3\",\"Add Jalapeños\"]"
  },
  {
    "itemId": "SPF-005",
    "category": "Sides",
    "name": "Specialty Side #1",
    "price": 3.99,
    "description": "Ask about today's specialty side — changes regularly",
    "available": true,
    "customizationOptions": "[]"
  },
  {
    "itemId": "SPF-006",
    "category": "Sides",
    "name": "Specialty Side #2",
    "price": 3.99,
    "description": "Second rotating specialty side — always unique",
    "available": true,
    "customizationOptions": "[]"
  },
  {
    "itemId": "SPF-007",
    "category": "Sides",
    "name": "Classic Coleslaw",
    "price": 2.99,
    "description": "Creamy house slaw",
    "available": true,
    "customizationOptions": "[]"
  },
  {
    "itemId": "SPF-008",
    "category": "Drinks",
    "name": "Sweet Tea",
    "price": 2.99,
    "description": "Southern sweet tea",
    "available": true,
    "customizationOptions": "[]"
  },
  {
    "itemId": "SPF-009",
    "category": "Drinks",
    "name": "Soda",
    "price": 2.99,
    "description": "Canned soda",
    "available": true,
    "customizationOptions": "[\"Coke\",\"Diet Coke\",\"Dr Pepper\",\"Sprite\"]"
  }
];
const mutation=`mutation CreateMenuItem($input:CreateMenuItemInput!){createMenuItem(input:$input){id name category price}}`;
async function gql(q,v={}){const r=await fetch(APPSYNC_URL,{method:"POST",headers:{"Content-Type":"application/json","x-api-key":API_KEY},body:JSON.stringify({query:q,variables:v})});const j=await r.json();if(j.errors)throw new Error(j.errors[0].message);return j.data}
async function run(){console.log("🍴 Populating Simply Pork Fection menu...\n");let ok=0,fail=0;for(const item of menuItems){try{const r=await gql(mutation,{input:item});const m=r.createMenuItem;console.log("✅ "+m.category.padEnd(20)+"|  "+m.name.padEnd(40)+"| $"+m.price.toFixed(2));ok++}catch(e){console.error("❌ "+item.name+": "+e.message);fail++}}console.log("\n✨ Done! "+ok+" added, "+fail+" failed.")}
run();
