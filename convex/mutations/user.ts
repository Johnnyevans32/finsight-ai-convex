import { v } from "convex/values";
import { internalMutation } from "../_generated/server";

export const createUser = internalMutation({
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
