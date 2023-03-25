import React from 'react';
import logo from './logo.svg';
import './App.css';
import PinInput from './Components/pinInput';

function App() {
  function handlePinComplete(pin: any) {
    console.log(`PIN entered: ${pin}`);
  }
  return (
    <div className="App">

      <PinInput
        length={6} // sets the number of input boxes to 6
        secret={false} // sets whether the input boxes are masked or not
        onComplete={handlePinComplete} // a callback function that is called when all boxes are filled
        />
    </div>
  );
}

export default App;
