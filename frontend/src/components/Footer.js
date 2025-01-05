import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'

const Footer = () => {
  return (
    <footer id='main-footer'>
      <Container>
        <Row>
          <Col className='text-center py-3'>
            &copy; 2025 Kuarxis Companies. All rights reserved. <br />
            This webpage is a prototype in development, please don't use real credit
            cards or real paypal accounts.
          </Col>
        </Row>
      </Container>
    </footer>
  )
}

export default Footer
