import HelloWorld from "./components/HelloWorld"
import LearnReact from "./components/LearnReact"
import LearnJSX from "./components/LearnJSX"
import LearnProps from "./components/LearnProps"
import LearnEvent from "./components/LearnEvent"

function App() {
  let price = 200

  return (
    <>
      <h1>App Component</h1>
      {/* <HelloWorld /> */}
      {/* <LearnReact /> */}
      {/* <LearnJSX /> */}
      {/* <LearnProps stock='Tesla' price={price}/> */}
      < LearnEvent />
    </>
  )
}

export default App
