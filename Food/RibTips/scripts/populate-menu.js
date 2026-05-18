// Populate Rib Tips & Catering menu — run: node scripts/populate-menu.js
const APPSYNC_URL="https://d2zlzofjerf4hd6gltypy2rnlm.appsync-api.us-east-1.amazonaws.com/graphql";
const API_KEY="da2-6l2dtmahczbbnlp3m2vmgihqby";
const menuItems=[
  {
    "itemId": "RT-001",
    "category": "BBQ",
    "name": "Smoked Rib Plate",
    "price": 18.99,
    "description": "Half rack of slow-smoked ribs with 2 sides",
    "available": true,
    "customizationOptions": "[\"Dry Rub\",\"BBQ Sauce\",\"Extra Sauce +$1\"]"
  },
  {
    "itemId": "RT-002",
    "category": "BBQ",
    "name": "Brisket Plate",
    "price": 17.99,
    "description": "Slow-smoked sliced brisket with 2 sides",
    "available": true,
    "customizationOptions": "[\"Lean\",\"Fatty\",\"Mixed\"]"
  },
  {
    "itemId": "RT-003",
    "category": "BBQ",
    "name": "Rib Tips Plate",
    "price": 14.99,
    "description": "Tender smoked rib tips with 2 sides",
    "available": true,
    "customizationOptions": "[\"Dry Rub\",\"BBQ Sauce\"]"
  },
  {
    "itemId": "RT-004",
    "category": "Sandwiches",
    "name": "Pulled Pork Sandwich",
    "price": 10.99,
    "description": "Slow-smoked pulled pork on brioche with coleslaw",
    "available": true,
    "customizationOptions": "[\"Add Jalapeños\",\"Extra Sauce\"]"
  },
  {
    "itemId": "RT-005",
    "category": "Sandwiches",
    "name": "Brisket Sandwich",
    "price": 12.99,
    "description": "Sliced brisket on brioche with pickles and onions",
    "available": true,
    "customizationOptions": "[\"Extra Brisket +$3\"]"
  },
  {
    "itemId": "RT-006",
    "category": "Loaded Potatoes",
    "name": "BBQ Loaded Potato",
    "price": 10.99,
    "description": "Baked potato with pulled pork, BBQ sauce, cheddar, sour cream",
    "available": true,
    "customizationOptions": "[\"Add Brisket +$3\"]"
  },
  {
    "itemId": "RT-007",
    "category": "Sides",
    "name": "Mac & Cheese",
    "price": 3.99,
    "description": "Creamy smoked mac & cheese",
    "available": true,
    "customizationOptions": "[]"
  },
  {
    "itemId": "RT-008",
    "category": "Sides",
    "name": "Baked Beans",
    "price": 3.99,
    "description": "Slow-cooked BBQ baked beans",
    "available": true,
    "customizationOptions": "[]"
  },
  {
    "itemId": "RT-009",
    "category": "Sides",
    "name": "Potato Salad",
    "price": 3.99,
    "description": "Southern-style potato salad",
    "available": true,
    "customizationOptions": "[]"
  },
  {
    "itemId": "RT-010",
    "category": "Drinks",
    "name": "Sweet Tea",
    "price": 2.99,
    "description": "House-brewed sweet tea",
    "available": true,
    "customizationOptions": "[]"
  },
  {
    "itemId": "RT-011",
    "category": "Drinks",
    "name": "Soda",
    "price": 2.99,
    "description": "Canned soda",
    "available": true,
    "customizationOptions": "[\"Coke\",\"Diet Coke\",\"Sprite\",\"Dr Pepper\"]"
  }
];
const mutation=`mutation CreateMenuItem($input:CreateMenuItemInput!){createMenuItem(input:$input){id name category price}}`;
async function gql(q,v={}){const r=await fetch(APPSYNC_URL,{method:"POST",headers:{"Content-Type":"application/json","x-api-key":API_KEY},body:JSON.stringify({query:q,variables:v})});const j=await r.json();if(j.errors)throw new Error(j.errors[0].message);return j.data}
async function run(){console.log("🍴 Populating Rib Tips & Catering menu...\n");let ok=0,fail=0;for(const item of menuItems){try{const r=await gql(mutation,{input:item});const m=r.createMenuItem;console.log("✅ "+m.category.padEnd(20)+"|  "+m.name.padEnd(40)+"| $"+m.price.toFixed(2));ok++}catch(e){console.error("❌ "+item.name+": "+e.message);fail++}}console.log("\n✨ Done! "+ok+" added, "+fail+" failed.")}
run();
