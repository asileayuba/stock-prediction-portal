import {useState} from 'react'

const LearnUseEffect = () => {
    const [count, setCount] = useState(0)
  return (
    <>
        <h1>Count: {count}</h1>
    </>
  )
}

export default LearnUseEffect