import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  Order: a
    .model({
      orderId: a.string().required(),
      customerName: a.string().required(),
      customerPhone: a.string(),
      orderType: a.string().required(), // "Dine-In", "Pickup", "Delivery"
      tableNumber: a.string(),
      
      // Order items (stored as JSON string)
      items: a.string().required(), // JSON array of {itemId, name, quantity, price, customizations}
      
      totalPrice: a.float().required(),
      specialInstructions: a.string(),
      
      status: a.string().required(), // "Pending", "Preparing", "Ready", "Complete", "Cancelled"
      assignedServer: a.string(),
      
      timestamp: a.datetime().required(),
      estimatedReadyTime: a.datetime(),
    })
    .authorization((allow) => [allow.publicApiKey()]),

  MenuItem: a
    .model({
      itemId: a.string().required(),
      category: a.string().required(), // "Breakfast", "Main", "Specialty", "Drinks", "Antojitos"
      name: a.string().required(),
      price: a.float().required(),
      description: a.string(),
      available: a.boolean().required(),
      image: a.string(), // URL to food image
      
      // Customization options (stored as JSON)
      customizationOptions: a.string(), // JSON array of available customizations
    })
    .authorization((allow) => [allow.publicApiKey()]),

  TableAssignment: a
    .model({
      tableNumber: a.string().required(),
      serverName: a.string().required(),
      section: a.string(), // "Indoor", "Outdoor Patio", "Bar"
    })
    .authorization((allow) => [allow.publicApiKey()]),
    
  Customer: a
    .model({
      customerId: a.string().required(),
      name: a.string().required(),
      phone: a.string(),
      email: a.string(),
      orderHistory: a.string(), // JSON array of order IDs
    })
    .authorization((allow) => [allow.publicApiKey()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'apiKey',
    apiKeyAuthorizationMode: {
      expiresInDays: 365,
    },
  },
});
