import { useAppStore } from "~/store";
import { api } from "~/convex/_generated/api";

export function useConvex() {
  const { $convexClient } = useNuxtApp();
  const { myDid } = storeToRefs(useAppStore());

  const connectAccount = async (code: string) => {
    return await $convexClient.action(api.actions.mono.connectAccount, {
      code,
    });
  };
  const disconnectAccount = async (accountId: string) => {
    return await $convexClient.action(api.actions.mono.disconnectAccount, {
      accountId,
    });
  };

  const fetchAccountStatement = async (accountId: string) => {
    return await $convexClient.action(api.actions.mono.fetchAccountStatement, {
      accountId,
    });
  };
  const fetchAccountTransactions = async (accountId: string) => {
    return await $convexClient.action(
      api.actions.mono.fetchAccountTransactions,
      {
        accountId,
      }
    );
  };
  const fetchAccountAssets = async (accountId: string) => {
    return await $convexClient.action(api.actions.mono.fetchAccountAssets, {
      accountId,
    });
  };
  const fetchAccountDetails = async (accountId: string) => {
    return await $convexClient.action(api.actions.mono.fetchAccountDetails, {
      accountId,
    });
  };

  const chat = async (context: string, prompt: string) => {
    return await $convexClient.action(api.actions.ai.chat, {
      context,
      prompt,
    });
  };

  const sendResetPasswordCodeEmail = async (code: string, email: string) => {
    return await $convexClient.action(
      api.actions.user.sendResetPasswordCodeEmail,
      {
        code,
        email,
        did: myDid.value,
      }
    );
  };

  const ping = async () => {
    return await $convexClient.mutation(api.mutations.user.createUser, {
      did: myDid.value,
    });
  };
  return {
    connectAccount,
    disconnectAccount,
    fetchAccountStatement,
    fetchAccountTransactions,
    fetchAccountAssets,
    fetchAccountDetails,
    chat,
    sendResetPasswordCodeEmail,
    ping,
  };
}
