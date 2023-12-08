/** @format */

// We wil combine reducers that will handle functionality by component.
import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import {
  userLoginReducer,
  userRegisterReducer,
  userDetailsReducer,
  userUpdateProfileReducer,
  userListReducer,
  userDeleteReducer,
  userUpdateReducer,
} from "./reducers/userReducers.js";

import {
  productListReducer,
  productDetailsReducer,
  productDeleteReducer,
  productCreateReducer,
  productUpdateReducer,
  productReviewCreateReducer,
  productTopRatedReducer,
} from "./reducers/productReducer.js";

import {
  surveyProcessAnswersReducer,
  surveyDetailsReducer,
  surveyOutputsReducer,
} from "./reducers/surveyReducer.js";

import { cartReducer } from "./reducers/cartReducers";

import { configsAddressStatesReducer } from "./reducers/configsReducer";

import {
  orderCreateReducer,
  orderDetailsReducer,
  orderPayReducer,
  orderDeliverReducer,
  orderListMyReducer,
  orderListReducer,
  orderDeliverDownloadURLReducer,
} from "./reducers/orderReducers";

import {
  schedulerDetailsReducer,
  schedulerUpdateReducer,
} from "./reducers/schedulerReducer.js";

// Any new reducers will be combined here, right now we will add an empty object since we don't have any reducers yet
const reducer = combineReducers({
  //User Reducers
  userLogin: userLoginReducer,
  userRegister: userRegisterReducer,
  userDetails: userDetailsReducer,
  userUpdateProfile: userUpdateProfileReducer,
  userList: userListReducer,
  userDelete: userDeleteReducer,
  userUpdate: userUpdateReducer,
  //Product Reducers
  productList: productListReducer,
  productDetails: productDetailsReducer,
  productDelete: productDeleteReducer,
  productCreate: productCreateReducer,
  productUpdate: productUpdateReducer,
  productReviewCreate: productReviewCreateReducer,
  productTopRated: productTopRatedReducer,
  //Cart Reducer
  cart: cartReducer,
  //Order Reducers
  orderCreate: orderCreateReducer,
  orderDetails: orderDetailsReducer,
  orderPay: orderPayReducer,
  orderListMy: orderListMyReducer,
  orderList: orderListReducer,
  orderDeliver: orderDeliverReducer,
  orderDeliverDownloadURL: orderDeliverDownloadURLReducer,
  configsAddressStates: configsAddressStatesReducer,
  schedulerDetails: schedulerDetailsReducer,
  schedulerUpdate: schedulerUpdateReducer,
  //Survey Reducers
  surveyProcessAnswers: surveyProcessAnswersReducer,
  surveyDetails: surveyDetailsReducer,
  surveyOutputs: surveyOutputsReducer,
});

const userInfoFromStorage = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : null;

// If we want something loaded into the state when the store loads, we can put it in here:
const initialState = {
  userLogin: { userInfo: userInfoFromStorage },
};

// This is the middleware piece, for now we will initialize with thunk
const middleware = [thunk];

//This will create the store with the combined reducers and an initial state.
const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware)) //This parameter allows Redux to connect to the Redux Devtools to see the state in a Chrome browser
);

export default store;
