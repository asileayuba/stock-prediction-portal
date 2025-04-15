import { useMemo, useState } from 'react'

const LearnuseMemo = () => {
    const [count, setCount] = useState(0)
    const [number, setNumber] = useState(10000000000)

    const increaseCount = () =>{
        if (count === 10){
            setNumber(9999999999)
        }
        setCount(count + 1);
    }

    // const sumOfNumbers = () =>{
    //     let sum = 0;
    //     for(let i=1; i<number; i++){
    //         sum += i;
    //     }
    //     return sum;
    // }

    const sumOfNumbers = useMemo(()=>{
        let sum = 0;
        for(let i=1; i<number; i++){
            return sum;
        }
    }, [number])

    console.log(`Sum of numbers from 1 to ${number}:`, sumOfNumbers);

  return (
    <>
        <h1>Count: {count}</h1>
        <button onClick={increaseCount}>Increase Count</button>
    </>
  )
}

export default LearnuseMemo