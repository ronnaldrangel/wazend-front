import WooCommerceRestApi from '@woocommerce/woocommerce-rest-api';

export const wc = new WooCommerceRestApi({
  url: process.env.NEXT_PUBLIC_WC_STORE_URL!,      // https://tutienda.com
  consumerKey: process.env.WC_CONSUMER_KEY!,       // clave “ck_…”
  consumerSecret: process.env.WC_CONSUMER_SECRET!, // clave “cs_…”
  version: 'wc/v3',                                // activa Subscriptions 3.x
  queryStringAuth: true                            // útil en local sin HTTPS
});
