import HelloWorld from "./components/HelloWorld"
import LearnReact from "./components/LearnReact"
import LearnJSX from "./components/LearnJSX"
import LearnProps from "./components/LearnProps"

function App() {

  return (
    <>
      <h1>App Component</h1>
      {/* <HelloWorld /> */}
      {/* <LearnReact /> */}
      {/* <LearnJSX /> */}
      <LearnProps stock='Tesla'/>
    </>
  )
}

export default App
