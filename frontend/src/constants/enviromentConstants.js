/** @format */

const LOCAL = "LOCAL";
const ONCARE_LOCAL = "ONCARE_LOCAL";
const ONCARE_DEV = "ONCARE_DEV";
const ARTPIXANDEV = "ARTPIXANDEV";
const ARTPIXANPROD = "ARTPIXANPROD";
const ENVIRONMENT = ONCARE_LOCAL;

// LOCALHOST DEV VARIABLES

const OFF = -1;
const L0 = 0;
const L1 = 1;
const L2 = 2;
const L3 = 3;

const local_debug_level = L1;
const artpixandev_debug_level = OFF;
const artpixanprod_debug_level = OFF;

let V_LOG_LEVEL = null;
let V_CURRENT_VERSION = null;
let V_BACKEND_ENDPOINT = null;
let V_KUARSIS_PUBLIC_STATIC_FOLDER = null;
// let V_KUARSIS_PUBLIC_STATIC_IMG_FOLDER = null
// let V_KUARSIS_PUBLIC_STATIC_MODELS_FOLDER = null
let V_KUARSIS_BANNER_MAIN_LOGO = null;
let V_KUARSIS_PUBLIC_BUCKET_URL = null;

switch (ENVIRONMENT) {
  case LOCAL:
    //CONSTANTS FOR LOCAL DEVELOPMENT ENVIRONMENT
    V_LOG_LEVEL = local_debug_level;
    V_CURRENT_VERSION = `v1.0.0.7-2023-08-27-01:59`;
    V_BACKEND_ENDPOINT = "http://localhost:5000";
    V_KUARSIS_PUBLIC_STATIC_FOLDER = "http://localhost:3000/images";
    // let V_KUARSIS_PUBLIC_STATIC_IMG_FOLDER = 'http://localhost:3000/img'
    // let V_KUARSIS_PUBLIC_STATIC_MODELS_FOLDER = 'http://localhost:3000/models'
    V_KUARSIS_BANNER_MAIN_LOGO = "/ArtPixanLogo256px.png";
    V_KUARSIS_PUBLIC_BUCKET_URL =
      "https://kuarsis-products-s3-public-dev.s3.amazonaws.com/";
    break;
  case ONCARE_LOCAL:
    //CONSTANTS FOR LOCAL DEVELOPMENT ENVIRONMENT
    V_LOG_LEVEL = local_debug_level;
    V_CURRENT_VERSION = `v1.0.0.11-2023-11-15-23:50`;
    V_BACKEND_ENDPOINT = "http://localhost:5000";
    V_KUARSIS_PUBLIC_STATIC_FOLDER = "http://localhost:3000/images";
    // let V_KUARSIS_PUBLIC_STATIC_IMG_FOLDER = 'http://localhost:3000/img'
    // let V_KUARSIS_PUBLIC_STATIC_MODELS_FOLDER = 'http://localhost:3000/models'
    V_KUARSIS_BANNER_MAIN_LOGO = "/OnCareLogo256px.png";
    V_KUARSIS_PUBLIC_BUCKET_URL =
      "https://kuarsis-products-s3-public-dev.s3.amazonaws.com/";
    break;
  case ARTPIXANDEV:
    //CONSTANTS FOR ARTPIXANDEV.KUARXIS.COM (DEV) ENVIRONMENT

    V_LOG_LEVEL = artpixandev_debug_level;
    V_CURRENT_VERSION = `v1.0.0.7-2023-08-29-20:22`;
    V_BACKEND_ENDPOINT =
      "https://o3dzma966j.execute-api.us-east-1.amazonaws.com/kuarxbedev";
    V_KUARSIS_PUBLIC_STATIC_FOLDER = "https://artpixandev.kuarxis.com/images";
    V_KUARSIS_BANNER_MAIN_LOGO = "ArtPixanLogo256px.png";
    V_KUARSIS_PUBLIC_BUCKET_URL =
      "https://kuarsis-products-s3-public-dev.s3.amazonaws.com/";
    break;
  case ONCARE_DEV:
    //CONSTANTS FOR ARTPIXANDEV.KUARXIS.COM (DEV) ENVIRONMENT

    V_LOG_LEVEL = artpixandev_debug_level;
    V_CURRENT_VERSION = `v1.0.0.11-2023-11-15-23:50`;
    V_BACKEND_ENDPOINT =
      "https://liklebz726.execute-api.us-east-1.amazonaws.com/oncrebedev";
    V_KUARSIS_PUBLIC_STATIC_FOLDER = "https://oncaredev.kuarxis.com/images";
    V_KUARSIS_BANNER_MAIN_LOGO = "OnCareLogo256px.png";
    V_KUARSIS_PUBLIC_BUCKET_URL =
      "https://kuarsis-products-s3-public-dev.s3.amazonaws.com/";
    break;
  case ARTPIXANPROD:
    //CONSTANTS FOR ARTPIXAN.KUARXIS.COM (PROD) ENVIRONMENT

    V_LOG_LEVEL = artpixanprod_debug_level;
    V_BACKEND_ENDPOINT =
      "https://we568vitke.execute-api.us-east-1.amazonaws.com/kuarxbeprd";
    V_KUARSIS_PUBLIC_STATIC_FOLDER = "https://artpixan.kuarxis.com/images";
    V_KUARSIS_BANNER_MAIN_LOGO = "ArtPixanLogo256px.png";
    V_KUARSIS_PUBLIC_BUCKET_URL =
      "https://kuarsis-products-s3-public.s3.amazonaws.com";
    break;
  default:
    break;
}

export const LOG_LEVEL = V_LOG_LEVEL;
export const CURRENT_VERSION = V_CURRENT_VERSION;
export const BACKEND_ENDPOINT = V_BACKEND_ENDPOINT;
export const KUARSIS_PUBLIC_STATIC_FOLDER = V_KUARSIS_PUBLIC_STATIC_FOLDER;
// const KUARSIS_PUBLIC_STATIC_IMG_FOLDER = V_KUARSIS_PUBLIC_STATIC_IMG_FOLDER
// const KUARSIS_PUBLIC_STATIC_MODELS_FOLDER = V_KUARSIS_PUBLIC_STATIC_MODELS_FOLDER
export const KUARSIS_BANNER_MAIN_LOGO = V_KUARSIS_BANNER_MAIN_LOGO;
export const KUARSIS_PUBLIC_BUCKET_URL = V_KUARSIS_PUBLIC_BUCKET_URL;
