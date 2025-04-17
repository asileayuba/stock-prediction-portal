import HelloWorld from "./components/HelloWorld"
import LearnReact from "./components/LearnReact"
import LearnJSX from "./components/LearnJSX"
import LearnProps from "./components/LearnProps"
import LearnEvent from "./components/LearnEvent"
import LearnLiftingStateUp from "./components/LearnLiftingStateUp"
import LearnUseState from "./components/LearnUseState"
import CounterApp from "./components/CounterApp"
import LearnUseEffect from "./components/LearnUseEffect"
import LearnuseMemo from "./components/LearnuseMemo"
import ChildA from "./components/ChildA"
import { createContext } from "react"

const StockContext = createContext

function App() {
  // let price = 200
  let stock = 'Tesla'

  // const someStock = (data) => {
  //   console.log(data)
  // }

  // Create, Provider and Consumer

  return (
    <>
      {/* <h1>App Component</h1> */}
      {/* <HelloWorld /> */}
      {/* <LearnReact /> */}
      {/* <LearnJSX /> */}
      {/* <LearnProps stock='Tesla' price={price}/> */}
      {/* < LearnEvent /> */}
      {/* < LearnLiftingStateUp getStock={someStock}/> */}
      {/* < LearnUseState /> */}
      {/* < CounterApp /> */}
      {/* < LearnUseEffect /> */}
      {/* < LearnuseMemo /> */}
      < ChildA />
    </>
  )
}

export default App
