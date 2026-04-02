import { Inngest } from "inngest";

export const inngest = new Inngest({ 
  id: "socialwing",
  // Force local dev server if not in production to ensure events are captured
  eventKey: process.env.INNGEST_EVENT_KEY || "local",
});
