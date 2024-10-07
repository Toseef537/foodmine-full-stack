const BASE_URL = "https://foodmine-backend-nodejs.vercel.app";
export const FOODS_URL = BASE_URL + "/api/foods";
export const ADD_FOOD_URL = FOODS_URL + "/add-food";
export const FOODS_TAGS_URL = FOODS_URL + "/tags";
export const FOODS_BY_SEARCH_URL = FOODS_URL + "/search/";
export const FOODS_BY_TAG_URL = FOODS_URL + "/tag/";
export const FOODS_BY_ID_URL = FOODS_URL + "/";
export const LOGIN_URL = BASE_URL + "/api/users/login";
export const SIGNUP_URL = BASE_URL + "/api/users/signup";
export const ORDER_URL = BASE_URL + "/api/orders";
export const ORDER_CREATE_URL = ORDER_URL + "/create";
export const ORDER_NEW_FOR_CURRENT_USER_URL = ORDER_URL + '/newOrderForCurrentUser';
export const DELETE_FOOD_URL = FOODS_URL + "/delete";
export const Update_FOOD_URL = FOODS_URL + "/update";
export const GET_ALL_ORDERS_URL = ORDER_URL + "/allOrders";
export const CART_URL="/api/carts";
export const ADD_TO_CART_URL =BASE_URL+CART_URL + "/create";
export const GET_CART_URL =BASE_URL+CART_URL + "/currentUserCart";
export const DELETE_CART_ITEM_URL=BASE_URL+CART_URL+'/deleteFood';














