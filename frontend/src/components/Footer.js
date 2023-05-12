import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'

const Footer = () => {
  return (
    <footer id='main-footer'>
      <Container>
        <Row>
          <Col className='text-center py-3'>
            &copy; 2022 Kuarsis Companies. All rights reserved. <br />
            Pixan is a Kuarsis Company. <br />
            This webpage is under construction, please don't use real credit
            cards or real paypal accounts.
          </Col>
        </Row>
      </Container>
    </footer>
  )
}

export default Footer
