import React from 'react'
import testImage from "../assets/images/test_image.png"

const LearnLoadingImages = () => {
  return (
    <>
        <h1>Load Images</h1>
        <img src={testImage} alt="Test Image" width={500} />
    </>
  )
}

export default LearnLoadingImages