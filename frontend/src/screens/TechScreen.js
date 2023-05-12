import React from 'react'
import KuarsisCarousel from '../components/KuarsisCarousel'
import KuarsisMainWithSides from '../components/KuarsisMainWithSides'

const TechScreen = () => {
  return (
    <section>
      <section>
        <KuarsisCarousel pageToDisplay='Kuarsis-Tech' />
      </section>
      <section className='mt-2'>
        <KuarsisMainWithSides pageToDisplay='Kuarsis-Tech' />
      </section>
    </section>
  )
}

export default TechScreen
