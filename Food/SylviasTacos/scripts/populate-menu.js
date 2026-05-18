// Populate Sylvia's Tacos menu — run: node scripts/populate-menu.js
const APPSYNC_URL="https://d2zlzofjerf4hd6gltypy2rnlm.appsync-api.us-east-1.amazonaws.com/graphql";
const API_KEY="da2-6l2dtmahczbbnlp3m2vmgihqby";
const menuItems=[
  {
    "itemId": "ST-001",
    "category": "Breakfast Tacos",
    "name": "Egg & Cheese Taco",
    "price": 2.5,
    "description": "Scrambled egg, cheddar cheese, fresh tortilla",
    "available": true,
    "customizationOptions": "[\"Corn Tortilla\",\"Flour Tortilla\"]"
  },
  {
    "itemId": "ST-002",
    "category": "Breakfast Tacos",
    "name": "Bacon & Egg Taco",
    "price": 2.99,
    "description": "Crispy bacon, scrambled egg, cheese",
    "available": true,
    "customizationOptions": "[\"Corn Tortilla\",\"Flour Tortilla\"]"
  },
  {
    "itemId": "ST-003",
    "category": "Breakfast Tacos",
    "name": "Brisket & Egg Taco",
    "price": 3.99,
    "description": "Slow-smoked brisket with scrambled egg",
    "available": true,
    "customizationOptions": "[\"Corn Tortilla\",\"Flour Tortilla\",\"Add Salsa\"]"
  },
  {
    "itemId": "ST-004",
    "category": "Breakfast Tacos",
    "name": "Bean & Cheese Taco",
    "price": 1.99,
    "description": "Refried beans, cheddar cheese",
    "available": true,
    "customizationOptions": "[\"Corn Tortilla\",\"Flour Tortilla\"]"
  },
  {
    "itemId": "ST-005",
    "category": "Breakfast Tacos",
    "name": "Chorizo & Egg Taco",
    "price": 2.99,
    "description": "Spicy chorizo with scrambled egg",
    "available": true,
    "customizationOptions": "[\"Corn Tortilla\",\"Flour Tortilla\"]"
  },
  {
    "itemId": "ST-006",
    "category": "Breakfast Tacos",
    "name": "Potato & Egg Taco",
    "price": 2.5,
    "description": "Seasoned potatoes and scrambled egg",
    "available": true,
    "customizationOptions": "[\"Corn Tortilla\",\"Flour Tortilla\"]"
  },
  {
    "itemId": "ST-007",
    "category": "Gorditas",
    "name": "Gordita de Chicharrón",
    "price": 4.5,
    "description": "Thick corn pocket stuffed with chicharrón in salsa verde",
    "available": true,
    "customizationOptions": "[]"
  },
  {
    "itemId": "ST-008",
    "category": "Gorditas",
    "name": "Gordita de Frijoles",
    "price": 3.99,
    "description": "Bean gordita with cheese and crema",
    "available": true,
    "customizationOptions": "[]"
  },
  {
    "itemId": "ST-009",
    "category": "Tortas",
    "name": "Torta de Egg & Chorizo",
    "price": 6.99,
    "description": "Bolillo roll with chorizo, egg, beans, avocado",
    "available": true,
    "customizationOptions": "[]"
  },
  {
    "itemId": "ST-010",
    "category": "Tortas",
    "name": "Torta de Brisket",
    "price": 7.99,
    "description": "Brisket, refried beans, jalapeño, avocado on bolillo",
    "available": true,
    "customizationOptions": "[]"
  },
  {
    "itemId": "ST-011",
    "category": "Drinks",
    "name": "Agua Fresca",
    "price": 2,
    "description": "Fresh-made agua fresca — ask for today's flavor",
    "available": true,
    "customizationOptions": "[]"
  },
  {
    "itemId": "ST-012",
    "category": "Drinks",
    "name": "Coffee",
    "price": 1.5,
    "description": "Hot black coffee",
    "available": true,
    "customizationOptions": "[]"
  }
];
const mutation=`mutation CreateMenuItem($input:CreateMenuItemInput!){createMenuItem(input:$input){id name category price}}`;
async function gql(q,v={}){const r=await fetch(APPSYNC_URL,{method:"POST",headers:{"Content-Type":"application/json","x-api-key":API_KEY},body:JSON.stringify({query:q,variables:v})});const j=await r.json();if(j.errors)throw new Error(j.errors[0].message);return j.data}
async function run(){console.log("🍴 Populating Sylvia's Tacos menu...\n");let ok=0,fail=0;for(const item of menuItems){try{const r=await gql(mutation,{input:item});const m=r.createMenuItem;console.log("✅ "+m.category.padEnd(20)+"|  "+m.name.padEnd(40)+"| $"+m.price.toFixed(2));ok++}catch(e){console.error("❌ "+item.name+": "+e.message);fail++}}console.log("\n✨ Done! "+ok+" added, "+fail+" failed.")}
run();
