import React, {useState} from 'react'

const CounterApp = () => {
    const [count, setCount] = useState(0)

    const increaseCount =  () => {
        setCount(count + 1);
    }
  return (
    <>
        <h1>CounterApp</h1>
        <h2>Counter:</h2>
        <button onClick={increaseCount}>Increase Count</button>
    </>
  )
}

export default CounterApp