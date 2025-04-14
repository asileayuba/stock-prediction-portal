import {useState} from 'react'

const LearnUseEffect = () => {
    const [count, setCount] = useState(0)
    const [randomNum, setRandomNum] = useState(0)

    const increaseCount = () =>{
        setCount(count + 1)
    }

const generateRandomNum = () =>{
    const randomNum = Math.floor(Math.random() * 100);
    console.log(randomNum);
}
  return (
    <>
        <h1>Count: {count}</h1>
        <button onClick={increaseCount}>Increase Count</button>
        <hr />
        <h1>Random Number: {randomNum}</h1>
        <button onClick={generateRandomNum}>Generate Number</button>
    </>
  )
}

export default LearnUseEffect