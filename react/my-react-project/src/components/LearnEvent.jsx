

const LearnEvent = () => {

  const handleClick = () => {
    console.log("Button Clicked")
  }

  const handleClickAgain = (param) => {
    console.log(param)
  }

  return (
    <>
        <button onClick={handleClick}> Click Here </button>
        <br />
        <button onClick={() => handleClickAgain("Click again")}>Click Again </button>
    </>
  )
}

export default LearnEvent