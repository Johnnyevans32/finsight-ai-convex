<template>
  <div class="md:h-[80vh] h-[75vh] flex flex-col gap-2 place-content-between">
    <ChatConversation v-show="conversations.length" />

    <div
      class="grid grid-cols-2 gap-2 mt-36"
      v-show="!conversations || conversations.length === 0"
    >
      <div class="col-span-2 flex flex-col gap-2 mb-36">
        <font-awesome-icon icon="fa-brands fa-android" class="text-5xl" />
        <h1>
          I'm your personal financial assistant, how may I help you today?
        </h1>
      </div>

      <div
        v-for="(promptItem, index) in suggestedPrompts"
        :key="index"
        class="flex justify-between items-center py-2 px-5 rounded-xl bg-bgbase border-[1px] border-base cursor-pointer hover:bg-lightbase"
        @mouseover="hoveredIndex = index"
        @mouseout="hoveredIndex = null"
        @click="
          () => {
            prompt = `${promptItem.title} ${promptItem.others}`;
            answerQuestion();
          }
        "
      >
        <div class="text-left text-sm">
          <p class="font-extrabold">
            {{ promptItem.title }}
          </p>
          <p>{{ promptItem.others }}</p>
        </div>
        <font-awesome-icon
          v-show="hoveredIndex === index"
          icon="arrow-up"
          class="bg-bgbase rounded-lg h-5 w-5 p-1"
        />
      </div>
    </div>

    <div class="flex">
      <CommonFormInput
        v-model="prompt"
        @keyup.enter="answerQuestion"
        class="flex-1"
        custom-css="border-r-0 rounded-r-none"
        placeholder="Ask me anything about your finance"
      />
      <button
        class="flex items-center bg-lightbase rounded-lg px-5 py-2 border-[1px] border-l-0 border-base rounded-l-none"
        @click="answerQuestion"
      >
        <font-awesome-icon
          :icon="aiResponseLoading ? 'pause' : 'arrow-up'"
          class="bg-bgbase rounded-lg h-5 w-5 p-1"
        />
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { notify } from "@kyvg/vue3-notification";
import moment from "moment";

import { useAppStore } from "~/store";
import {
  BudgetDTO,
  ConversationDTO,
  TransactionType,
  TransactionCategory,
} from "~/types/accounts";
import { CONVERSATIONS } from "~/services/schemas";
import { useAppUserConfigStore } from "~/store/config";

interface MonthlyTransaction {
  income: number;
  expenses: number;
  differences: number;
}

