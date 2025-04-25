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
import { createContext, useState } from "react"
import LearnUseRef from "./components/LearnUseRef"
import LearnCustomHooks from "./components/LearnCustomHooks"
import LearnConditionalRendering from "./components/LearnConditionalRendering"
import LearnMap from "./components/LearnMap"
import LearnInlineCss from "./components/LearnInlineCss"
import LearnLoadingImages from "./components/LearnLoadingImages"
import LearnForms from "./components/LearnForms"

const StockContext = createContext();
const UserContext =createContext();

function App() {
//   let price = 200
//   let stock = 'Apple'
//   const [user, setuser] = useState({name: 'Asile', isLoggedIn: 'Yes'});

//   const someStock = (data) => {
//     console.log(data)
//   }

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
      {/* <StockContext.Provider value={{stock, price}}>
        <UserContext.Provider value={{user, setuser}}>
          < ChildA />
        </UserContext.Provider>
      </StockContext.Provider> */}

      {/* < LearnUseRef/> */}
      {/* <LearnCustomHooks/> */}
      {/* < LearnConditionalRendering /> */}
      {/* < LearnMap /> */}
      {/* < LearnInlineCss /> */}
      {/* < LearnLoadingImages /> */}
      <LearnForms />


    </>
  )
}

export default App

export {StockContext, UserContext}