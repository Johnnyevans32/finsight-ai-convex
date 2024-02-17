import { api } from "~/convex/_generated/api";

export function useConvex() {
  const { $convexClient } = useNuxtApp();

  const connectAccount = async (code: string) => {
    return await $convexClient.action(api.mono.connectAccount, { code });
  };
  const disconnectAccount = async (accountId: string) => {
    return await $convexClient.action(api.mono.disconnectAccount, {
      accountId,
    });
  };

  const fetchAccountStatement = async (accountId: string) => {
    return await $convexClient.action(api.mono.fetchAccountStatement, {
      accountId,
    });
  };
  const fetchAccountTransactions = async (accountId: string) => {
    return await $convexClient.action(api.mono.fetchAccountTransactions, {
      accountId,
    });
  };
  const fetchAccountAssets = async (accountId: string) => {
    return await $convexClient.action(api.mono.fetchAccountAssets, {
      accountId,
    });
  };
  const fetchAccountDetails = async (accountId: string) => {
    return await $convexClient.action(api.mono.fetchAccountDetails, {
      accountId,
    });
  };

  const chat = async (context: string, prompt: string) => {
    return await $convexClient.action(api.gpt.chat, {
      context,
      prompt,
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
  };
}
