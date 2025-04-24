import React from "react";
import "../assets/css/style.css";

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
    },
    paragraph: {
      fontSize: '20px',
      fontWeight: 600,
      color: 'purple'
    }
  };

  return (
    <>
      {/* Inline CSS */}
      <h1>Inline CSS</h1>
      <p style={style.paragraph}>Hello, this is a paragraph</p>
      <div style={style.container}></div>
      <h2 style={style.h2Text}>Test H2 Element</h2>

      <hr />

      {/* Internal CSS */}
      <h1>Internal CSS</h1>
      <style>
        {`
          .container {
            background-color: #00ff00;
            height: 100px;
            width: 100px;
          }
        `}
      </style>
      <div className='container'></div>

      <hr />

      {/* External CSS */}
      <h1>External CSS</h1>
      <div className='yellowbox'></div>
      <h2 className='yellowtext'>Yellow Text</h2>
    </>
  );
};

export default LearnInlineCss;
