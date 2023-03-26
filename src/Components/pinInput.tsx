import React, { useState, useEffect, useRef } from 'react';
import '../App.css';


interface PinInputProps {
  length: number;
  secret?: boolean;
  onComplete?: (pin: string) => void;
  regex?: RegExp;
}


const PinInput: React.FC<PinInputProps> = ({
  length,
  secret = false,
  onComplete,
  regex,
}) => {

  const [pin, setPin] = useState<string[]>(new Array(length).fill('0'));
  const refs = useRef<Array<HTMLInputElement>>([]);

  useEffect(() => {
    refs.current[0].focus();
  }, []);

  useEffect(() => {
    reStyleBoxes();
  }, [regex]);

  // Make some style to show that the key is not allowed
  const styleError = (index: number) => {
    refs.current[index].style.borderColor = "red";
    refs.current[index].style.color = "red";
    refs.current[index].style.scale = "1.2";
    //wait 300ms and then remove the animation
    setTimeout(function () { refs.current[index].style.scale = "1"; }, 300);
  }

  // Make some style to show that the key is allowed
  const styleValid = (index: number) => {
    refs.current[index].style.borderColor = "lightgreen";
    refs.current[index].style.color = "black";
    refs.current[index].style.scale = "1";
  }
  //Re-style all boxes when regex changes
  const reStyleBoxes = () => {
    for (let i = 0; i < length; i++) {
      if (regex?.test(pin[i])) {
        styleValid(i)
      } else {
        styleError(i)
      }
    }
  }

  // style the boxes when the pin changes
  const styleForInvalidKey = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    const digit = event.key;
    if (!regex?.test(digit)) {
      event.preventDefault();
      styleError(index);
      return;
    } else {
      styleValid(index);
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    const digit = event.key;
    if (event.key === 'Backspace') {
      // Clear the current box and move to the previous box
      const newPin = [...pin];
      newPin[index] = '';
      setPin(newPin);
      if (index > 0 && refs.current[index - 1]) {
        refs.current[index - 1].focus();
      }
      return;

    }
    if (event.key === 'ArrowLeft') {
      // Move to the previous box
      if (index > 0 && refs.current[index - 1]) {
        refs.current[index - 1].focus();
      }
      return;
    }
    if (event.key === 'ArrowRight' || event.key === 'Tab') {
      event.preventDefault(); // prevent the tab default behavior
      // Move to the next box
      if (index < length - 1 && refs.current[index + 1]) {
        refs.current[index + 1].focus();
      }
      return;
    }
    console.log(regex)
    // Ignore non-digit keys
    styleForInvalidKey(index, event);


    // Update the pin and move to the next box
    const newPin = [...pin];
    newPin[index] = digit;
    setPin(newPin);
    if (index < length - 1 && refs.current[index + 1]) {
      refs.current[index + 1].focus();
    }

    // Invoke the onComplete callback if all boxes are filled
    if (newPin.every(d => regex?.test(d)) && onComplete && refs.current[index] == refs.current[length - 1]) {
      onComplete(newPin.join(''));
    }

  };
  // Handle paste event
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text/plain");
    const pastedChars = pastedText.split("");

    let index = 0;
    let newPin = [...pin];

    for (const char of pastedChars) {
      if (index >= length) {
        break;
      }

      if (regex?.test(char)) {
        newPin[index] = char;
        index++;
      }
    }

    setPin(newPin);
  };

  return (
    <div className='PinInputContainer'>
      {Array.from({ length }, (_, i) => (
        <input className='pin-box'
          key={i}
          type={secret ? 'password' : 'tel'}
          maxLength={1}
          value={pin[i]}
          ref={(el: HTMLInputElement) => refs.current[i] = el!}
          onChange={() => { }}
          onKeyDown={(event) => handleKeyDown(event, i)}
          onPaste={handlePaste}
        />
      ))}
    </div>
  );
};

export default PinInput;


