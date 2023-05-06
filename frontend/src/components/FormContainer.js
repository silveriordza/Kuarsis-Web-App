import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'

//This is a From template to create other forms, you can pass the children with all the inputs you need inside the form.
const FormContainer = ({ children }) => {
  return (
    <Container>
      <Row className='justify-content-md-center'>
        <Col xs={12} md={6}>
          {children}
        </Col>
      </Row>
    </Container>
  )
}

export default FormContainer
