import React from 'react'
import ChildB from './ChildB'

const ChildA = (props) => {
  return (
    <>
        <div>ChildA</div>
        <ChildB stock={props.stock} />
    </>
  )
}

export default ChildA