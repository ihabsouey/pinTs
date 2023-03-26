import React, { useState } from 'react';
import PinInput from './PinInput';

function Pin() {
    const [pinLength, setPinLength] = useState<number>(4);
    const [regex, setRegex] = useState<RegExp>(/./);
    const [secretMode, setSecretMode] = useState(false);

    function handlePinComplete(pin: any) {
        setTimeout(() =>
            alert(`PIN entered: ${pin}`),
            0);
        
    }

    const handlePinLengthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newPinLength = parseInt(event.target.value, 10);
        if (!isNaN(newPinLength)) {
            setPinLength(newPinLength);
        }
    };
    const handleRegexChange = (event: any) => {
        //convert string to regex
        const newRegex = new RegExp(event.target.value);
        setRegex(newRegex);
    };
    return (
        <div className="pin">
            <div className="container">
                <h1 className='title'>Can you crack the pin ?</h1>
                <div className='pin-config'>
                    <div>
                        <div className="pin-length">
                            <label htmlFor="pinLengthInput">Pin Length:</label>
                            <input type="number" id="pinLengthInput" name="pinLengthInput" min="1" max="10" value={pinLength} onChange={handlePinLengthChange} />
                        </div>
                        <div className='pin-regex'>
                            <label htmlFor="regex">Regex:</label>
                            <select id="regex" name="regex" onChange={handleRegexChange}>
                                <option value=".">All</option>
                                <option value="\d">Only Digits</option>
                                <option value="^[a-zA-Z]{1}$">Only Letters</option>
                                <option value="^[\w]{1}$">Letters and Digits</option>

                            </select>
                        </div>
                    </div>

                    <button className='pin-secret' onClick={() => setSecretMode(!secretMode)}>
                        {secretMode ? "Disable Secret Mode" : "Enable Secret Mode"}
                    </button>
                </div>
                <PinInput
                    length={pinLength} // sets the number of input boxes to 6
                    secret={secretMode} // sets whether the input boxes are masked or not
                    onComplete={handlePinComplete} // a callback function that is called when all boxes are filled
                    regex={regex} // a regex to determine what characters are allowed
                />

            </div>

        </div>
    );
}

export default Pin;
