import React from 'react'

const CounterApp = () => {
    const [count, setCount] = useState(0)
  return (
    <>
        <h1>CounterApp</h1>
        <h2>Counter:</h2>
        <button onClick={increaseCount}>Increase Count</button>
    </>
  )
}

export default CounterApp