export default defineComponent({
  async setup() {
    const { budgets, transactions, accounts, assets, conversations } =
      storeToRefs(useAppStore());
    const { currency } = storeToRefs(useAppUserConfigStore());
    const { createRecord } = useWeb5VueUtils();
    const { setConversations } = useAppStore();

    const { chat } = useConvex();

    const hoveredIndex = ref<null | number>(null);
    const suggestedPrompts = ref([
      { title: "What's my", others: "income for last month?" },
      { title: "What's my", others: "networth?" },
      { title: "Show me my", others: "monthly expenses breakdown?" },
      {
        title: "Set a budget of",
        others: "500 naira for dining out this month.",
      },
    ]);

    const prompt = ref("");

    const aiResponseLoading = ref(false);

    const userFinanceContext = computed(() => {
      if (!transactions.value.length) {
        return "";
      }
      const monthlyTransactions: Record<string, MonthlyTransaction> =
        transactions.value.reduce((acc, transaction) => {
          const transactionDate = moment(transaction.date);
          const monthYear = transactionDate.format("MMMM YYYY");

          if (!acc[monthYear]) {
            acc[monthYear] = {
              income: 0,
              expenses: 0,
              differences: 0,
            };
          }

          if (transaction.type === "credit") {
            acc[monthYear].income += transaction.amount;
          } else if (transaction.type === "debit") {
            acc[monthYear].expenses += transaction.amount;
          }

          acc[monthYear].differences =
            acc[monthYear].income - acc[monthYear].expenses;

          return acc;
        }, {} as Record<string, MonthlyTransaction>);

      const monthlyFigures = Object.entries(monthlyTransactions)
        .map(([monthYear, data]) => {
          return `Month and Year: ${monthYear} | Income: ${data.income} | Expenses: ${data.expenses} | Currency: ${currency.value}`;
        })
        .join("\n");

      const transactionText = transactions.value
        .map((transaction) => {
          return `Transaction: ${transaction.narration} | Amount: ${
            transaction.amount
          } | Type: ${transaction.type} | Category: ${
            transaction.category || "Uncategorized"
          } | Currency: ${
            transaction.currency
          } | Account Balance After Transaction | ${
            transaction.balance
          } |  Account Id: ${transaction.accountId} |  Date: ${
            transaction.date
          } `;
        })
        .join("\n");

      const startOfMonth = moment().startOf("month");
      const endOfMonth = moment().endOf("month");

      const transactionsForPeriod = transactions.value.filter(
        (transaction) =>
          moment(transaction.date).isBetween(
            startOfMonth,
            endOfMonth,
            undefined,
            "[]"
          ) &&
          transaction.type === TransactionType.DEBIT &&
          !!transaction.category
      );
      const budgetsGroupedByCategory: Record<
        TransactionCategory,
        BudgetDTO & { amountSpentOnCategoryBudget?: number }
      > = groupBy(budgets.value, "category");

      transactionsForPeriod.forEach((transaction) => {
        const { category, amount, currency } = transaction;
        if (
          category &&
          budgetsGroupedByCategory[category] &&
          budgetsGroupedByCategory[category].currency === currency
        ) {
          const amountSpentOnCategoryBudget =
            (budgetsGroupedByCategory[category].amountSpentOnCategoryBudget ||
              0) + amount;

          budgetsGroupedByCategory[category] = {
            ...budgetsGroupedByCategory[category],
            amountSpentOnCategoryBudget,
          };
        }
      });

      const budgetText = Object.values(budgetsGroupedByCategory)
        .map((budget) => {
          return `Budget: ${budget.category} | Limit: ${
            budget.limit
          } | Amount Spent: ${budget.amountSpentOnCategoryBudget} | Currency: ${
            budget.currency
          } | Period: From ${startOfMonth.format(
            "MMMM Do YYYY"
          )} to ${endOfMonth.format("MMMM Do YYYY")}`;
        })
        .join("\n");

      const accountText = accounts.value
        .map((account) => {
          return `Account: ${account.accountName} | Balance: ${account.balance} | Currency: ${account.currency} | Bank Name: ${account.bankName}`;
        })
        .join("\n");

      const assetText = assets.value
        .map((asset) => {
          return `Asset name: ${asset.name} | Type of asset: ${
            asset.type || asset.meta.type
          } | Purchase price of asset: ${asset.price} | Currency: ${
            asset.currency
          } | Cost incurred on purchasing the asset: ${
            asset.cost
          } | Quantity of asset owned: ${
            asset.quantity
          } | Unrealized amount gained by the user: ${asset.return}`;
        })
        .join("\n");

      const context = `
        Monthly Financial Figures:
        ${monthlyFigures}

        User's Budgets:
        ${budgetText}

        User's Connected Bank Accounts:
        ${accountText}

        User's Assets & Investments:
        ${assetText}
      `;

      return context;
    });

    const answerQuestion = async () => {
      try {
        if (aiResponseLoading.value) {
          return;
        }
        aiResponseLoading.value = true;
        if (!userFinanceContext.value) {
          notify({
            type: "error",
            title: "context not available",
          });
          return;
        }

        if (!prompt.value) {
          notify({
            type: "error",
            title: "prompt not available",
          });
          return;
        }
        const userPrompt = prompt.value;
        prompt.value = "";
        addToConversations(userPrompt, "user");

        const response = await chat(userFinanceContext.value, userPrompt);

        addToConversations(response, "ai");
      } catch (error) {
        console.log({ error });
        notify({
          type: "error",
          title: (error as any)?.data?.message || "try again, an error occured",
        });
      } finally {
        aiResponseLoading.value = false;
      }
    };

    const addToConversations = (message: string, author: "ai" | "user") => {
      const data = {
        message,
        author,
        date: moment().toString(),
      };
      setConversations([...conversations.value, data]);
      createRecord<ConversationDTO>(data, CONVERSATIONS);
    };

    return {
      prompt,
      answerQuestion,
      aiResponseLoading,
      suggestedPrompts,
      hoveredIndex,
      conversations,
    };
  },
});
</script>
