import React from 'react'
import { Carousel, Image } from 'react-bootstrap'
import { BusinessConfigurations } from '../businessconfigurations'

const KuarsisCarousel = ({ pageToDisplay }) => {
  const carouselSettings = BusinessConfigurations.find(
    (carousel) => carousel.pageName === pageToDisplay
  ).settings.sort((first, second) => {
    return first.priority - second.priority
  })

  return (
    <Carousel pause='hover' fade className='bg-dark carouselCSS'>
      {carouselSettings.map((setting) => (
        <Carousel.Item key={setting.priority}>
          <div style={{ display: 'block', width: '100%' }}>
            <Carousel.Caption>
              <h2>{setting.label}</h2>
              <p>{setting.subLabel}</p>
            </Carousel.Caption>
            <Image
              src={setting.imageSrc}
              alt={setting.alt}
              style={{
                width: setting.width,
                height: setting.height,
                marginLeft: 'auto',
                marginRight: 'auto',
                display: 'block',
              }}
              rounded
              fluid
            />
          </div>
        </Carousel.Item>
      ))}
    </Carousel>
  )
}

export default KuarsisCarousel
