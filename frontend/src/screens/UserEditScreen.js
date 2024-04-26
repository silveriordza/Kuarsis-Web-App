/** @format */

import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import { getUserDetails, updateUser } from '../actions/userActions'
import { USER_UPDATE_RESET } from '../constants/userConstants'

const UserEditScreen = ({ match, history }) => {
   const userId = match.params.id

   const [name, setName] = useState('')
   const [email, setEmail] = useState('')
   const [isAdmin, setIsAdmin] = useState(false)
   const [hasSurveyOutputAccess, sethasSurveyOutputAccess] = useState(false)

   const [address, setaddress] = useState('')
   const [internalNumber, setinternalNumber] = useState('')
   const [city, setcity] = useState('')
   const [state, setstate] = useState('')
   const [postalCode, setpostalCode] = useState('')
   const [country, setcountry] = useState('')

   const dispatch = useDispatch()

   const userDetails = useSelector(state => state.userDetails)
   const { loading, error, user } = userDetails

   const userUpdate = useSelector(state => state.userUpdate)
   const {
      loading: loadingUpdate,
      error: errorUpdate,
      success: successUpdate,
   } = userUpdate

   useEffect(() => {
      if (successUpdate) {
         dispatch({ type: USER_UPDATE_RESET })
         history.push('/admin/userlist')
      } else {
         if (!user || !user.name || user._id !== userId) {
            dispatch(getUserDetails(userId))
         } else {
            setName(user.name)
            setEmail(user.email)
            setIsAdmin(user.isAdmin)
            sethasSurveyOutputAccess(user.hasSurveyOutputAccess)
            setaddress(user.address)
            setinternalNumber(user.internalNumber)
            setcity(user.city)
            setstate(user.state)
            setpostalCode(user.postalCode)
            setcountry(user.country)
         }
      }
   }, [dispatch, history, user, userId, successUpdate])

   const submitHandler = e => {
      e.preventDefault()
      dispatch(
         updateUser({
            _id: userId,
            name,
            email,
            isAdmin,
            hasSurveyOutputAccess,
            address,
            internalNumber,
            city,
            state,
            postalCode,
            country,
         }),
      )
   }

   return (
      <>
         <Link to="/admin/userlist" className="btn btn-light my-3">
            Go Back
         </Link>
         <FormContainer>
            <h1>Edit User</h1>
            {loadingUpdate && <Loader />}
            {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}
            {loading ? (
               <Loader />
            ) : error ? (
               <Message variant="danger">{error}</Message>
            ) : (
               <Form onSubmit={submitHandler}>
                  <Form.Group controlId="name">
                     <Form.Label>Name</Form.Label>
                     <Form.Control
                        type="name"
                        placeholder="Enter name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                     ></Form.Control>
                  </Form.Group>
                  <Form.Group controlId="email" className="mt-3">
                     <Form.Label>Email Address</Form.Label>
                     <Form.Control
                        type="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                     ></Form.Control>
                  </Form.Group>
                  <Form.Group controlId="isadmin" className="mt-3">
                     <Form.Check
                        type="checkbox"
                        label="Is Admin"
                        checked={isAdmin}
                        onChange={e => setIsAdmin(e.target.checked)}
                     ></Form.Check>
                  </Form.Group>
                  <Form.Group
                     controlId="hasSurveyOutputAccess"
                     className="mt-3"
                  >
                     <Form.Check
                        type="checkbox"
                        label="Has Surveys Access"
                        checked={hasSurveyOutputAccess}
                        onChange={e =>
                           sethasSurveyOutputAccess(e.target.checked)
                        }
                     ></Form.Check>
                  </Form.Group>
                  <Form.Group controlId="address">
                     <Form.Label>Address</Form.Label>
                     <Form.Control
                        type="text"
                        placeholder="Enter address"
                        value={address}
                        onChange={e => setaddress(e.target.value)}
                     ></Form.Control>
                  </Form.Group>
                  <Form.Group controlId="internalNumber">
                     <Form.Label>Internal Number</Form.Label>
                     <Form.Control
                        type="text"
                        placeholder="Enter internal number"
                        value={internalNumber}
                        onChange={e => setinternalNumber(e.target.value)}
                     ></Form.Control>
                  </Form.Group>
                  <Form.Group controlId="city">
                     <Form.Label>City</Form.Label>
                     <Form.Control
                        type="text"
                        placeholder="Enter city"
                        value={city}
                        onChange={e => setcity(e.target.value)}
                     ></Form.Control>
                  </Form.Group>
                  <Form.Group controlId="state">
                     <Form.Label>State</Form.Label>
                     <Form.Control
                        type="text"
                        placeholder="Enter state"
                        value={state}
                        onChange={e => setstate(e.target.value)}
                     ></Form.Control>
                  </Form.Group>
                  <Form.Group controlId="postalCode">
                     <Form.Label>Postal code</Form.Label>
                     <Form.Control
                        type="text"
                        placeholder="Enter postal code"
                        value={postalCode}
                        onChange={e => setpostalCode(e.target.value)}
                     ></Form.Control>
                  </Form.Group>
                  <Form.Group controlId="country">
                     <Form.Label>Country</Form.Label>
                     <Form.Control
                        type="text"
                        placeholder="Enter country"
                        value={country}
                        onChange={e => setcountry(e.target.value)}
                     ></Form.Control>
                  </Form.Group>
                  <Button type="submit" variant="primary" className="mt-3">
                     Update
                  </Button>
               </Form>
            )}
         </FormContainer>
      </>
   )
}

export default UserEditScreen
