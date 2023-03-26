import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

const PinInputContainer = styled.div`
  display: flex;
`;

const PinBox = styled.input`
  width: 2em;
  height: 2em;
  margin: 0 0.5em;
  font-size: 1.5em;
  text-align: center;
  border: 1px solid #ddd;
  border-radius: 0.25em;

  &:focus {
    outline: none;
    border-color: blue;
  }
`;

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
  const firstBoxRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (firstBoxRef.current) {
      firstBoxRef.current.focus();
    }
  }, []);

  const styleError = (index: number) => {
    // Make some style to show that the key is not allowed

    refs.current[index].style.borderColor = "red";
    refs.current[index].style.color = "red";
    refs.current[index].style.scale = "1.2";
    //wait 300ms and then remove the animation
    setTimeout(function () { refs.current[index].style.scale = "1"; }, 300);
  }
  const styleValid = (index: number) => {
    // Make some style to show that the key is allowed
    refs.current[index].style.borderColor = "lightgreen";
    refs.current[index].style.color = "black";
    refs.current[index].style.scale = "1";
  }
  const reStyleBoxes = () => {
    for (let i = 0; i < length; i++) {
      if (regex?.test(pin[i]) === false) {
        styleError(i)

      } else {

        styleValid(i)
      }
    }
  }

  useEffect(() => {
    reStyleBoxes();

  }, [regex]);


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
    <PinInputContainer>
      {Array.from({ length }, (_, i) => (
        <PinBox
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
    </PinInputContainer>
  );
};

export default PinInput;


