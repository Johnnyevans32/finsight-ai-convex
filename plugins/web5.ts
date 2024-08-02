import { Web5 } from "@web5/api";
import { useAppUserConfigStore } from "~/store/config";

export default defineNuxtPlugin(async () => {
  const { dwnEndpoint } = storeToRefs(useAppUserConfigStore());
  let web5: Web5;
  let did: string;

  console.log("connecting to web5");
  try {
    ({ web5, did } = await Web5.connect({
      ...(dwnEndpoint.value
        ? { didCreateOptions: { dwnEndpoints: [dwnEndpoint.value] } }
        : {}),
      sync: "60s",
      registration: {
        onSuccess: () => {
          console.log("data");
          /*
      Registration succeeded, set a local storage value to indicate the user 
      is registered and registration does not need to occur again
      */
        },
        onFailure: (error) => {
          console.log({ error });
          /* 
      Registration failed, display an error message to the user, and pass in 
      the registration object again to retry next time the user connects
      */
        },
      },
    }));
    console.log("connected to web5");
  } catch (err) {
    console.error("error from web5", err);
    throw err;
  }

  return {
    provide: {
      web5,
      did,
    },
  };
});
