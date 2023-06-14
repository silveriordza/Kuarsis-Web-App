import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { PayPalButton } from 'react-paypal-button-v2'
import { Link } from 'react-router-dom'
import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import {LogThis} from '../libs/Logger'
import {addDecimals, addPayPalScript} from '../libs/Functions'

import {
  getOrderDetails,
  payOrder,
  deliverOrder,
  createOrder,
  downloadOrderedProduct,
} from '../actions/orderActions'
import {
  ORDER_PAY_RESET,
  ORDER_DELIVER_RESET,
  ORDER_DELIVER_DOWNLOAD_RESET,
} from '../constants/orderConstants'

import { getUserDetails} from '../actions/userActions'

import {
  BACKEND_ENDPOINT,
  KUARSIS_PUBLIC_BUCKET_URL,
} from '../constants/enviromentConstants'

import { CART_RESET, CART_SET_AS_PAID } from '../constants/cartConstants'



const OrderScreen = ({ history }) => {
  //const orderId = match.params.id
  
  const [isShippable, setisShippable] = useState(false)

  /*
  let isDownloadable = false;
  let isBookable = false;
  */

  const [address, setaddress] = useState('')
  const [internalNumber, setinternalNumber] = useState('')
  const [city, setcity] = useState('')
  const [state, setstate] = useState('')
  const [postalCode, setpostalCode] = useState('')
  const [country, setcountry] = useState('')

  const [sdkReady, setSdkReady] = useState(false)

  const dispatch = useDispatch()

  const userDetails = useSelector((state) => state.userDetails)
  const { user, loading : userLoading } = userDetails

  /*
  const orderDetails = useSelector((state) => state.orderDetails)
  const { order, loading, error } = orderDetails
  */
  
  const cart = useSelector((state) => state.cart)

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  /*
  const orderPay = useSelector((state) => state.orderPay)
  const { loading: loadingPay, success: successPay } = orderPay
  */
  const orderCreate = useSelector((state) => state.orderCreate)
  const { order, success: orderSuccess, error } = orderCreate
  
  /*
  const orderDeliver = useSelector((state) => state.orderDeliver)
  const { loading: loadingDeliver, success: successDeliver } = orderDeliver
  */
  
  /*const orderDeliverDownloadURL = useSelector(
    (state) => state.orderDeliverDownloadURL
  )
  const { success: downloadSuccess, productSignedURL: eProductSignedURL } =
    orderDeliverDownloadURL
  */
  // Calculate prices
  /*cart.itemsPrice = addDecimals(
    cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  )
  cart.taxPrice = addDecimals(Number((0.15 * cart.itemsPrice).toFixed(2)))
  cart.totalPrice = (Number(cart.itemsPrice) + Number(cart.taxPrice)).toFixed(2)*/
  
  const addPayPalScript = async () => {
    LogThis(`OrderScreen, addPayPalScript: started`)
    const { data: clientId } = await axios.get(
      BACKEND_ENDPOINT + '/config/paypal'
    )
    console.log('PayPal Client Id: ', clientId)
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`
    script.async = true
    script.onload = () => {
      LogThis(`OrderScreen, addPayPalScript: onload about to call setSdkReady`)
      setSdkReady(true)
    }
    document.body.appendChild(script)
    LogThis(`OrderScreen, addPayPalScript: ended`)
  }
  

  useEffect(() => {
    if (!userInfo) {
      history.push('/login')
    }
    
    if (!userLoading){ 
      if(!user || !user.name) {
      dispatch(getUserDetails('profile'))
      LogThis(`OrderScreen, requested getUserDetails`)
    }
    else{
      setaddress(user.address)
      setinternalNumber(user.internalNumber)
      setcity(user.city)
      setstate(user.state)
      setpostalCode(user.postalCode)
      setcountry(user.country)
      LogThis(`OrderScreen, else of gotUserDetails: user=${JSON.stringify(user)}`)
    }
  }

    /*
    TODO: Check if this addPayPalScrit function definition can be moved outside of the useEffect, this could be one of the reasons why the paypal buttons are dissapearing.
    */
   

    /*if (!order || successPay || successDeliver || order._id !== orderId) {
      dispatch({ type: ORDER_PAY_RESET })
      dispatch({ type: ORDER_DELIVER_RESET })

      dispatch(getOrderDetails(orderId))
    } else*/
    // Calculate prices
    //dispatch({ type: CART_RESET }) 
    
    if(cart)
    {
       if(cart.cartItems)
       {
         cart.itemsPrice = addDecimals(
           cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
         )
         
         cart.taxPrice = addDecimals(Number((0.07 * cart.itemsPrice).toFixed(2)))
         cart.totalPrice = (Number(cart.itemsPrice) + Number(cart.taxPrice)).toFixed(2)

         LogThis(`OrderScreen, UseEffect, Before cartItems.find: isShippable=${isShippable}; cart.cartItems=${JSON.stringify(cart.cartItems)}`)
         let shippableItemIs=cart.cartItems.find(x => x.isShippable === true)
         setisShippable( (shippableItemIs?? false)? true: false)
         LogThis(`OrderScreen, UseEffect, After cartItems.find: isShippable=${isShippable}; shippableItemIs=${JSON.stringify(shippableItemIs)}`)
       }
       else {
         setisShippable(false);
         LogThis(`OrderScreen, UseEffect, isShippable=${isShippable}; cart.itemsPrice is null or undefined`)
         cart.itemsPrice=0
         cart.taxPrice=0
         cart.totalPrice=0
       }
     }
     if (!window.paypal) {
      LogThis(`OrderScreen, useEffect, checking windows paypal: window.paypal=${window.paypal??'not found'}`)
      addPayPalScript()
    } else {
      setSdkReady(true)
    }

        if(order&&orderSuccess)
        {
          dispatch({type: CART_RESET})
          history.push(`/orderdetail/${order._id}`)
        }

     
     

    // if (downloadSuccess) {
    //   const link = document.createElement('a')
    //   link.href = eProductSignedURL
    //   link.setAttribute('download', 'file.jpg')
    //   document.body.appendChild(link)
    //   link.click()
    //   link.remove()
    //   dispatch({ type: ORDER_DELIVER_DOWNLOAD_RESET })
    // }
  }, [
    dispatch,
    cart,
    orderCreate,
    history,
    userInfo,
    userDetails,
    user,
    sdkReady,
    isShippable
  ])

/*   const isOrderShippable = (productsOrdered) => {
    if (productsOrdered !== null)
    return productsOrdered.find(item => item.isShippable == true) ?? false
  } */

  const successPaymentHandler = (paymentResult) => {
    /*
    dispatch(payOrder(orderId, paymentResult))
    */
    dispatch(
      createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
        orderPaymentResult: paymentResult
      })
    )
   //dispatch({ type: CART_SET_AS_PAID })
  }

  /*const deliverHandler = () => {
    dispatch(deliverOrder(order))
  }*/

  const fileDownload = (productIdToDownload) => {
    dispatch(downloadOrderedProduct(productIdToDownload))
    //dispatch(deliverOrder(order))
  }

  const printReceiptHandler = () => {
    window.print()
  }
/*false ? (
    <Loader />
  ) : error ? (
    <Message variant='danger'>{error}</Message>
  ) : */
  return userLoading ? (
    <Loader />
  ) : error ? (
    <Message variant='danger'>{error}</Message>
  ) : (
    <>
      <h1>Order to be placed for the following:</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>Downloadable products licensed to:</h2>
              <p>
                <strong>Name: </strong>
                {user.name}
              </p>
              <p>
                <strong>Email: </strong>
                <a href={`mailto:${user.email}`}> {user.email}</a>
              </p>
              {LogThis(`OrderScreen, Displaying Shippable: isShippable=${isShippable}`)}
              {isShippable ? (
                 <div>
                  <h2>Shippable products will be delivered at:</h2>
                  <p>{`${address??''}${internalNumber? (' '+ internalNumber) : ''}, ${city??''}, ${state??''}, ${postalCode??''}, ${country??''}`}</p>
                 </div>
                 ) : <></>}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method: PayPal</strong>
              </p>
              {orderSuccess ? (
                <Message variant='success'>This was created and paid</Message>
              ) : (
                <Message variant='danger'>Order not created nor paid yet</Message>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Order Items</h2>
              {cart.cartItems.length === 0 ? (
                <Message>Order is empty</Message>
              ) : (
                <ListGroup variant='flush'>
                  {cart.cartItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={KUARSIS_PUBLIC_BUCKET_URL + item.image}
                            alt={item.name}
                            rounded
                            fluid
                          />
                        </Col>
                        <Col>
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} x $ {item.price} = ${' '}
                          {item.qty * item.price}
                        </Col>                      
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>$ {cart.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>$ {cart.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>$ {cart.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              {LogThis(`OrderScreen, PayPalButton render, !orderSuccess=${!orderSuccess}, sdkReady=${sdkReady}`)}
                <ListGroup.Item>
                  {/*loadingPay && <Loader />*/}
                  {!sdkReady ? (
                    <Loader />
                  ) : (
                    <PayPalButton
                      amount={cart.totalPrice}
                      onSuccess={successPaymentHandler}
                    />
                  )}
                </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default OrderScreen
