import React from 'react'
import { Image } from 'react-bootstrap'

const UnderConstructionScreen = ({ pageFunction }) => {
  return (
    <div style={{ marginTop: '250px' }}>
      <h1>Our team of technology gurus are building this page as we speak!</h1>
      <h4>
        Please come back again to <strong>{pageFunction}</strong>
      </h4>
      <Image src='./images/undraw_engineering_team_u99p.png' rounded />
    </div>
  )
}

export default UnderConstructionScreen
