import React from 'react'
import useCounter from '../hooks/useCounter'

const LearnCustomHooks = () => {

    const { count, increment, decrement, reset } = useCounter(5)
  return (
    <>
        <h1>Custom Hook</h1>
        <h2>Count: {count}</h2>
    </>
  )
}

export default LearnCustomHooks