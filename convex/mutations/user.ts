import { v } from "convex/values";
import { mutation } from "../_generated/server";

export const createUser = mutation({
  args: { did: v.string() },
  handler: async (ctx, args) => {
    const userAlreadyExist = await ctx.db
      .query("users")
      .withIndex("by_did", (q) => q.eq("did", args.did))
      .first();
    if (userAlreadyExist) return;
    await ctx.db.insert("users", { did: args.did });
  },
});
