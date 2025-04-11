

const LearnLiftingStateUp = (props) => {
    const handleClick = () => {
        let stock = 'Tesla'
        props.getStock(stock)
    }
  return (
    <>
        <h1> Lifting State Up </h1>
        <button onClick={handleClick}> Click Here</button>
    </>
  )
}

export default LearnLiftingStateUp