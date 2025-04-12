import {useState} from 'react'

const LearnUseState = () => {
    const [num, setNum] = useState(5)
    console.log(num);

    const handleNum = () => {
        setNum(10)
    }
  return (
    <>
    <h1>Number: {num}</h1>
    <button onClick={handleNum}> Click Here </button>
    </>
  )
}

export default LearnUseState