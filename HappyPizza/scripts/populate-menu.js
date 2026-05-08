// Populate Happy Pizza Company menu — run: node scripts/populate-menu.js
const APPSYNC_URL="https://d2zlzofjerf4hd6gltypy2rnlm.appsync-api.us-east-1.amazonaws.com/graphql";
const API_KEY="da2-6l2dtmahczbbnlp3m2vmgihqby";
const menuItems=[
  {
    "itemId": "HP-001",
    "category": "Pizzas",
    "name": "No Diggity",
    "price": 16,
    "description": "Red sauce, signature cheese blend — the classic",
    "available": true,
    "customizationOptions": "[\"Regular Crust\",\"GF Crust +$3.50\"]"
  },
  {
    "itemId": "HP-002",
    "category": "Pizzas",
    "name": "Margherita",
    "price": 17,
    "description": "Red sauce, mozzarella, halved tomatoes, fresh basil",
    "available": true,
    "customizationOptions": "[\"Regular Crust\",\"GF Crust +$3.50\"]"
  },
  {
    "itemId": "HP-003",
    "category": "Pizzas",
    "name": "Pilot",
    "price": 17,
    "description": "Red sauce, cheese blend, classic pepperoni",
    "available": true,
    "customizationOptions": "[\"Regular Crust\",\"GF Crust +$3.50\"]"
  },
  {
    "itemId": "HP-004",
    "category": "Pizzas",
    "name": "Holla Back",
    "price": 18,
    "description": "Olive oil, cheese blend, fresh mozzarella, rosemary",
    "available": true,
    "customizationOptions": "[\"Regular Crust\",\"GF Crust +$3.50\"]"
  },
  {
    "itemId": "HP-005",
    "category": "Pizzas",
    "name": "Big Don",
    "price": 20,
    "description": "Red sauce, cheese blend, Canadian bacon, smoked bacon, sausage, caramelized onion",
    "available": true,
    "customizationOptions": "[\"Regular Crust\",\"GF Crust +$3.50\"]"
  },
  {
    "itemId": "HP-006",
    "category": "Pizzas",
    "name": "Bel-Air",
    "price": 19,
    "description": "Red sauce, sausage, pepperoni, black olives, mushrooms, red onion, bell pepper",
    "available": true,
    "customizationOptions": "[\"Regular Crust\",\"GF Crust +$3.50\"]"
  },
  {
    "itemId": "HP-007",
    "category": "Pizzas",
    "name": "Jallelujah Jalapeño",
    "price": 20,
    "description": "Crème fraiche, brie, bacon, mushroom, purple onion, jalapeño",
    "available": true,
    "customizationOptions": "[\"Regular Crust\",\"GF Crust +$3.50\"]"
  },
  {
    "itemId": "HP-008",
    "category": "Pizzas",
    "name": "BBQ Chicken",
    "price": 19,
    "description": "BBQ sauce, chicken, red onion, cheese blend",
    "available": true,
    "customizationOptions": "[\"Regular Crust\",\"GF Crust +$3.50\"]"
  },
  {
    "itemId": "HP-009",
    "category": "Pizzas",
    "name": "Jackalope",
    "price": 18,
    "description": "Red sauce, spinach, mushrooms, bacon",
    "available": true,
    "customizationOptions": "[\"Regular Crust\",\"GF Crust +$3.50\"]"
  },
  {
    "itemId": "HP-010",
    "category": "Pizzas",
    "name": "Chicken Bacon Ranch",
    "price": 19,
    "description": "Ranch, chicken, bacon, red onion, cheese blend",
    "available": true,
    "customizationOptions": "[\"Regular Crust\",\"GF Crust +$3.50\"]"
  },
  {
    "itemId": "HP-011",
    "category": "Vegan Pizzas",
    "name": "The Martian (Vegan)",
    "price": 18,
    "description": "Olive oil, house red sauce, red onion, olives, bell pepper, mushrooms, cherry tomatoes, garlic",
    "available": true,
    "customizationOptions": "[\"Regular Crust\",\"GF Crust +$3.50\"]"
  },
  {
    "itemId": "HP-012",
    "category": "Vegan Pizzas",
    "name": "Falafel Pizza (Vegan)",
    "price": 19,
    "description": "Calabrian pepper sauce, red onion, bell pepper, olives, vegan cheese, falafel crumble",
    "available": true,
    "customizationOptions": "[\"Regular Crust\",\"GF Crust +$3.50\"]"
  },
  {
    "itemId": "HP-013",
    "category": "Sides",
    "name": "Sourdough Pretzel",
    "price": 8,
    "description": "House-made sourdough pretzel with honey mustard",
    "available": true,
    "customizationOptions": "[]"
  },
  {
    "itemId": "HP-014",
    "category": "Sides",
    "name": "Cheese Stick Pizza",
    "price": 14,
    "description": "Cheese blend, shaved parm, thyme, roasted garlic EVOO",
    "available": true,
    "customizationOptions": "[]"
  }
];
const mutation=`mutation CreateMenuItem($input:CreateMenuItemInput!){createMenuItem(input:$input){id name category price}}`;
async function gql(q,v={}){const r=await fetch(APPSYNC_URL,{method:"POST",headers:{"Content-Type":"application/json","x-api-key":API_KEY},body:JSON.stringify({query:q,variables:v})});const j=await r.json();if(j.errors)throw new Error(j.errors[0].message);return j.data}
async function run(){console.log("🍴 Populating Happy Pizza Company menu...\n");let ok=0,fail=0;for(const item of menuItems){try{const r=await gql(mutation,{input:item});const m=r.createMenuItem;console.log("✅ "+m.category.padEnd(20)+"|  "+m.name.padEnd(40)+"| $"+m.price.toFixed(2));ok++}catch(e){console.error("❌ "+item.name+": "+e.message);fail++}}console.log("\n✨ Done! "+ok+" added, "+fail+" failed.")}
run();
