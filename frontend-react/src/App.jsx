import { useState } from 'react'
import './assets/css/style.css'
import Header from './components/Header'
import Main from './components/main'
import Footer from './components/footer'
import { BrowserRouter, Routes, Route } from "react-router-dom"


function App() {

  return (
    <>

      < BrowserRouter>
        <Routes>
          <Route path='/' element={<Main/>} />
        </Routes>
      </BrowserRouter>

    </>
  )
}

export default App
