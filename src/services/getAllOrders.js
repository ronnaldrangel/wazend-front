// utils/woocommerceApi.js

import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

const api = new WooCommerceRestApi({
  url: "https://wazend.net/",
  consumerKey: "ck_aba52692925771c481a914f16c10a531bec5d84f",
  consumerSecret: "cs_cba092dcda43f3c6b5868b8a54d4ab09ee2aab0f",
  version: "wc/v3"
});

export async function getAllSubscriptions() {
  try {
    const subscriptions = await api.get("subscriptions", { per_page: 100 });
    return subscriptions.data;
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    throw error;
  }
}
