import React from 'react'
import KuarsisCarousel from '../components/KuarsisCarousel'
import KuarsisMainWithSides from '../components/KuarsisMainWithSides'

const TaanahScreen = () => {
  return (
    <section>
      <section>
        <KuarsisCarousel pageToDisplay='Taanah' />
      </section>
      <section className='mt-2'>
        <KuarsisMainWithSides pageToDisplay='Taanah' />
      </section>
    </section>
  )
}

export default TaanahScreen
