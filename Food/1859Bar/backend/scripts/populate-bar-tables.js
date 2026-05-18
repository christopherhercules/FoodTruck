const { Amplify } = require('aws-amplify');
const { generateClient } = require('aws-amplify/api');
const config = require('../amplify_outputs.json');

Amplify.configure(config);
const client = generateClient();

const tables = [
  // Indoor tables
  { tableNumber: '1',   serverName: 'Alex',   section: 'Indoor' },
  { tableNumber: '2',   serverName: 'Alex',   section: 'Indoor' },
  { tableNumber: '3',   serverName: 'Jordan', section: 'Indoor' },
  { tableNumber: '4',   serverName: 'Jordan', section: 'Indoor' },
  { tableNumber: '5',   serverName: 'Casey',  section: 'Indoor' },
  { tableNumber: '6',   serverName: 'Casey',  section: 'Indoor' },
  { tableNumber: '7',   serverName: 'Morgan', section: 'Indoor' },
  { tableNumber: '8',   serverName: 'Morgan', section: 'Indoor' },

  // Patio tables
  { tableNumber: 'P1',  serverName: 'Sam',    section: 'Patio' },
  { tableNumber: 'P2',  serverName: 'Sam',    section: 'Patio' },
  { tableNumber: 'P3',  serverName: 'Riley',  section: 'Patio' },
  { tableNumber: 'P4',  serverName: 'Riley',  section: 'Patio' },

  // Bar seats
  { tableNumber: 'BAR', serverName: 'Diego',  section: 'Bar' },
];

async function populateTables() {
  console.log('🪑 Populating 1859 Bar Table Assignments...\n');

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
