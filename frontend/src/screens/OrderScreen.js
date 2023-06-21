import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { PayPalButton } from 'react-paypal-button-v2'
import { Link } from 'react-router-dom'
import { Row, Col, ListGroup, Image, Card } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import {LogThis} from '../libs/Logger'
import {addDecimals} from '../libs/Functions'

import {
  createOrder,
} from '../actions/orderActions'

import { getUserDetails} from '../actions/userActions'

import {
  BACKEND_ENDPOINT,
  KUARSIS_PUBLIC_BUCKET_URL,
} from '../constants/enviromentConstants'

import { CART_RESET } from '../constants/cartConstants'



const OrderScreen = ({ history }) => {
  const [isShippable, setisShippable] = useState(false)

  const [address, setaddress] = useState('')
  const [internalNumber, setinternalNumber] = useState('')
  const [city, setcity] = useState('')
  const [state, setstate] = useState('')
  const [postalCode, setpostalCode] = useState('')
  const [country, setcountry] = useState('')
  const [itemsPrice, setitemsPrice] = useState(0.0)
  const [taxPrice, settaxPrice] = useState(0.0)
  const [totalPrice, settotalPrice] = useState(0.0)
  const [payPalLoading, setpayPalLoading] = useState(false)
  const [sdkReady, setSdkReady] = useState(false)
  
  const dispatch = useDispatch()

  const userDetails = useSelector((state) => state.userDetails)
  const { user, loading : userDetailsLoading, error: userDetailsError } = userDetails
 
  const cart = useSelector((state) => state.cart)

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const orderCreate = useSelector((state) => state.orderCreate)
  const { order, success: orderSuccess, error:orderCreateError } = orderCreate
  
  const addPayPalScript = async () => {
    try{
        LogThis(`OrderScreen, addPayPalScript: started`)
        setpayPalLoading(true)
        const { data: clientId } = await axios.get(
          BACKEND_ENDPOINT + '/config/paypal'
        )
        LogThis(`OrderScreen, addPayPalScript: clientId=${clientId}`)
        const script = document.createElement('script')
        script.type = 'text/javascript'
        script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`
        script.async = true
        script.onload = () => { 
          LogThis(`OrderScreen, addPayPalScript: onload calling setSdkReady`)
          setSdkReady(true)
          setpayPalLoading(false)
          LogThis(`OrderScreen, addPayPalScript: onload called setSdkReady, sdkReady=${sdkReady}, payPalLoading=${payPalLoading}`)
        }
        LogThis(`OrderScreen, addPayPalScript: before appendChild, sdkReady=${sdkReady}, payPalLoading=${payPalLoading}`)
        document.body.appendChild(script)
        LogThis(`OrderScreen, addPayPalScript, after appendChild: sdkReady=${sdkReady}, payPalLoading=${payPalLoading}`)
        LogThis(`OrderScreen, addPayPalScript, ended: payPalLoading=${payPalLoading}`)
    } catch (ex){
      LogThis(`OrderScreen, addPayPalScript, ended with exception: ex.message = ${ex.Message}`)
    }
  }
  useEffect(() => {
    if (!userInfo) {
      LogThis(`OrderScreen, useEffect: pushing loging because userInfo is null or undefined, ${JSON.stringify(userInfo)}`)
      history.push('/login')
    }
    
    if (!userDetailsLoading){ 
      if(!user || !user.name) {
          LogThis(`OrderScreen, useEffect,  getUserDetails('profile'): dispatching`)
          dispatch(getUserDetails('profile'))
          LogThis(`OrderScreen, useEffect,  getUserDetails('profile'): dispatched`)
      }
      else{
        setaddress(user.address)
        setinternalNumber(user.internalNumber)
        setcity(user.city)
        setstate(user.state)
        setpostalCode(user.postalCode)
        setcountry(user.country)
        LogThis(`OrderScreen, useEffect, setting user details, userDetailsLoading=${userDetailsLoading}; user=${JSON.stringify(user)}`)
      }
  }
// eslint-disable-next-line
  }, [
    dispatch,
    history,
    userInfo,
    userDetailsLoading,
    user,
    /*userDetailsError,
    orderCreateError,
    payPalLoading,
    sdkReady, 
    order,
    orderSuccess,*/
  ])

 useEffect(() => {
    if(order&&orderSuccess)
    {
      dispatch({type: CART_RESET})
      history.push(`/orderdetail/${order._id}`)
    }     
// eslint-disable-next-line
  }, [
    dispatch,
    order,
    orderSuccess,
  ])

  useEffect(() => {
  let _itemsPrice = 0
  let _taxPrice = 0
  let _totalPrice = 0

    if(cart??false)
    {
       if(cart.cartItems??false){
        LogThis(`OrderScreen, UseEffect, Calculating Summary: cart.cartItems=${JSON.stringify(cart.cartItems)}`)
        _itemsPrice = addDecimals(cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0))
        _taxPrice = addDecimals(Number((0.07 * _itemsPrice).toFixed(2)))
         _totalPrice = (Number(_itemsPrice) + Number(_taxPrice)).toFixed(2)
         LogThis(`OrderScreen, UseEffect, Calculating local summary: _itemsPrice=${_itemsPrice}, _taxPrice=${_taxPrice}, _totalPrice=${_totalPrice}`)
         setitemsPrice(_itemsPrice)
         settaxPrice(_taxPrice)
         settotalPrice(_totalPrice)
         LogThis(`OrderScreen, UseEffect, Calculating global summary: itemsPrice=${itemsPrice}, taxPrice=${taxPrice}, totalPrice=${totalPrice}`)
         LogThis(`OrderScreen, UseEffect, Before cartItems.find: isShippable=${isShippable}`)
         let shippableItemIs=cart.cartItems.find(x => x.isShippable === true)
         setisShippable( (shippableItemIs?? false)? true: false)
         LogThis(`OrderScreen, UseEffect, After cartItems.find: isShippable=${isShippable}; shippableItemIs=${JSON.stringify(shippableItemIs)}`)
         
       }
       else {
        setisShippable(false);
        LogThis(`OrderScreen, UseEffect, Cart is undefined: isShippable=${isShippable}`)
        setitemsPrice(0)
        settaxPrice(0)
        settotalPrice(0)
        LogThis(`OrderScreen, UseEffect, Cart is undefined: itemsPrice=${itemsPrice}, taxPrice=${taxPrice}, totalPrice=${totalPrice}`)
       }
     }    
// eslint-disable-next-line
  }, [
  ])
  
  useEffect(() => {
   if (!payPalLoading&&!sdkReady) {
      //LogThis(`OrderScreen, useEffect, checking windows paypal: window.paypal=${window.paypal??'not found'}`)
      
      if (!window.paypal) {
     LogThis(`OrderScreen, useEffect, before invoking addPayPalScript: payPalLoading=${payPalLoading}, sdkReady=${sdkReady}, !window.paypal=${!window.paypal}`)
      addPayPalScript()
      LogThis(`OrderScreen, useEffect, after invoking addPayPalScript: payPalLoading=${payPalLoading}, sdkReady=${sdkReady}, !window.paypal=${!window.paypal}`)
      }
      else {
      LogThis(`OrderScreen, useEffect, window.paypal exists, setting payPayPalLoading to false and sdkReady to true: payPalLoading=${payPalLoading}, sdkReady=${sdkReady}, !window.paypal=${!window.paypal}`)
      setpayPalLoading(false)
      setSdkReady(true)
      }
    }
    else if(payPalLoading&&!sdkReady){
      LogThis(`OrderScreen, useEffect, payPalScript is still loading: payPalLoading=${payPalLoading}, sdkReady=${sdkReady}, !window.paypal=${!window.paypal}`)
    }
    else if(!payPalLoading&&sdkReady){
      LogThis(`OrderScreen, useEffect, payPalScript finished loading: payPalLoading=${payPalLoading}, sdkReady=${sdkReady}, !window.paypal=${!window.paypal}`)
    }
    else{
      LogThis(`OrderScreen, useEffect, sdkReady updated, but loading still going: payPalLoading=${payPalLoading}, sdkReady=${sdkReady}, !window.paypal=${!window.paypal}`)
    }
  // eslint-disable-next-line
    }, [payPalLoading,sdkReady])

  const successPaymentHandler = (paymentResult) => {
    dispatch(
      createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: taxPrice,
        totalPrice: totalPrice,
        orderPaymentResult: paymentResult
      })
    )
  }
  LogThis(`OrderScreen, Rendering, Before Start: userDetailsLoading=${userDetailsLoading}, userDetailsError=${userDetailsError??'undefined'}, orderCreateError=${orderCreateError}, user=${JSON.stringify(user??'undefined')}, sdkReady=${sdkReady??'undefined'}, cart=${JSON.stringify(cart??'undefined')}`)
  return userDetailsLoading??true ? (
    <Loader />
  ) : (orderCreateError||userDetailsError) ? (
    <Message variant='danger'>{(userDetailsError??'No user Error') + ' ' + (orderCreateError??'No Order Error') }</Message>
  ) : (
    <>
    {LogThis(`OrderScreen, Rendering, Started: userDetailsLoading=${userDetailsLoading}, userDetailsError=${userDetailsError??'undefined'}, orderCreateError=${orderCreateError}, user=${JSON.stringify(user??'undefined')}, sdkReady=${sdkReady??'undefined'}, cart=${JSON.stringify(cart??'undefined')}`)}
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
              {LogThis(`OrderScreen, Rendering, Displaying Shippable: isShippable=${isShippable}`)}
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
                        {LogThis(`OrderScreen, Rendering, Displaying Image: item.image=${item.image??'undefined'}`)}
                          <Image
                            src={KUARSIS_PUBLIC_BUCKET_URL + item.image}
                            alt={item.name}
                            rounded
                            fluid
                          />
                        </Col>
                        <Col>
                          <Link to={`/productdetail/${item.product}`}>
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
              {LogThis(`OrderScreen, Rendering, Displaying Order Summary: itemsPrice=${itemsPrice}, taxPrice=${taxPrice}, totalPrice=${totalPrice}`)}
              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>$ {itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>$ {taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>$ {totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              {LogThis(`OrderScreen, Rendering, PayPalButton, !orderSuccess=${!orderSuccess}, sdkReady=${sdkReady}`)}
                <ListGroup.Item>
                  {!sdkReady ? ( 
                    <Loader />
                  ) : (
                    <PayPalButton
                      amount={totalPrice}
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
