import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
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

  WSTNProperty: a
    .model({
      name:      a.string().required(),
      type:      a.string(),        // apartment | house | condo | townhome
      address:   a.string(),
      city:      a.string(),
      minPrice:  a.integer(),
      maxPrice:  a.integer(),
      beds:      a.string().array(),
      amenities: a.string(),
      notes:     a.string(),        // private — never shown to clients
      active:    a.boolean(),
    })
    .authorization((allow) => [allow.publicApiKey()]),

  WSTNLead: a
    .model({
      // Contact
      name:          a.string(),
      phone:         a.string(),
      email:         a.string(),

      // Lead classification
      type:          a.string().required(),  // 'rent' | 'buy' | 'sell'
      source:        a.string(),             // 'chat' | 'website' | 'form' | 'referral'
      status:        a.string().required(),  // 'New' | 'Called' | 'Showing' | 'Active' | 'Closed' | 'Lost'

      // Rent fields
      budget:        a.string(),
      beds:          a.string(),
      movedate:      a.string(),
      area:          a.string(),

      // Buy fields
      timeline:      a.string(),
      preapproved:   a.string(),

      // Sell fields
      address:       a.string(),
      askingprice:   a.string(),
      condition:     a.string(),

      // Shared
      notes:         a.string(),   // client-provided notes from chat
      internalNotes: a.string(),   // Brogan's private notes (dashboard only)

      submittedAt:   a.datetime().required(),
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
