import React from 'react'
import Banner from './Banner'
import BestSellers from './BestSellers'
import Recommended from './Recommended'
import News from './News'

function Home() {
  return (
    <>
      <Banner />
      <BestSellers/>
      <Recommended/>
      <News/>
    </>
  )
}

export default Home