// Populate That Green Trailer menu — run: node scripts/populate-menu.js
const APPSYNC_URL="https://d2zlzofjerf4hd6gltypy2rnlm.appsync-api.us-east-1.amazonaws.com/graphql";
const API_KEY="da2-6l2dtmahczbbnlp3m2vmgihqby";
const menuItems=[
  {
    "itemId": "TGT-001",
    "category": "Burgers",
    "name": "Original Burger",
    "price": 10.99,
    "description": "Ground chuck, American cheese, onion, lettuce, secret sauce",
    "available": true,
    "customizationOptions": "[\"No Onion\",\"Add Bacon +$2\",\"Extra Cheese +$1\"]"
  },
  {
    "itemId": "TGT-002",
    "category": "Burgers",
    "name": "Bacon Cheeseburger",
    "price": 12.99,
    "description": "Ground chuck, applewood smoked bacon, American cheese, lettuce",
    "available": true,
    "customizationOptions": "[\"Add Jalapeños\",\"No Lettuce\"]"
  },
  {
    "itemId": "TGT-003",
    "category": "Burgers",
    "name": "Mushroom Swiss Burger",
    "price": 12.99,
    "description": "Ground chuck, Swiss cheese, sautéed mushrooms, secret sauce",
    "available": true,
    "customizationOptions": "[\"Add Bacon +$2\"]"
  },
  {
    "itemId": "TGT-004",
    "category": "Sandwiches",
    "name": "Club Sandwich",
    "price": 11.99,
    "description": "Triple-decker with turkey, bacon, ham, lettuce, tomato, mayo",
    "available": true,
    "customizationOptions": "[\"No Mayo\",\"Add Avocado +$1\"]"
  },
  {
    "itemId": "TGT-005",
    "category": "Sandwiches",
    "name": "Asian Chicken Sandwich",
    "price": 12.99,
    "description": "Crispy or grilled chicken with Asian slaw, sriracha aioli",
    "available": true,
    "customizationOptions": "[\"Crispy\",\"Grilled\",\"Extra Sauce\"]"
  },
  {
    "itemId": "TGT-006",
    "category": "Sides",
    "name": "Fries",
    "price": 3.99,
    "description": "Fresh-cut seasoned fries",
    "available": true,
    "customizationOptions": "[\"Regular\",\"Loaded +$2\"]"
  },
  {
    "itemId": "TGT-007",
    "category": "Sides",
    "name": "Onion Rings",
    "price": 4.99,
    "description": "Beer-battered onion rings",
    "available": true,
    "customizationOptions": "[]"
  },
  {
    "itemId": "TGT-008",
    "category": "Drinks",
    "name": "Fountain Drink",
    "price": 2.99,
    "description": "Your choice of soda",
    "available": true,
    "customizationOptions": "[\"Coke\",\"Diet Coke\",\"Sprite\",\"Dr Pepper\",\"Lemonade\"]"
  }
];
const mutation=`mutation CreateMenuItem($input:CreateMenuItemInput!){createMenuItem(input:$input){id name category price}}`;
async function gql(q,v={}){const r=await fetch(APPSYNC_URL,{method:"POST",headers:{"Content-Type":"application/json","x-api-key":API_KEY},body:JSON.stringify({query:q,variables:v})});const j=await r.json();if(j.errors)throw new Error(j.errors[0].message);return j.data}
async function run(){console.log("🍴 Populating That Green Trailer menu...\n");let ok=0,fail=0;for(const item of menuItems){try{const r=await gql(mutation,{input:item});const m=r.createMenuItem;console.log("✅ "+m.category.padEnd(20)+"|  "+m.name.padEnd(40)+"| $"+m.price.toFixed(2));ok++}catch(e){console.error("❌ "+item.name+": "+e.message);fail++}}console.log("\n✨ Done! "+ok+" added, "+fail+" failed.")}
run();
