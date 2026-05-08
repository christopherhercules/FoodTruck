const { Amplify } = require('aws-amplify');
const { generateClient } = require('aws-amplify/api');
const config = require('../amplify_outputs.json');

Amplify.configure(config);
const client = generateClient();

async function createTestOrder() {
  const orderId = `ORD-${Date.now()}`;
  
  // Order 2 tacos and 1 quesadilla
  const orderItems = [
    { itemId: 'ITEM-016', name: 'Street Tacos', quantity: 2, price: 4.94, customizations: 'Carne Asada, Corn Tortillas' },
    { itemId: 'ITEM-017', name: 'Quesadilla', quantity: 1, price: 4.94, customizations: 'Chicken' }
  ];
  
  const totalPrice = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  const mutation = `
    mutation CreateOrder($input: CreateOrderInput!) {
      createOrder(input: $input) {
        id
        orderId
        customerName
        orderType
        tableNumber
        items
        totalPrice
        status
        assignedServer
        timestamp
      }
    }
  `;
  
  try {
    console.log('🍽️  Creating test restaurant order...\n');
    
    const result = await client.graphql({
      query: mutation,
      variables: {
        input: {
          orderId,
          customerName: 'Christopher',
          customerPhone: '254-555-0100',
          orderType: 'Dine-In',
          tableNumber: '5',
          items: JSON.stringify(orderItems),
          totalPrice,
          specialInstructions: 'Extra salsa please',
          status: 'Pending',
          assignedServer: 'Rosa',
          timestamp: new Date().toISOString()
        }
      }
    });
    
    console.log('✅ Order created successfully!\n');
    console.log('═══════════════════════════════════════');
    console.log('Order ID:', result.data.createOrder.orderId);
    console.log('Customer:', result.data.createOrder.customerName);
    console.log('Type:', result.data.createOrder.orderType);
    console.log('Table:', result.data.createOrder.tableNumber);
    console.log('Server:', result.data.createOrder.assignedServer);
    console.log('Total:', '$' + result.data.createOrder.totalPrice.toFixed(2));
    console.log('Status:', result.data.createOrder.status);
    console.log('\nItems:');
    JSON.parse(result.data.createOrder.items).forEach(item => {
      console.log(`  - ${item.quantity}x ${item.name} ($${item.price}) - ${item.customizations}`);
    });
    console.log('═══════════════════════════════════════\n');
    
  } catch (error) {
    console.error('❌ Error creating order:', error);
    if (error.errors) {
      error.errors.forEach(e => console.error('  -', e.message));
    }
  }
}

createTestOrder();
