import React, { useState, useEffect } from 'react'
import { Link/*, useNavigate*/ } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, Image, ListGroup, Card, Button, Form } from 'react-bootstrap'
import Message from '../components/Message'
import Loader from '../components/Loader'
import Meta from '../components/Meta'
import { listProductDetails } from '../actions/productActions'
import { KUARSIS_PUBLIC_BUCKET_URL } from '../constants/enviromentConstants'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ToggleButton from 'react-bootstrap/ToggleButton';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';

const PixanProductScreen = ({ history, match }) => {
  const [qty, setQty] = useState(1)
  
  const [hrs, sethrs] = useState('8:00')
  const [selectedDate, setSelectedDate] = useState(null);
  const dispatch = useDispatch()
  //const leapToPage = useNavigate();

  const productDetails = useSelector((state) => state.productDetails)
  const { loading, error, product } = productDetails

  useEffect(() => {
    dispatch(listProductDetails(match.params.id))
  }, [dispatch, match])

  //Adding handler for the Add Cart button here:
  const addToCartHandler = () => {
    history.push(`/cart/${match.params.id}?qty=${qty}`)
  }

  const bookAppointment = () => {
    history.push(`/bookappointment/${match.params.id}`)
  }

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  return (
    <>
      <Link className='btn btn-light my-3' onClick={()=>history.go(-1)}>
        Go Back
      </Link>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <>
          <Meta title={product.name} />
          <Row>
            <Col md={6}>
              <Image
                src={KUARSIS_PUBLIC_BUCKET_URL + product.image}
                alt={product.name}
                fluid
              />
              {/* use fluid to prevent the image going out of its container*/}
            </Col>
            <Col md={3}>
              <ListGroup variant='flush'>
                <ListGroup.Item>
                  <h3>{product.name}</h3>
                </ListGroup.Item>
                <ListGroup.Item>Price: $ {product.price}</ListGroup.Item>
                <ListGroup.Item>
                  Description:
                  <br />
                  {product.description}
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={3}>
              <Card>
                <ListGroup variant='flush'>
                  <ListGroup.Item>
                    <Row>
                      <Col>Price:</Col>
                      <Col>
                        <strong>{product.price}</strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Status:</Col>
                      <Col>
                        {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  {product.countInStock > 0 && (
                    <ListGroup.Item>
                      <Row>
                        <Col>Qty: </Col>
                        <Col>
                          <Form.Control
                            type='number'
                            value={qty}
                            placeholder='1'
                            onChange={(e) => setQty(e.target.value)}
                            disabled={product.isShippable}
                          >
                          </Form.Control>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  )}
                  <ListGroup.Item>
                      <Button
                        onClick={bookAppointment}
                        className='btn-block'
                        type='button'
                      >
                          Book Appointment
                      </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>
          <h1>Service calendar availability:</h1>

      <DatePicker 
        selected={selectedDate}
        onChange={handleDateChange}
        dateFormat="dd/MM/yyyy"
        placeholderText="Select a date"
      />
          <h3>Available hours: 8:00, 9:00, 10:00</h3>
          <Form.Control
              as='select'
              value={hrs}
              placeholder='Pick time'
              onChange={(e) => sethrs(e.target.value)}
            >
               <option key='1' value='8:00' defaultValue={1}>
                    8:00 
              </option>
              <option key='2' value='9:00'>
                    9:00 
              </option>
              <option key='3' value='10:00'>
                    9:00 
              </option>
          </Form.Control>
          <br/>
          <br/>
          <br/>
      <ToggleButtonGroup type="checkbox" defaultValue={[1, 3]} className="mb-2">
          <ToggleButton id="tbg-check-1" value={1} style={{display:'none'}}>
            Checkbox 1 (pre-checked)
          </ToggleButton>
          <ToggleButton id="tbg-check-2" value={2} style={{display:'none'}}>
            Checkbox 2
          </ToggleButton>
          <ToggleButton id="tbg-check-3" value={3} style={{display:'none'}}>
            Checkbox 3 (pre-checked)
          </ToggleButton>
      </ToggleButtonGroup>


        </>
      )}
    </>
  )
}

export default PixanProductScreen
