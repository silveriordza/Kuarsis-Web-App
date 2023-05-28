import React from 'react'
import KuarsisCarousel from '../components/KuarsisCarousel'
import KuarsisMainWithSides from '../components/KuarsisMainWithSides'

const BusinessInformationScreen = () => {
  return (
    <section>
      <section>
        <KuarsisCarousel pageToDisplay='ArtPixan' />
      </section>
      <section className='mt-2'>
        <KuarsisMainWithSides pageToDisplay='ArtPixan' />
      </section>
    </section>
  )
}

export default BusinessInformationScreen
