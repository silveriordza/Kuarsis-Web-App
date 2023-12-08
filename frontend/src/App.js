/** @format */

import React from "react";
import { Container } from "react-bootstrap";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { BrowserRouter as Router, Route } from "react-router-dom";
import LoginScreen from "./screens/LoginScreen";
import BusinessInformationScreen from "./screens/BusinessInformationScreen";
// import UnderConstructionScreen from './screens/UnderConstructionScreen'
import RegisterScreen from "./screens/RegisterScreen";
import ProfileScreen from "./screens/ProfileScreen";
import ProductsStoreScreen from "./screens/ProductsStoreScreen";
import ProductDetailScreen from "./screens/ProductDetailScreen";
import ServiceDetailScreen from "./screens/ServiceDetailScreen";
import CartScreen from "./screens/CartScreen";
import ShippingScreen from "./screens/ShippingScreen";
import PaymentScreen from "./screens/PaymentScreen";
import OrderScreen from "./screens/OrderScreen";
import OrderDetailScreen from "./screens/OrderDetailScreen";
import ProductListAdminScreen from "./screens/ProductListAdminScreen";
import ProductEditScreen from "./screens/ProductEditScreen";
import UserListScreen from "./screens/UserListScreen";
import UserEditScreen from "./screens/UserEditScreen";
import OrderListScreen from "./screens/OrderListScreen";
import UploadSurveyAnswers from "./screens/UploadSurveyAnswers";
import SurveysOutputData from "./screens/SurveysOutputData";

import dotenv from "dotenv";
import Show3DScreen from "./screens/Show3DScreen";

//https://dev.d2zqth0d2er18d.amplifyapp.com
const App = () => {
  dotenv.config();
  return (
    <>
      <Router>
        <Route component={Header} />
        <main>
          <Container>
            <Route path="/profile" component={ProfileScreen} />
            <Route path="/show3d" component={Show3DScreen} />
            <Route path="/sign-up" component={RegisterScreen} exact />
            <Route path="/sign-in" component={LoginScreen} exact />
            <Route path="/admin/userlist" component={UserListScreen} />
            <Route path="/admin/user/:id/edit" component={UserEditScreen} />
            <Route
              path="/businessinformation"
              component={BusinessInformationScreen}
              exact
            />
            <Route
              path="/productsstore/page/:pageNumber"
              component={ProductsStoreScreen}
              exact
            />
            <Route
              path="/productsstore"
              component={ProductsStoreScreen}
              exact
            />
            <Route
              path="/admin/productlistadmin"
              component={ProductListAdminScreen}
              exact
            />
            <Route
              path="/admin/productlistadmin/:pageNumber"
              component={ProductListAdminScreen}
              exact
            />
            <Route path="/productdetail/:id" component={ProductDetailScreen} />
            <Route path="/servicedetail/:id" component={ServiceDetailScreen} />
            <Route
              path="/admin/product/:id/edit"
              component={ProductEditScreen}
            />
            <Route path="/admin/orderlist" component={OrderListScreen} />
            <Route
              path="/admin/uploadsurveyanswers"
              component={UploadSurveyAnswers}
            />
            <Route path="/admin/surveyoutput" component={SurveysOutputData} />

            <Route path="/cart/:id?" component={CartScreen} />
            {/* <Route path='/bookappointment/:id' component={BookAppointmentScreen} /> */}
            <Route path="/order" component={OrderScreen} />
            <Route path="/orderdetail/:id" component={OrderDetailScreen} />
            <Route path="/shipping" component={ShippingScreen} />
            <Route path="/payment" component={PaymentScreen} />
            <Route path="/" component={BusinessInformationScreen} exact />
          </Container>
        </main>
        <Footer />
      </Router>
    </>
  );
};

export default App;
