import { ConvexClient } from "convex/browser";

export default defineNuxtPlugin(async () => {
  const config = useRuntimeConfig();

  let convexClient: ConvexClient;

  try {
    console.log("connecting to convex", config.public.convexUrl);
    convexClient = new ConvexClient(config.public.convexUrl);

    console.log("connected to convex");
  } catch (err) {
    console.error("error from convex", err);
    throw err;
  }

  return {
    provide: {
      convexClient,
    },
  };
});
