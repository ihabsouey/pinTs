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
}

const PinInput: React.FC<PinInputProps> = ({
  length,
  secret = false,
  onComplete,
}) => {
  const [pin, setPin] = useState<string[]>(new Array(length).fill(''));
  const refs = useRef<Array<HTMLInputElement>>([]);
  const firstBoxRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (firstBoxRef.current) {
      firstBoxRef.current.focus();
    }
  }, []);

  



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
    if (event.key === 'ArrowRight') {
        // Move to the next box
        if (index < length - 1 && refs.current[index + 1]) {
            refs.current[index + 1].focus();
            }
        return;
    }

    // Ignore non-digit keys
    if (!/^\d$/.test(digit)) {
      event.preventDefault();
      return;
    }

    // Update the pin and move to the next box
    const newPin = [...pin];
    newPin[index] = digit;
    setPin(newPin);
    if (index < length - 1 && refs.current[index + 1]) {
      refs.current[index + 1].focus();
    }

    // Invoke the onComplete callback if all boxes are filled
    if (newPin.every(d => /^\d$/.test(d)) && onComplete) {
      onComplete(newPin.join(''));
    }

    
  };

  const handlePaste = (event: any, index: number) => {
    const text = event.clipboardData.getData('text/plain');
    console.log("text");
    
    if (text.length !== 6) {
      event.preventDefault();
      return;
    }

    const newPin = [...pin];
    for (let i = 0; i < 6; i++) {
      const digit = text[i];
      if (/^\d$/.test(digit)) {
        newPin[index + i] = digit;
      } else {
        event.preventDefault();
        return;
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
          onChange={() => {}}
          onKeyDown={(event) => handleKeyDown(event, i)}
          onPaste={(event) => handlePaste(event, i)}

        />
      ))}
    </PinInputContainer>
  );
};

export default PinInput;
