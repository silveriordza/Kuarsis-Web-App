import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { PayPalButton } from 'react-paypal-button-v2'
import { Link } from 'react-router-dom'
import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import {LogThis} from '../libs/Logger'

import {
  getOrderDetails,
  payOrder,
  deliverOrder,
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

import { CART_RESET } from '../constants/cartConstants'

const OrderScreen = ({ match, history }) => {
  const orderId = match.params.id
  
  const [isShippable, seisShippable] = useState(false)

  let isDownloadable = false;
  let isBookable = false;

  const [address, setaddress] = useState('')
  const [internalNumber, setinternalNumber] = useState('')
  const [city, setcity] = useState('')
  const [state, setstate] = useState('')
  const [postalCode, setpostalCode] = useState('')
  const [country, setcountry] = useState('')

  const [sdkReady, setSdkReady] = useState(false)

  const dispatch = useDispatch()

  const userDetails = useSelector((state) => state.userDetails)
  const { user, success : usersuccess } = userDetails

  const orderDetails = useSelector((state) => state.orderDetails)
  const { order, loading, error } = orderDetails

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const orderPay = useSelector((state) => state.orderPay)
  const { loading: loadingPay, success: successPay } = orderPay

  const orderDeliver = useSelector((state) => state.orderDeliver)
  const { loading: loadingDeliver, success: successDeliver } = orderDeliver

  const orderDeliverDownloadURL = useSelector(
    (state) => state.orderDeliverDownloadURL
  )
  const { success: downloadSuccess, productSignedURL: eProductSignedURL } =
    orderDeliverDownloadURL

  if (!loading) {
    const addDecimals = (num) => {
      return (Math.round(num * 100) / 100).toFixed(2)
    }
    // Calculate prices
    order.itemsPrice = addDecimals(
      order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0)
    )
  }
  useEffect(() => {
    if (!userInfo) {
      history.push('/login')
    }
    if (!user || !user.name) {
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
    const addPayPalScript = async () => {
      const { data: clientId } = await axios.get(
        BACKEND_ENDPOINT + '/config/paypal'
      )
      console.log('PayPal Client Id: ', clientId)
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`
      script.async = true
      script.onload = () => {
        setSdkReady(true)
      }
      document.body.appendChild(script)
    }

    if (!order || successPay || successDeliver || order._id !== orderId) {
      dispatch({ type: ORDER_PAY_RESET })
      dispatch({ type: ORDER_DELIVER_RESET })

      dispatch(getOrderDetails(orderId))
    } else if (!order.isPaid) {
      if (!window.paypal) {
        addPayPalScript()
      } else {
        setSdkReady(true)
      }
    }
    if (downloadSuccess) {
      const link = document.createElement('a')
      link.href = eProductSignedURL
      link.setAttribute('download', 'file.jpg')
      document.body.appendChild(link)
      link.click()
      link.remove()
      dispatch({ type: ORDER_DELIVER_DOWNLOAD_RESET })
    }
    //Checking if at least one of the products in the order is shippable.
    /*
    isShippable = order ? ((order.orderItems.find((item) => {item.isShippable==true}) === undefined) ? false : true ): false
    */
    if(order && order.orderItems){
      LogThis(`OrderScreen, UseEffect, Before orderItems.find: isShippable=${isShippable}; order.orderItems=${JSON.stringify(order.orderItems)}`)
      let shippableItemIs=order.orderItems.find(x => x.isShippable === true)
      seisShippable( (shippableItemIs?? false)? true: false)
      LogThis(`OrderScreen, UseEffect, After orderItems.find: isShippable=${isShippable}; shippableItemIs=${JSON.stringify(shippableItemIs)}`)
      
    }
    else {
      seisShippable(false);
      LogThis(`OrderScreen, UseEffect, isShippable=${isShippable}; order=null`)
    }
  }, [
    dispatch,
    orderId,
    successPay,
    successDeliver,
    order,
    isShippable,
    eProductSignedURL,
    downloadSuccess,
    history,
    userInfo,
    user
  ])

/*   const isOrderShippable = (productsOrdered) => {
    if (productsOrdered !== null)
    return productsOrdered.find(item => item.isShippable == true) ?? false
  } */

  const successPaymentHandler = (paymentResult) => {
    dispatch(payOrder(orderId, paymentResult))
    dispatch({ type: CART_RESET })
  }

  const deliverHandler = () => {
    dispatch(deliverOrder(order))
  }

  const fileDownload = (productIdToDownload) => {
    dispatch(downloadOrderedProduct(productIdToDownload))
    //dispatch(deliverOrder(order))
  }

  const printReceiptHandler = () => {
    window.print()
  }

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant='danger'>{error}</Message>
  ) : (
    <>
      <h1>Order {order._id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>Downloadable products licensed to:</h2>
              <p>
                <strong>Name: </strong>
                {order.user.name}
              </p>
              <p>
                <strong>Email: </strong>
                <a href={`mailto:${order.user.email}`}> {order.user.email}</a>
              </p>
              {LogThis(`OrderScreen, Displaying Shippable: isShippable=${isShippable}`)}
              {isShippable ? (
                 <div>
                  <h2>Shippable products will be delivered at:</h2>
                  <p>{`${address??''}${internalNumber? (' '+ internalNumber) : ''}, ${city??''}, ${state??''}, ${postalCode??''}, ${country??''}`}</p>
                  { order.isDelivered ? (
                                          <Message variant='success'>
                                              Shipped on {order.deliveredAt}
                                          </Message>
                    ) : (
                      <Message variant='danger'>Not Shipped Yet</Message>
                    )
                  }
                 </div>
                 ) : <></>}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method: PayPal</strong>
              </p>
              {order.isPaid ? (
                <Message variant='success'>Paid on {order.paidAt}</Message>
              ) : (
                <Message variant='danger'>Not paid</Message>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Order Items</h2>
              {order.orderItems.length === 0 ? (
                <Message>Order is empty</Message>
              ) : (
                <ListGroup variant='flush'>
                  {order.orderItems.map((item, index) => (
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
                        {order.isPaid ? ( !item.isShippable&&!item.isBookable&&item.isDownloadable?
                                          (
                                              <Col>
                                                <Button
                                                  type='button'
                                                  className='btn-block'
                                                  disabled={!order.isPaid}
                                                  onClick={() => fileDownload(item.product)}
                                                >
                                                  Download
                                                </Button>
                                              </Col>
                                          )
                                          :
                                          ( item.isShippable&&!item.isBookable&&!item.isDownloadable?
                                            (
                                              <Col><strong>{order.isDelivered? 'Shipped' : 'To be shipped'}</strong></Col>
                                            )
                                            :
                                            (!item.isShippable&&item.isBookable&&!item.isDownloadable?
                                              (
                                                <Col><strong>{order.isDelivered? 'Booked' : 'To be booked'}</strong></Col>
                                              )
                                              :
                                              (
                                                <></>
                                              )
                                            )
                                          )
                                        )
                                        :
                                        (
                                          <Col>
                                          </Col>
                                        )
                          }
                                              
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
                  <Col>$ {order.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>$ {order.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>$ {order.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              {order.isPaid && (
                <ListGroup.Item>
                  <Button
                    type='button'
                    className='btn btn-block'
                    onClick={printReceiptHandler}
                  >
                    Print Receipt
                  </Button>
                </ListGroup.Item>
              )}
              {!order.isPaid && (
                <ListGroup.Item>
                  {loadingPay && <Loader />}
                  {!sdkReady ? (
                    <Loader />
                  ) : (
                    <PayPalButton
                      amount={order.totalPrice}
                      onSuccess={successPaymentHandler}
                    />
                  )}
                </ListGroup.Item>
              )}
              {loadingDeliver && <Loader />}
              {userInfo &&
                userInfo.isAdmin &&
                order.isPaid &&
                isShippable && //This false should be replaced by a flag that can be part of the product attributes to configure when a product needs to be physically delivered.
                !order.isDelivered && (
                  <ListGroup.Item>
                    <Button
                      type='button'
                      className='btn btn-block'
                      onClick={deliverHandler}
                    >
                      Mark as Delivered
                    </Button>
                  </ListGroup.Item>
                )}
            </ListGroup>
          </Card>
          {order.isPaid && (
            <Card>
              <ListGroup variant='flush'>
                <ListGroup.Item>
                  Thank you for your purchase! <br />
                  <br />
                  The "Download" button will expire 5 minutes after the
                  purchase, please click it as soon as possible to download your
                  photos.
                </ListGroup.Item>
                <ListGroup.Item>
                  The order number that appears at the top of this screen is
                  your Pixan Photo License number it is proof that you licensed
                  the photo, please keep it for your records.
                </ListGroup.Item>
                <ListGroup.Item>
                  The current page is your receipt, you can print it for your
                  records.
                </ListGroup.Item>
              </ListGroup>
            </Card>
          )}
        </Col>
      </Row>
    </>
  )
}

export default OrderScreen
