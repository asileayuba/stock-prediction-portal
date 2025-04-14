import {useState} from 'react'

const LearnUseEffect = () => {
    const [count, setCount] = useState(0)

    const increaseCount = () =>{
        setCount(count + 1)
    }
  return (
    <>
        <h1>Count: {count}</h1>
        <button onClick={increaseCount}>Increase Count</button>
    </>
  )
}

export default LearnUseEffect