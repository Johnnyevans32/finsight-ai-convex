import { useAppStore } from "~/store";
import {
  ACCOUNTS,
  ACCOUNT_TRANSACTIONS,
  ACCOUNT_ASSETS,
  BUDGETS,
  CONVERSATIONS,
} from "~/services/schemas";

export function useAppVueUtils() {
  const config = useRuntimeConfig();

  const { deleteRecord } = useWeb5VueUtils();
  const { disconnectAccount } = useConvex();

  const { transactions, assets, accounts, budgets, conversations } =
    storeToRefs(useAppStore());
  const {
    setAccounts,
    setTransactions,
    setAssets,
    setConversations,
    setBudgets,
  } = useAppStore();

  const $launchMono = (options: any) => {
    const connect = new Connect({
      key: config.public.monoPublicKey,
      ...options,
    });
    connect.setup();
    connect.open();
  };

  const deleteRecordsFromProtocol = async (
    deleteAll = false,
    accountIds: string[] = accounts.value.map((acc) => acc.accountId)
  ) => {
    accountIds.map((accountId) => disconnectAccount(accountId));

    const deleteRecordPromises = [
      ...accounts.value
        .filter(
          (account) => accountIds.includes(account.accountId) || deleteAll
        )
        .map((account) => deleteRecord(account.recordId || "", ACCOUNTS)),
      ...transactions.value
        .filter((txn) => accountIds.includes(txn.accountId) || deleteAll)
        .map((txn) => deleteRecord(txn.recordId || "", ACCOUNT_TRANSACTIONS)),
      ...assets.value
        .filter((asset) => accountIds.includes(asset.accountId) || deleteAll)
        .map((asset) => deleteRecord(asset.recordId || "", ACCOUNT_ASSETS)),
      ...(deleteAll
        ? budgets.value.map((budget) =>
            deleteRecord(budget.recordId || "", BUDGETS)
          )
        : []),
      ...(deleteAll
        ? conversations.value.map((conversation) =>
            deleteRecord(conversation.recordId || "", CONVERSATIONS)
          )
        : []),
    ];

    await Promise.all(deleteRecordPromises);
    const updatedAccounts = accounts.value.filter(
      (acc) => !accountIds.includes(acc.accountId) && !deleteAll
    );
    const updatedTransactions = transactions.value.filter(
      (txn) => !accountIds.includes(txn.accountId) && !deleteAll
    );
    const updatedAssets = assets.value.filter(
      (asset) => !accountIds.includes(asset.accountId) && !deleteAll
    );

    setAccounts(updatedAccounts);
    setTransactions(updatedTransactions);
    setAssets(updatedAssets);

    if (deleteAll) {
      setBudgets([]);
      setConversations([]);
    }
  };

  return {
    $launchMono,
    deleteRecordsFromProtocol,
  };
}
