import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    did: v.string(),
  }).index("by_did", ["did"]),
});