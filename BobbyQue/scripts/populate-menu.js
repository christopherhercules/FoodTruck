// Populate BobbyQue menu — run: node scripts/populate-menu.js
const APPSYNC_URL="https://d2zlzofjerf4hd6gltypy2rnlm.appsync-api.us-east-1.amazonaws.com/graphql";
const API_KEY="da2-6l2dtmahczbbnlp3m2vmgihqby";
const menuItems=[
  {
    "itemId": "BQ-001",
    "category": "BBQ",
    "name": "Brisket Plate",
    "price": 18.99,
    "description": "Thick-sliced slow-smoked brisket with 2 sides",
    "available": true,
    "customizationOptions": "[\"Lean\",\"Fatty\",\"Mixed\"]"
  },
  {
    "itemId": "BQ-002",
    "category": "BBQ",
    "name": "Burnt Ends Plate",
    "price": 20.99,
    "description": "Charred brisket burnt ends — caramelized, smoky, rich",
    "available": true,
    "customizationOptions": "[]"
  },
  {
    "itemId": "BQ-003",
    "category": "BBQ",
    "name": "Beef Slices Plate",
    "price": 16.99,
    "description": "Classic beef slices, Texas style, with 2 sides",
    "available": true,
    "customizationOptions": "[\"Lean\",\"Fatty\"]"
  },
  {
    "itemId": "BQ-004",
    "category": "Sandwiches",
    "name": "Brisket Sandwich",
    "price": 13.99,
    "description": "Sliced brisket on white bread with pickles, onions, sauce",
    "available": true,
    "customizationOptions": "[\"Extra Sauce\",\"No Onion\"]"
  },
  {
    "itemId": "BQ-005",
    "category": "Sandwiches",
    "name": "Burnt Ends Sandwich",
    "price": 14.99,
    "description": "Burnt ends on brioche with BBQ sauce and pickled onions",
    "available": true,
    "customizationOptions": "[]"
  },
  {
    "itemId": "BQ-006",
    "category": "Sides",
    "name": "Pinto Beans",
    "price": 3.99,
    "description": "Slow-cooked Texas pinto beans",
    "available": true,
    "customizationOptions": "[]"
  },
  {
    "itemId": "BQ-007",
    "category": "Sides",
    "name": "Creamed Corn",
    "price": 3.99,
    "description": "Rich Texas-style creamed corn",
    "available": true,
    "customizationOptions": "[]"
  },
  {
    "itemId": "BQ-008",
    "category": "Sides",
    "name": "Potato Salad",
    "price": 3.99,
    "description": "Classic Texas potato salad",
    "available": true,
    "customizationOptions": "[]"
  },
  {
    "itemId": "BQ-009",
    "category": "Drinks",
    "name": "Sweet Tea",
    "price": 2.99,
    "description": "Fresh-brewed sweet tea",
    "available": true,
    "customizationOptions": "[]"
  }
];
const mutation=`mutation CreateMenuItem($input:CreateMenuItemInput!){createMenuItem(input:$input){id name category price}}`;
async function gql(q,v={}){const r=await fetch(APPSYNC_URL,{method:"POST",headers:{"Content-Type":"application/json","x-api-key":API_KEY},body:JSON.stringify({query:q,variables:v})});const j=await r.json();if(j.errors)throw new Error(j.errors[0].message);return j.data}
async function run(){console.log("🍴 Populating BobbyQue menu...\n");let ok=0,fail=0;for(const item of menuItems){try{const r=await gql(mutation,{input:item});const m=r.createMenuItem;console.log("✅ "+m.category.padEnd(20)+"|  "+m.name.padEnd(40)+"| $"+m.price.toFixed(2));ok++}catch(e){console.error("❌ "+item.name+": "+e.message);fail++}}console.log("\n✨ Done! "+ok+" added, "+fail+" failed.")}
run();
