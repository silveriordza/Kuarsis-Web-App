import React from 'react'
//With the link you can redirect the page to a new page without refreshing the whole page but only the section where you want the page to appear. If you don't use Link and use a regular <a> tag, when the user clicks on it, it will refresh the whole page to show the page on the link, which is not user friendly.
import { Link } from 'react-router-dom'
import { Card } from 'react-bootstrap'
import { KUARSIS_PUBLIC_BUCKET_URL } from '../constants/enviromentConstants'

const Product = ({ product }) => {
  return (
    <Card
      className='my-3 p-3 rounded'
      style={{ width: '18rem', height: '18rem' }}
    >
      <Link to={`/pixanproductscreen/${product._id}`}>
        <Card.Img
          src={KUARSIS_PUBLIC_BUCKET_URL + product.image}
          variant='top'
          style={{ height: 'auto', width: '100%' }}
        />
      </Link>
      <Card.Body>
        <Link to={`/pixanproductscreen/${product._id}`}>
          <Card.Title as='div'>
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>
        <Card.Text as='h4'>${product.price}</Card.Text>
      </Card.Body>
    </Card>
  )
}

export default Product
