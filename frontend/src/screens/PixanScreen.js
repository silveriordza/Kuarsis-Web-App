import React from 'react'
import KuarsisCarousel from '../components/KuarsisCarousel'
import KuarsisMainWithSides from '../components/KuarsisMainWithSides'

const PixanScreen = () => {
  return (
    <section>
      <section>
        <KuarsisCarousel pageToDisplay='Pixan' />
      </section>
      <section className='mt-2'>
        <KuarsisMainWithSides pageToDisplay='Pixan' />
      </section>
    </section>
  )
}

export default PixanScreen
