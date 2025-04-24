import React from 'react'

const LearnInlineCss = () => {
    const style = {
        container: {
            backgroundColor: 'red',
            width: '100px',
            height: '100px'
        },
        h2Text: {
            fontSize: '40px',
            color: '#00ff000',
        }
    }
  return (
    <>
        <p style={{ fontSize: '20px', fontWeight: 600, color: 'orange' }}>Hello, this is a paragraph</p>

        <div style={style.container}>

        </div>
    </>
  )
}

export default LearnInlineCss