import React from 'react'
import { Helmet } from 'react-helmet'

const Meta = ({ title, description, keywords }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name='description' content={description} />
      <meta name='keywords' content={keywords} />
    </Helmet>
  )
}

Meta.defaultProps = {
  title: 'Welcome to Pixan',
  keywords:
    'photo, stock, landscapes, bridges, sunsets, sunset, bridge, photos, photography, sunrise, seascapes, astrophotography, images, nature',
  description: 'Pixan is an photo stock online store',
}

export default Meta
