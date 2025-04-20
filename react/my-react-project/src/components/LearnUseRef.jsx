import React, { useState } from 'react'

const LearnUseRef = () => {
    const  [name, setName] = useState('')
  return (
    <>
        <h1>Learn useRef</h1>
        <input type="text" value={name} onChange={(e)=>setName(e.target.value)} />
    </>
  )
}

export default LearnUseRef