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
      source: a.string(), // "Restaurant" | "FoodTruck"
      smsConsent: a.boolean(), // Customer opted in to SMS notifications

      timestamp: a.datetime().required(),
      estimatedReadyTime: a.datetime(),
    })
    .authorization((allow) => [allow.publicApiKey()]),

  MenuItem: a
    .model({
      itemId: a.string().required(),
      restaurant_id: a.string(), // e.g. "maschingonrestaurant", "bar1859"
      category: a.string().required(), // "Breakfast", "Main", "Specialty", "Drinks", "Antojitos"
      name: a.string().required(),
      price: a.float().required(),
      description: a.string(),
      available: a.boolean().required(),
      image: a.string(), // URL to food image

      // Customization options (stored as JSON)
      customizationOptions: a.string(), // JSON array of available customizations
      modifierGroups: a.string(),       // structured modifier groups (JSON)
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

  HunterEstimate: a
    .model({
      // Contact
      name: a.string().required(),
      phone: a.string().required(),
      email: a.string(),

      // Property
      address: a.string().required(),
      lat: a.float(),
      lng: a.float(),
      parcelOwner: a.string(),
      parcelCounty: a.string(),
      parcelGeoJSON: a.string(),    // saved parcel boundary so dashboard can render it

      // Clearing area
      acres: a.float(),
      drawnGeoJSON: a.string(),     // user's drawn clearing area(s)

      // Internal workflow
      status: a.string().required(),// "New" | "Called" | "Quoted" | "Won" | "Lost"
      notes: a.string(),            // internal notes (Jason only)

      // Customer-facing job progress
      jobStatus: a.string(),        // "Pending Review" | "Quoted" | "Scheduled" | "In Progress" | "Completed"
      quotedPrice: a.float(),       // dollar amount of quote
      finalPrice: a.float(),        // final bill amount (may differ from quote)
      scheduledDate: a.datetime(),    // when work is scheduled (start)
      scheduledEndDate: a.datetime(),// last day of multi-day jobs
      startedDate: a.datetime(),    // when work actually started
      completedDate: a.datetime(),  // when work was completed
      percentComplete: a.integer(), // 0-100, set during In Progress
      customerNotes: a.string(),    // notes visible to the customer
      photoUrls: a.string(),        // JSON array of photo URLs
      invoiceSent: a.boolean(),     // has Jason sent the bill?

      submittedAt: a.datetime().required(),
    })
    .authorization((allow) => [allow.publicApiKey()]),

  CabinetsEstimate: a
    .model({
      // Contact
      name: a.string().required(),
      phone: a.string().required(),
      email: a.string(),

      // Project
      address: a.string().required(),
      projectType: a.string(),          // "New Construction" | "Remodel" | "Kitchen Only" | "Full Home"

      // Plans & AI analysis
      planUrl: a.string(),              // S3 URL of uploaded floor plan (PDF or image)
      planAnalysis: a.string(),         // JSON: Claude's room-by-room cabinet analysis
      rooms: a.string(),                // JSON: confirmed cabinet needs per room after customer review

      // Style preferences
      style: a.string(),                // "Shaker" | "Traditional" | "Contemporary" | "Rustic" | "Modern"
      finish: a.string(),               // wood species / color / paint preference
      budget: a.string(),               // budget range e.g. "$10k-$20k"

      // Internal workflow
      status: a.string().required(),    // "New" | "Called" | "Quoted" | "Won" | "Lost"
      notes: a.string(),

      // Customer-facing job progress
      jobStatus: a.string(),            // "Pending Review" | "Quoted" | "Scheduled" | "In Progress" | "Completed"
      quotedPrice: a.float(),
      finalPrice: a.float(),
      scheduledDate: a.datetime(),
      scheduledEndDate: a.datetime(),
      startedDate: a.datetime(),
      completedDate: a.datetime(),
      percentComplete: a.integer(),
      customerNotes: a.string(),
      photoUrls: a.string(),            // JSON array of job photo URLs
      invoiceSent: a.boolean(),

      submittedAt: a.datetime().required(),
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
