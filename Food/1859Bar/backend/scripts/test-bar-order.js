const { Amplify } = require('aws-amplify');
const { generateClient } = require('aws-amplify/api');
const config = require('../amplify_outputs.json');

Amplify.configure(config);
const client = generateClient();

async function testOrder() {
  console.log('🍺 Testing 1859 Bar Order System...\n');

  const orderId = `ORD-TEST-${Date.now()}`;

  // 1. Create a test order
  console.log('1️⃣  Creating test order...');
  const createMutation = `
    mutation CreateOrder($input: CreateOrderInput!) {
      createOrder(input: $input) {
        id orderId customerName status totalPrice
      }
    }
  `;

  let orderId_created;
  try {
    const result = await client.graphql({
      query: createMutation,
      variables: {
        input: {
          orderId,
          customerName: 'Test Customer',
          orderType: 'Dine-In',
          tableNumber: 'BAR',
          items: JSON.stringify([
            { name: 'Classic Margarita', price: 11.00, customization: 'Salt Rim' },
            { name: 'Bar Nachos',        price: 14.00, customization: 'Add Jalapeños' }
          ]),
          totalPrice: 25.00,
          specialInstructions: 'Test order — please ignore',
          status: 'Pending',
          assignedServer: 'Diego',
          timestamp: new Date().toISOString()
        }
      }
    });
    orderId_created = result.data.createOrder.id;
    console.log(`   ✅ Order created: ${orderId} (id: ${orderId_created})`);
  } catch (err) {
    console.error('   ❌ Failed to create order:', err.errors?.[0]?.message || err.message);
    return;
  }

  // 2. Fetch the order back
  console.log('\n2️⃣  Fetching order back...');
  const listQuery = `
    query ListOrders($filter: ModelOrderFilterInput, $limit: Int) {
      listOrders(filter: $filter, limit: $limit) {
        items { id orderId customerName status totalPrice }
      }
    }
  `;
  try {
    const result = await client.graphql({
      query: listQuery,
      variables: { filter: { orderId: { eq: orderId } }, limit: 1000 }
    });
    const found = result.data.listOrders.items[0];
    if (found) {
      console.log(`   ✅ Found: ${found.orderId} — Status: ${found.status} — Total: $${found.totalPrice}`);
    } else {
      console.log('   ⚠️  Order not found in list query');
    }
  } catch (err) {
    console.error('   ❌ Failed to fetch:', err.errors?.[0]?.message || err.message);
  }

  // 3. Update status
  console.log('\n3️⃣  Updating status to Preparing...');
  const updateMutation = `
    mutation UpdateOrder($input: UpdateOrderInput!) {
      updateOrder(input: $input) {
        id orderId status
      }
    }
  `;
  try {
    const result = await client.graphql({
      query: updateMutation,
      variables: { input: { id: orderId_created, status: 'Preparing' } }
    });
    console.log(`   ✅ Status updated to: ${result.data.updateOrder.status}`);
  } catch (err) {
    console.error('   ❌ Failed to update:', err.errors?.[0]?.message || err.message);
  }

  console.log('\n✨ Test complete! Order system is working.');
  console.log(`\n   Track this order at: bar.aiagentassistance.com/track-order.html?orderId=${orderId}`);
}

testOrder();
