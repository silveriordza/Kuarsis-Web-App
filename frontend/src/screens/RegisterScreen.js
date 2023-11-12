/** @format */

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";
import { register } from "../actions/userActions";
import { configsGetAddressStates } from "../actions/configsActions";
import { LogThisLegacy } from "../libs/Logger";

const RegisterScreen = ({ location, history }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [address, setaddress] = useState("");
  const [internalNumber, setinternalNumber] = useState("");
  const [city, setcity] = useState("");
  const [state, setstate] = useState("");
  const [postalCode, setpostalCode] = useState("");
  const [country, setcountry] = useState("");
  const [message, setMessage] = useState(null);
  const dispatch = useDispatch();
  let logSettings = {
    sourceFilename: "RegisterScreen",
    sourceFunction: "Main",
  };

  const userRegister = useSelector((state) => state.userRegister);

  const configsAddressStates = useSelector(
    (state) => state.configsAddressStates
  );
  const {
    loading: addressStatesLoading,
    error: addressStatesError,
    addressStates: localAddressStates,
  } = configsAddressStates;

  const { loading, error, userInfo } = userRegister;

  const redirect = location.search ? location.search.split("=")[1] : "/";

  useEffect(() => {
    if (userInfo) {
      history.push(redirect);
    }
    if (!localAddressStates && !addressStatesLoading && !addressStatesError) {
      dispatch(configsGetAddressStates());
    }
  }, [
    dispatch,
    history,
    userInfo,
    redirect,
    localAddressStates,
    addressStatesLoading,
    addressStatesError,
  ]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
    } else {
      dispatch(
        register(
          name,
          email,
          password,
          address,
          internalNumber,
          city,
          state,
          postalCode,
          country
        )
      );
    }
  };
  LogThisLegacy(
    logSettings,
    `Before Rendering: localAddressStates=${JSON.stringify(
      localAddressStates
    )}, 
  addressStatesLoading=${JSON.stringify(addressStatesLoading)},
  addressStatesError=${JSON.stringify(addressStatesError)}`
  );
  return (
    <FormContainer>
      <h1>Sign Up</h1>
      {message && <Message variant="danger"> {message}</Message>}
      {error && <Message variant="danger">{error}</Message>}
      {loading && <Loader />}
      {(addressStatesLoading ?? true) || !localAddressStates ? (
        <Loader />
      ) : addressStatesError ? (
        <Message variant="danger">{addressStatesError}</Message>
      ) : (
        <>
          {LogThisLegacy(
            logSettings,
            `Rendering started: localAddressStates=${JSON.stringify(
              localAddressStates
            )}, 
  addressStatesLoading=${JSON.stringify(addressStatesLoading)},
      addressStatesError=${JSON.stringify(addressStatesError)}`
          )}
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="email">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="confirmPassword">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="address">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter address"
                value={address}
                onChange={(e) => setaddress(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="internalNumber">
              <Form.Label>Internal Number</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter internal number"
                value={internalNumber}
                onChange={(e) => setinternalNumber(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="city">
              <Form.Label>City</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter city"
                value={city}
                onChange={(e) => setcity(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="state">
              <Form.Label>State</Form.Label>
              <Form.Control
                as="select"
                value={state}
                onChange={(e) => setstate(e.target.value)}
              >
                <option key="-1" value="-1">
                  -- Enter a State --
                </option>
                {/*LogThisLegacy(logSettings, `Rendering, Displaying States, ${JSON.stringify(localAddressStates)}`)*/}
                {localAddressStates[0].value?.map((addressState) => (
                  <option
                    key={addressState.acronym}
                    value={addressState.acronym}
                  >
                    {`${addressState.acronym} - ${addressState.name}`}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="postalCode">
              <Form.Label>Postal code</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter postal code"
                value={postalCode}
                onChange={(e) => setpostalCode(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="country">
              <Form.Label>Country</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter country"
                value={country}
                onChange={(e) => setcountry(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Button type="submit" variant="primary" className="mt-3">
              Register
            </Button>
          </Form>
          <Row className="py-3">
            <Col>
              Have an Account?{" "}
              <Link
                to={redirect ? `/sign-in?redirect=${redirect}` : "/sign-in"}
              >
                Login
              </Link>
            </Col>
          </Row>
        </>
      )}
    </FormContainer>
  );
};

export default RegisterScreen;
