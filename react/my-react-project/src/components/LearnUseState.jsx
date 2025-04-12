import {useState} from 'react'

const LearnUseState = () => {
    const [num, setNum] = useState(5)
    console.log(num);

    const handleNum = () => {
        setNum(10)
    }

    const [stockPrice, setStockPice] = useState({stock: 'Apple', price: 100})
    console.log(stockPrice);

    const UpdateStockPrice = () => {
        setStockPrice({...stockPrice, price: 200})
    }
  return (
    <>
    <h1>Number: {num}</h1>
    <button onClick={handleNum}> Click Here </button>
    <hr />
    <h2>{stockPrice.stock} : {stockPrice.price}</h2>
    <button onClick={UpdateStockPrice}> Click Here </button>
    </>
  )
}

export default LearnUseState