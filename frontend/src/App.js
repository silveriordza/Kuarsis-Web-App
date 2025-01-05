import React from 'react'
import { Container } from 'react-bootstrap'
import Header from './components/Header'
import Footer from './components/Footer'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import HomeScreen from './screens/HomeScreen'
import LoginScreen from './screens/LoginScreen'
import TechScreen from './screens/TechScreen'
import PixanScreen from './screens/PixanScreen'
import TaanahScreen from './screens/TaanahScreen'
// import UnderConstructionScreen from './screens/UnderConstructionScreen'
import RegisterScreen from './screens/RegisterScreen'
import ProfileScreen from './screens/ProfileScreen'
import PixanHomeScreen from './screens/PixanHomeScreen'
import PixanProductScreen from './screens/PixanHomeScreen'
import CartScreen from './screens/CartScreen'
import ShippingScreen from './screens/ShippingScreen'
import PaymentScreen from './screens/PaymentScreen'
import PlaceOrderScreen from './screens/PlaceOrderScreen'
import OrderScreen from './screens/OrderScreen'
import ProductListScreen from './screens/ProductListScreen'
import ProductEditScreen from './screens/ProductEditScreen'

import dotenv from 'dotenv'

//https://dev.d2zqth0d2er18d.amplifyapp.com
const App = () => {
  dotenv.config()
  return (
    <>
      <Router>
        <Route component={Header} />
        <main>
          <Container>
            <Route path='/profile' component={ProfileScreen} />
            <Route path='/sign-up' component={RegisterScreen} exact />
            <Route path='/sign-in' component={LoginScreen} exact />
            <Route path='/kuarxistaanah' component={TaanahScreen} exact />
            <Route path='/kuarxispixan' component={PixanScreen} exact />
            <Route path='/kuarxistech' component={TechScreen} exact />
            <Route
              path='/ArtPixan/page/:pageNumber'
              component={PixanHomeScreen}
              exact
            />
            <Route path='/ArtPixan' component={PixanHomeScreen} exact />
            <Route
              path='/admin/productlist'
              component={ProductListScreen}
              exact
            />
            <Route
              path='/admin/productlist/:pageNumber'
              component={ProductListScreen}
              exact
            />
            <Route
              path='/PixanProductScreen/:id'
              component={PixanProductScreen}
            />

            <Route
              path='/admin/product/:id/edit'
              component={ProductEditScreen}
            />
            <Route path='/cart/:id?' component={CartScreen} />
            <Route path='/order/:id' component={OrderScreen} />
            <Route path='/shipping' component={ShippingScreen} />
            <Route path='/payment' component={PaymentScreen} />
            <Route path='/placeorder' component={PlaceOrderScreen} />
            <Route path='/' component={HomeScreen} exact />
          </Container>
        </main>
        <Footer />
      </Router>
    </>
  )
}

export default App
