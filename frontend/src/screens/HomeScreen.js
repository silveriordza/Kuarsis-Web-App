import React from 'react'
import KuarsisCarousel from '../components/KuarsisCarousel'
import KuarsisMainWithSides from '../components/KuarsisMainWithSides'

const HomeScreen = () => {
  return (
    <section>
      <section>
        <KuarsisCarousel pageToDisplay='Home' />
      </section>
      <section className='mt-2'>
        <KuarsisMainWithSides pageToDisplay='Home' />
      </section>
    </section>
  )
}

export default HomeScreen
