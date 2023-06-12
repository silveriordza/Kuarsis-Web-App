import axios from 'axios'
import {
  ORDER_CREATE_REQUEST,
  ORDER_CREATE_SUCCESS,
  ORDER_CREATE_FAIL,
  ORDER_CREATE_PAID,
  ORDER_DETAILS_REQUEST,
  ORDER_DETAILS_SUCCESS,
  ORDER_DETAILS_FAIL,
  ORDER_PAY_REQUEST,
  ORDER_PAY_SUCCESS,
  ORDER_PAY_FAIL,
  ORDER_LIST_MY_REQUEST,
  ORDER_LIST_MY_SUCCESS,
  ORDER_LIST_MY_FAIL,
  ORDER_LIST_SUCCESS,
  ORDER_LIST_REQUEST,
  ORDER_LIST_FAIL,
  ORDER_DELIVER_REQUEST,
  ORDER_DELIVER_SUCCESS,
  ORDER_DELIVER_FAIL,
  ORDER_DELIVER_DOWNLOAD_REQUEST,
  ORDER_DELIVER_DOWNLOAD_SUCCESS,
  ORDER_DELIVER_DOWNLOAD_FAIL,
} from '../constants/orderConstants'

import { BACKEND_ENDPOINT } from '../constants/enviromentConstants'

import {LogThis} from '../libs/Logger'

export const createOrder = (order) => async (dispatch, getState) => {
  try {
    dispatch({
      type: ORDER_CREATE_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    console.log('createOrder env variable:', BACKEND_ENDPOINT)
    console.log('createOrder env variable:', BACKEND_ENDPOINT + '/orders')
    const { data } = await axios.post(
      BACKEND_ENDPOINT + '/orders',
      order,
      config
    )

    dispatch({
      type: ORDER_CREATE_SUCCESS,
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: ORDER_CREATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

export const getOrderDetails = (id) => async (dispatch, getState) => {
  try {
    console.log('Entrando a getOrderDetails')
    dispatch({
      type: ORDER_DETAILS_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const { data } = await axios.get(BACKEND_ENDPOINT + `/orders/${id}`, config)

    dispatch({
      type: ORDER_DETAILS_SUCCESS,
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: ORDER_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

export const payOrder =
  (orderId, paymentResult) => async (dispatch, getState) => {
    try {
      dispatch({
        type: ORDER_PAY_REQUEST,
      })

      const {
        userLogin: { userInfo },
      } = getState()

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      }
      const { data } = await axios.put(
        BACKEND_ENDPOINT + `/orders/${orderId}/pay`,
        paymentResult,
        config
      )
      dispatch({
        type: ORDER_PAY_SUCCESS,
        payload: data,
      })

      dispatch({ type: ORDER_CREATE_PAID })
    } catch (error) {
      dispatch({
        type: ORDER_PAY_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      })
    }
  }

export const deliverOrder = (order) => async (dispatch, getState) => {
  try {
    dispatch({
      type: ORDER_DELIVER_REQUEST,
    })
    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }
    const { data } = await axios.put(
      BACKEND_ENDPOINT + `/orders/${order._id}/delivered`,
      {},
      config
    )

    dispatch({
      type: ORDER_DELIVER_SUCCESS,
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: ORDER_DELIVER_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

export const listMyOrders = () => async (dispatch, getState) => {
  try {
    
    LogThis(`orderActions, listMyOrders: entering`)
    dispatch({
      type: ORDER_LIST_MY_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    }
    LogThis(`orderActions, listMyOrders: userLogin=${JSON.stringify(userInfo??'undefined')}`)
    const { data } = await axios.get(
      BACKEND_ENDPOINT + `/orders/myorders`,
      config
    )
    LogThis(`orderActions, listMyOrders: data=${JSON.stringify(data??'underfined')}`)
    dispatch({
      type: ORDER_LIST_MY_SUCCESS,
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: ORDER_LIST_MY_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

export const listOrders = () => async (dispatch, getState) => {
  try {
    console.log('Intro listOrders')
    dispatch({
      type: ORDER_LIST_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    }
    const { data } = await axios.get(BACKEND_ENDPOINT +  `/orders`, config)

    dispatch({
      type: ORDER_LIST_SUCCESS,
      payload: data,
    })
    console.log('Outro listOrders data=', data)
  } catch (error) {
    dispatch({
      type: ORDER_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

export const downloadOrderedProduct =
  (productIdToDownload) => async (dispatch, getState) => {
    try {
      console.log('START downloadOrderedProduct 1111111')
      dispatch({
        type: ORDER_DELIVER_DOWNLOAD_REQUEST,
      })
      const {
        userLogin: { userInfo },
      } = getState()

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      }

      console.log('Before axios downloadOrderedProduct')
      const data = await axios.get(
        BACKEND_ENDPOINT +
          `/orders/downloadOrderedProduct/${productIdToDownload}`,
        config
      )
      console.log('orderActions data: ', data)
      dispatch({
        type: ORDER_DELIVER_DOWNLOAD_SUCCESS,
        payload: data.data,
      })
    } catch (error) {
      dispatch({
        type: ORDER_DELIVER_DOWNLOAD_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      })
    }
    console.log('END doawnloadOrderedProduct')
  }
