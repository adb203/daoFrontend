import React, { useState, useEffect } from 'react';

const TypingText = ({ text }) => {
    const [displayedText, setDisplayedText] = useState('');
    const [charIndex, setCharIndex] = useState(0);

    useEffect(() => {
        if (charIndex < text.length) {
            setTimeout(() => {
                setDisplayedText(displayedText + text[charIndex]);
                setCharIndex(charIndex + 1);
            }, 100); // Speed of typing can be adjusted here.
        } else {
            // Wait for a duration (e.g., 2000ms = 2 seconds) and then reset the states
            setTimeout(() => {
                setDisplayedText('');
                setCharIndex(0);
            }, 2000); // You can adjust this duration for how long you want to wait before repeating.
        }
    }, [displayedText, charIndex, text]);
    

    return (
        <span>{displayedText}</span>
    );
};

export default TypingText;
