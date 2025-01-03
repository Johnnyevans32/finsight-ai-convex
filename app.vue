<template>
  <div :class="appThemeColor" class="bg-bgbase text-base">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <notifications position="top center" width="100%" animation-type="css">
      <template #body="props">
        <div
          :class="[
            'flex items-center p-5 md:mx-[30vw] font-semibold bg-black border-l-4 text-white',
            {
              'border-green-500': props.item.type === 'success',
              'border-blue-500': props.item.type === 'info',
              'border-red-500':
                props.item.type !== 'success' && props.item.type !== 'info',
            },
          ]"
        >
          <font-awesome-icon
            v-if="props.item.type === 'success'"
            icon="fa-solid fa-thumbs-up"
            class="text-green-500"
          />
          <font-awesome-icon
            v-else-if="props.item.type === 'info'"
            icon="fa-solid fa-circle-exclamation"
            class="text-blue-500"
          />
          <font-awesome-icon
            v-else
            icon="fa-solid fa-circle-exclamation"
            class="text-red-500"
          />
          <div class="ml-3 text-sm font-medium">
            <div>{{ props.item.title }}</div>
            <div
              v-if="props.item.text"
              class="text-xs"
              v-html="props.item.text"
            />
          </div>
          <button
            type="button"
            @click="props.close"
            class="ml-auto -mx-1.5 -my-1.5 text-white w-6 h-6 p-2 rounded-xl flex items-center justify-center"
          >
            <font-awesome-icon icon="fa-solid fa-xmark" />
          </button>
        </div>
      </template>
    </notifications>
  </div>
</template>

<script lang="ts">
import {
  ACCOUNT_TRANSACTIONS,
  ACCOUNTS,
  ACCOUNT_ASSETS,
} from "~/services/schemas";
import { useAppStore } from "~/store";
import { useAppUserConfigStore } from "~/store/config";
import type {
  AccountStatementDTO,
  AccountDTO,
  AccountAssetDTO,
} from "~/types/accounts";

export default defineComponent({
  async setup() {
    const config = useRuntimeConfig();
    const { $did } = useNuxtApp();
    const { ping } = useConvex();

    const { appThemeColor } = storeToRefs(useAppUserConfigStore());

    const browserThemeMap: any = {
      light: "244, 244, 244",
      cherry: "255, 255, 255",
      coffee: "255, 255, 255",
      dark: "0, 0, 0",
      white: "255, 255, 255",
      ocean: "255, 255, 255",
      forest: "255, 255, 255",
      midnight: "0, 0, 0",
      sunflower: "255, 255, 255",
      "ocean-breeze": "255, 255, 255",
      "royal-purple": "255, 255, 255",
      "lavender-dream": "255, 255, 255",
      lemon: "255, 255, 255",
    };
    useHead({
      titleTemplate: (titleChunk) => {
        return titleChunk && titleChunk !== config.public.appName
          ? `${config.public.appName}: ${titleChunk}`
          : config.public.appName;
      },
    });

    const { findRecords, configureProtocol } = useWeb5VueUtils();
    const {
      setAccounts,
      setAssets,
      setTransactions,
      updateRecordPullingStatus,
      setMyDid,
    } = useAppStore();

    watch(appThemeColor, () => {
      setBrowserThemeColor();
    });

    onBeforeMount(async () => {
      try {
        const monoJS = "https://connect.withmono.com/connect.js";
        const script = document.createElement("script");
        script.src = monoJS;
        // Only run if mono script has not been added to the body
        if (!document.querySelector(`[src="${monoJS}"]`)) {
          document.body.appendChild(script);
        }
        setMyDid($did);

        ping();
        setBrowserThemeColor();

        updateRecordPullingStatus(ACCOUNT_TRANSACTIONS, true);
        updateRecordPullingStatus(ACCOUNTS, true);
        await configureProtocol();

        const [dbAccounts, dbTransactions, dbAssets] = await Promise.all([
          findRecords<AccountDTO[]>(ACCOUNTS),
          findRecords<AccountStatementDTO[]>(ACCOUNT_TRANSACTIONS),
          findRecords<AccountAssetDTO[]>(ACCOUNT_ASSETS),
        ]);
        setAccounts(dbAccounts);
        setTransactions(dbTransactions);
        setAssets(dbAssets);
      } catch (err) {
        console.log("before mount error", { err });
      } finally {
        updateRecordPullingStatus(ACCOUNT_TRANSACTIONS, false);
        updateRecordPullingStatus(ACCOUNTS, false);
      }
    });

    const setBrowserThemeColor = () => {
      let themeColorDOM = document.querySelector('meta[name="theme-color"]');

      if (!themeColorDOM) {
        themeColorDOM = document.createElement("meta");
        themeColorDOM.setAttribute("name", "theme-color");
        document.head.appendChild(themeColorDOM);
      }

      themeColorDOM.setAttribute(
        "content",
        `rgb(${browserThemeMap[appThemeColor.value]})`
      );
    };

    return {
      appThemeColor,
    };
  },
});
</script>

<style>
html {
  /* font-family: "Farfetch Basis Regular"; */
  font-family: "PowerGroteskTrial-Regular";
}

@font-face {
  font-family: "PowerGroteskTrial-Bold";
  src: local("PowerGroteskTrial"),
    url("./assets/PowerGroteskTrial-Bold.ttf") format("truetype");
}
@font-face {
  font-family: "PowerGroteskTrial-Light";
  src: local("PowerGroteskTrial"),
    url("./assets/PowerGroteskTrial-Light.ttf") format("truetype");
}
@font-face {
  font-family: "PowerGroteskTrial-Regular";
  src: local("PowerGroteskTrial"),
    url("./assets/PowerGroteskTrial-Regular.ttf") format("truetype");
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}
</style>
