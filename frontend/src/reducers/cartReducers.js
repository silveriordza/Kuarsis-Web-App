import {
  CART_ADD_ITEM,
  CART_REMOVE_ITEM,
  CART_RESET,
  CART_SAVE_PAYMENT_METHOD,
  CART_SAVE_SHIPPING_ADDRESS,
  CART_SET_AS_PAID
} from '../constants/cartConstants'

import {LogThis} from '../libs/Logger'

export const cartReducer = (
  state = { cartItems: [], shippingAddress: {}, isPaid: false },
  action
) => {
  switch (action.type) {
    case CART_ADD_ITEM:
      const item = action.payload
      const existItem = state.cartItems.find((x) => x.product === item.product)
      if (existItem) {
        return {
          ...state,
          cartItems: state.cartItems.map((x) =>
            x.product === existItem.product ? item : x
          ),
        }
      } else {
        return {
          ...state,
          cartItems: [...state.cartItems, item],
        }
      }
    case CART_REMOVE_ITEM:
      return {
        ...state,
        cartItems: state.cartItems.filter((x) => x.product !== action.payload),
      }
    case CART_SAVE_SHIPPING_ADDRESS:
      return {
        ...state,
        shippingAddress: action.payload,
      }
    case CART_SAVE_PAYMENT_METHOD:
      return {
        ...state,
        paymentMethod: action.payload,
      }
    case CART_SET_AS_PAID:
      return {
        ...state,
        isPaid: true,
      }
    case CART_RESET:
      LogThis(`cartReducer, CART_RESET, resetting cart`)
      return { cartItems: [], shippingAddress: {}, isPaid: false }
    default:
      return state
  }
}