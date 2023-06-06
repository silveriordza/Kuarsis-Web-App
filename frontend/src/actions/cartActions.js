import axios from 'axios'
import {
  CART_ADD_ITEM,
  CART_REMOVE_ITEM,
  CART_SAVE_SHIPPING_ADDRESS,
  CART_SAVE_PAYMENT_METHOD,
} from '../constants/cartConstants'
import { BACKEND_ENDPOINT } from '../constants/enviromentConstants'

//We need to get the state inside the addToCart action reason why we have to pass the getState function from the store, as a parameter of the async function of the addToCart.
export const addToCart = (id, qty) => async (dispatch, getState) => {
  const { data } = await axios.get(BACKEND_ENDPOINT + `/products/${id}`)

  //All this information is the one we want to show in the Cart page, we want name, image, price and countInStock that is coming from the axios get call, data.
  dispatch({
    type: CART_ADD_ITEM,
    payload: {
      product: data._id,
      name: data.name,
      image: data.image,
      price: data.price,
      isShippable: data.isShippable,
      isDownloadable: data.isDownloadable,
      isImageProtected: data.isImageProtected,
      isBookable: data.isBookable,
      countInStock: data.countInStock,
      qty,
    },
  })

  //We will add the cart to the local storage. Local storage can only store string data, and the getState will return JSON data, reason why you need to do JSON.stringify.
  //To get the data that was stored in the local Storage, we will do that from the store.js file, in the initialState variable, we can get the initial values from the localStorage there, and pass it to the createStore as usual
  localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))
}

export const removeFromCart = (id) => (dispatch, getState) => {
  dispatch({
    type: CART_REMOVE_ITEM,
    payload: id,
  })

  localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))
}

export const saveShippingAddress = (data) => (dispatch) => {
  dispatch({
    type: CART_SAVE_SHIPPING_ADDRESS,
    payload: data,
  })

  localStorage.setItem('shippingAddress', JSON.stringify(data))
}

export const savePaymentMethod = (data) => (dispatch) => {
  dispatch({
    type: CART_SAVE_PAYMENT_METHOD,
    payload: data,
  })

  localStorage.setItem('paymentMethod', JSON.stringify(data))
}
