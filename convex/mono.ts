"use node";
import { action } from "./_generated/server";
import { v } from "convex/values";
import axios from "axios";
import {
  AccountDetail,
  AccountLinkProviderResponse,
  AccountStatement,
  Currency,
  IAccountAssetResponse,
  CurrencySymbols,
  IAccountTransactionResponse,
  BankDTO,
} from "./mono.types";
import { extractBgColorsFromImage, groupBy } from "./utils";

const $axios = axios.create({
  baseURL: process.env.MONO_API_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "x-real-time": true,
    "mono-sec-key": process.env.MONO_SECRET_KEY,
  },
});

export const connectAccount = action({
  args: { code: v.string() },
  handler: async (_, args) => {
    const code = args.code;
    const { data: response } = await $axios.request<{ id: string }>({
      url: `/account/auth`,
      method: "POST",
      data: { code },
    });
    return response.id;
  },
});

export const fetchAccountAssets = action({
  args: { accountId: v.string() },
  handler: async (_, args) => {
    const accountId = args.accountId;
    const {
      data: { assets },
    } = await $axios.request<IAccountAssetResponse>({
      url: `/accounts/${accountId}/assets`,
      method: "GET",
    });
    const result = assets.map((asset) => {
      const currency = asset.currency.toUpperCase() as Currency;
      return {
        accountId,
        assetId: asset._id,
        name: asset.name,
        cost: asset.cost,
        type: asset.type,
        return: asset.return,
        quantity: asset.quantity,
        currency,
        price: asset.details.price,
        currencySign: CurrencySymbols[currency],
        meta: asset,
      };
    });
    return result;
  },
});

export const fetchAccountStatement = action({
  args: { accountId: v.string() },
  handler: async (_, args) => {
    const accountId = args.accountId;
    const {
      data: { data: statementData },
    } = await $axios.request<AccountLinkProviderResponse<AccountStatement[]>>({
      url: `/accounts/${accountId}/statement`,
      method: "GET",
      params: { period: "last12months" },
    });
    const statement = statementData.map((d) => {
      const currency = d.currency.toUpperCase() as Currency;
      return {
        accountId,
        statementId: d._id,
        type: d.type,
        amount: d.amount / 100,
        balance: (d.balance || 0) / 100,
        date: d.date,
        narration: d.narration,
        currency,
        category: d.category,
        currencySign: CurrencySymbols[currency],
        meta: d,
      };
    });

    return statement;
  },
});

export const fetchAccountTransactions = action({
  args: { accountId: v.string() },
  handler: async (_, args) => {
    const accountId = args.accountId;
    const {
      data: { data: txnData },
    } = await $axios.request<IAccountTransactionResponse>({
      url: `/v1/accounts/${accountId}/transactions`,
      method: "GET",
      params: { pagination: false },
    });
    const txns = txnData.map((d) => {
      const currency = d.currency.toUpperCase() as Currency;
      return {
        accountId,
        statementId: d._id,
        type: d.type,
        amount: d.amount / 100,
        balance: (d.balance || 0) / 100,
        date: d.date,
        narration: d.narration,
        currency,
        category: d.category,
        currencySign: CurrencySymbols[currency],
        meta: d,
      };
    });

    return txns;
  },
});

export const fetchAccountDetails = action({
  args: { accountId: v.string() },
  handler: async (_, args) => {
    const accountId = args.accountId;
    const [
      {
        data: { data: accountData },
      },
      { data: banksRes },
    ] = await Promise.all([
      $axios.request<AccountLinkProviderResponse<AccountDetail>>({
        url: `/v1/accounts/${accountId}`,
        method: "GET",
      }),
      axios.request<BankDTO[]>({
        url: "https://nigerianbanks.xyz",
        method: "get",
      }),
    ]);

    const banks = await Promise.all(
      banksRes.map(async (bank) => {
        if (bank.logo) {
          const result = await extractBgColorsFromImage(bank.logo);
          bank = {
            ...bank,
            bankLogoMutedColor: result.mutedColor,
            bankLogoTextColor: result.textColor,
            bankLogoVibrantColor: result.vibrantColor,
          };
        }

        return bank;
      })
    );

    const banksGroupedByCode = groupBy(banks, "code");

    const currency = accountData.currency.toUpperCase() as Currency;
    const {
      bankLogoMutedColor,
      bankLogoTextColor,
      bankLogoVibrantColor,
      logo: bankLogo,
    } = banksGroupedByCode[accountData.institution.bank_code] || {};

    return {
      accountId,
      bankName: accountData.institution.name,
      balance: accountData.balance / 100,
      accountNumber: accountData.account_number,
      accountName: accountData.name,
      currency,
      bankLogo,
      bankLogoMutedColor,
      bankLogoTextColor,
      bankLogoVibrantColor,
      currencySign: CurrencySymbols[currency],
      meta: accountData,
    };
  },
});

export const disconnectAccount = action({
  args: { accountId: v.string() },
  handler: async (_, args) => {
    const accountId = args.accountId;
    const { data: response } = await $axios.request({
      url: `/accounts/${accountId}/unlink`,
      method: "POST",
    });
    console.log({ response });
  },
});
