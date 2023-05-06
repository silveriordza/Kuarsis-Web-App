import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import CheckoutSteps from '../components/CheckoutSteps'
import { createOrder } from '../actions/orderActions'
import { KUARSIS_PUBLIC_BUCKET_URL } from '../constants/enviromentConstants'

const PlaceOrderScreen = ({ history }) => {
  const dispatch = useDispatch()
  const cart = useSelector((state) => state.cart)

  const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2)
  }

  // Calculate prices
  cart.itemsPrice = addDecimals(
    cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  )
  cart.taxPrice = addDecimals(Number((0.15 * cart.itemsPrice).toFixed(2)))
  cart.totalPrice = (Number(cart.itemsPrice) + Number(cart.taxPrice)).toFixed(2)

  const orderCreate = useSelector((state) => state.orderCreate)
  const { order, success, error, orderPaid } = orderCreate

  useEffect(() => {
    console.log('orderPaid variable is: ', orderPaid)
    if (success && !orderPaid) {
      console.log('Placing Order: ', order, orderPaid)
      history.push(`/order/${order._id}`)
    }
    // eslint-disable-next-line
  }, [history, orderPaid, success])
  const placeOrderHandler = () => {
    console.log('Creating Order:', cart)
    if (agreeWithLicense) {
      dispatch(
        createOrder({
          orderItems: cart.cartItems,
          shippingAddress: cart.shippingAddress,
          paymentMethod: cart.paymentMethod,
          itemsPrice: cart.itemsPrice,
          shippingPrice: cart.shippingPrice,
          taxPrice: cart.taxPrice,
          totalPrice: cart.totalPrice,
        })
      )
    } else {
      alert(
        'Please agree with the Photo Pixan License before placing the order.'
      )
    }
  }
  var agreeWithLicense = false
  const agreeWithLicenseHandler = () => {
    agreeWithLicense = !agreeWithLicense
  }
  return (
    <>
      <CheckoutSteps step1 step4 />
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>Order Items</h2>
              {cart.cartItems.length === 0 ? (
                <Message>Your cart is empty</Message>
              ) : (
                <ListGroup variant='flush'>
                  {cart.cartItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={KUARSIS_PUBLIC_BUCKET_URL + item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} x ${item.price} = ${item.qty * item.price}
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
                  <Col>${cart.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>${cart.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>${cart.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                {error && <Message variant='danger'>{error}</Message>}
                <Button
                  type='button'
                  className='btn-block'
                  disabled={cart.cartItems === 0}
                  onClick={placeOrderHandler}
                >
                  Place Order
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
          <br />
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h5>Pixan Photo License Agreement:</h5>
                <ListGroup as='ol' numbered variant='flush'>
                  <ListGroup.Item as='li'>
                    After the photos are paid, the download link is valid only
                    for five minutes after which it will expire.
                  </ListGroup.Item>
                  <ListGroup.Item as='li'>
                    Photos which download link has expired, cannot longer be
                    downloaded unless the order is placed again.
                  </ListGroup.Item>
                  <ListGroup.Item as='li'>
                    Purchased photos can be used in websites, digital marketing
                    campaings, printed in physical products, or just for
                    enjoyment.
                  </ListGroup.Item>
                  <ListGroup.Item as='li'>
                    If printed in physical products, no more than 500,000 prints
                    are allowed.
                  </ListGroup.Item>
                  <ListGroup.Item as='li'>
                    Photos cannot be resale without Pixan consent.
                  </ListGroup.Item>
                  <ListGroup.Item as='li'>
                    By clicking the button "Place Order" above, you accept this
                    License Agreement.
                  </ListGroup.Item>
                  <ListGroup.Item as='li'>
                    Photo purchases are not refundable.
                  </ListGroup.Item>
                  <ListGroup.Item as='li'>
                    Customer accepts to pay for the photos using PayPal service
                    as intermediary.
                  </ListGroup.Item>
                  <ListGroup.Item as='li'>
                    Pixan will charge the cost of the photos to the customer's
                    PayPal account on customer behalf.
                  </ListGroup.Item>
                  <ListGroup.Item as='li'>
                    <input
                      type='checkbox'
                      id='AgreeWithLicense'
                      onChange={agreeWithLicenseHandler}
                      style={{ marginRight: 10 }}
                    ></input>
                    <label htmlFor='AgreeWithLicense'>
                      I agree with the License
                    </label>
                  </ListGroup.Item>
                </ListGroup>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default PlaceOrderScreen
