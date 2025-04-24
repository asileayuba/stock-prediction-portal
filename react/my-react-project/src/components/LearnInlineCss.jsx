import React from 'react'

const LearnInlineCss = () => {
    const style = {
        container: {
            backgroundColor: 'white',
            width: '100px',
            height: '100px'
        },
        h2Text: {
            fontSize: '40px',
            color: 'gold',
        }
    }
  return (
    <>
            <style>
                {`
                    .container{
                        background-color: #00ff00;
                        height: 100px;
                        width: 100px;
                    }
                `}
            </style>
    <h1>Internal CSS</h1>
        <p style={{ fontSize: '20px', fontWeight: 600, color: 'purple' }}>Hello, this is a paragraph</p>

        <div style={style.container}>

        </div>

        <h2 style={style.h2Text}> Test H2 Element</h2>
        <hr />
        <h1>Internal CSS</h1>
        <div className='container'>

        </div>
        <hr />
        <h1>External CSS</h1>
        <div className='yellowbox'>

        </div>
        <h2 className='yellowtext'>Yellow Text</h2>
    </>
  )
}

export default LearnInlineCss