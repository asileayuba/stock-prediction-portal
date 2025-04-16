import React from 'react'
import ChildC from './ChildC'

const ChildB = (props) => {
  return (
    <>
        <div>ChildB</div>
        < ChildC stock={props.stock} />
    </>
  )
}

export default ChildB