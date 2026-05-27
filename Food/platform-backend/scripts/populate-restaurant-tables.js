const { Amplify } = require('aws-amplify');
const { generateClient } = require('aws-amplify/api');
const config = require('../amplify_outputs.json');

Amplify.configure(config);
const client = generateClient();

const tables = [
  // Indoor tables
  { tableNumber: '1', serverName: 'Maria', section: 'Indoor' },
  { tableNumber: '2', serverName: 'Maria', section: 'Indoor' },
  { tableNumber: '3', serverName: 'Carlos', section: 'Indoor' },
  { tableNumber: '4', serverName: 'Carlos', section: 'Indoor' },
  { tableNumber: '5', serverName: 'Rosa', section: 'Indoor' },
  { tableNumber: '6', serverName: 'Rosa', section: 'Indoor' },
  { tableNumber: '7', serverName: 'Miguel', section: 'Indoor' },
  { tableNumber: '8', serverName: 'Miguel', section: 'Indoor' },
  
  // Outdoor Patio tables
  { tableNumber: 'P1', serverName: 'Ana', section: 'Outdoor Patio' },
  { tableNumber: 'P2', serverName: 'Ana', section: 'Outdoor Patio' },
  { tableNumber: 'P3', serverName: 'Juan', section: 'Outdoor Patio' },
  { tableNumber: 'P4', serverName: 'Juan', section: 'Outdoor Patio' },
  
  // Bar area
  { tableNumber: 'BAR', serverName: 'Diego', section: 'Bar' },
];

async function populateTables() {
  console.log('🪑 Populating Mas Chingon Table Assignments...\n');
  
  const mutation = `
    mutation CreateTableAssignment($input: CreateTableAssignmentInput!) {
      createTableAssignment(input: $input) {
        id
        tableNumber
        serverName
        section
      }
    }
  `;
  
  for (const table of tables) {
    try {
      const result = await client.graphql({
        query: mutation,
        variables: { input: table }
      });
      console.log(`✅ Table ${result.data.createTableAssignment.tableNumber.padEnd(4)} → ${result.data.createTableAssignment.serverName.padEnd(10)} (${result.data.createTableAssignment.section})`);
    } catch (error) {
      console.error(`❌ Error:`, error.errors?.[0]?.message || error.message);
    }
  }
  
  console.log('\n✨ Table assignments complete!');
}

populateTables();
