import React from 'react'
import Header from './Header'
import Button from './Button'
import Footer from './footer'


const Main = () => {
  return (
    <>
        
        <div className='container'>
            <div className='p-5 text-center bg-light-dark rounded'>
                <h1 className='text-light'>Stock Prediction Portal</h1>
                <p className='text-light'>The Stock Prediction Portal leverages advanced Machine Learning models to forecast future stock movements, utilizing key indicators such as the 100-day and 200-day moving averages. Gain data-driven insights to support smarter and more strategic investment decisions.</p>
                < Button text="Explore Now" class="btn-outline-info" url="/dashboard" />
            </div>
        </div>  
        
    </>
  )
}

export default Main