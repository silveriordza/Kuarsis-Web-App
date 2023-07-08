import React, { useState, useEffect, /*useRef*/ } from 'react'
import { Link/*, useNavigate*/ } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, Image, ListGroup, Card, Button, Form } from 'react-bootstrap'
import Message from '../components/Message'
import Loader from '../components/Loader'
import Scheduler from '../components/Scheduler'
import Meta from '../components/Meta'
import { listProductDetails } from '../actions/productActions'
import { KUARSIS_PUBLIC_BUCKET_URL } from '../constants/enviromentConstants'
import { LogThis, initLogSettings} from '../libs/Logger'

const logSettings = initLogSettings('ServiceDetailScreen')

const ServiceDetailScreen = ({ history, match }) => {
  logSettings.sourceFunction = 'ServiceDetailScreen'
  const [qty, setQty] = useState(1)
  const dispatch = useDispatch()
  //const leapToPage = useNavigate();

  const productDetails = useSelector((state) => state.productDetails)
  const { loading, error, product } = productDetails

  const schedulerDetails = useSelector((state) => state.schedulerDetails)
  const { loading: scheduleLoading, /*error: scheduleError,*/ schedule } = schedulerDetails

  useEffect(() => {
    logSettings.sourceFunction = 'useEffect'
    LogThis(logSettings, `dispatching listProductDetails: match.params.id=${match.params.id}`)
    dispatch(listProductDetails(match.params.id))
    LogThis(logSettings, `dispatched listProductDetails: match.params.id=${match.params.id}`)
  }, [dispatch, match])

  // //Adding handler for the Add Cart button here:
  // const addToCartHandler = () => {
  //   history.push(`/cart/${match.params.id}?qty=${qty}`)
  // }

  const bookAppointment = () => {
    //history.push(`/bookappointment/${match.params.id}`)
    logSettings.sourceFunction = 'bookAppointment'
    if(!scheduleLoading&&!error&&schedule)
    {
      LogThis(logSettings, `schedule=${JSON.stringify(schedule)}`)
    }
  }
 
  
  return (
    <>
      <Link className='btn btn-light my-3' onClick={()=>history.go(-1)}>
        Go Back
      </Link>
      {loading && product && (!product.user??true) ? (
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
          {/* <div className='schedulerClass'> 
              <ScheduleComponent id='scheduler' currentView='Day' eventSettings={eventSettings} actionComplete={onActionComplete} actionBegin={onActionBegin} dataBound={onAppointmentListModified}  dragStart={(onDragStart.bind(this))} resizeStart={(onResizeStart.bind(this))} beforeQuickPopupOpen={onBeforeQuickPopupOpen} beforeAppointmentCreate={onbeforeAppointmentCreate}> 
                    <ViewsDirective>
                      <ViewDirective option='Day' interval={7} displayName='3 Days' startHour='08:00' endHour='20:00'></ViewDirective>
                    </ViewsDirective>
                    <Inject services={[Day, DragAndDrop, Resize]} />
              </ScheduleComponent>
          </div> */}
          {/* {console.log(`ServiceDetailScreen, Before rendering Scheduler: ${eventSettingsLocal}`)}
          <Scheduler eventSettingsLocal={eventSettingsLocal}/> */}
          {logSettings.functionName='Render'}
          {LogThis(logSettings, `product=${JSON.stringify(product)}`)}
          <Scheduler providerId={product.user}/>
      </>
      )}
    </>
  )
}

export default ServiceDetailScreen
