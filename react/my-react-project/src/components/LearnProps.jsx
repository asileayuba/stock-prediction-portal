

// const LearnProps = (props) => {
//   return (
//     <>
//       <h2>Props</h2>
//       <h3>Stock Name: {props.stock}</h3>
//       <h3>Stock Price: ${props.price}</h3>
//     </>
//   )
// }


const LearnProps = ({stock, price}) => {
  return (
    <>
      <h2>Props</h2>
      <h3>Stock Name: {stock}</h3>
      <h3>Stock Price: ${price}</h3>
    </>
  )
}

export default LearnProps
