import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Button } from 'react-native';

export default function Stopwatch({isTimeRunning}) {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  const startTimer = () => {
    if (!isRunning) {
      setIsRunning(true);
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 10); // Increase by 10ms
      }, 10);
    }
  };

  const stopTimer = () => {
    if (isRunning) {
      clearInterval(intervalRef.current);
      setIsRunning(false);
    }
  };

  const resetTimer = () => {
    clearInterval(intervalRef.current);
    setTime(0);
    setIsRunning(false);
  };

  const formatTime = (milliseconds) => {
    const mins = Math.floor(milliseconds / 60000);
    const secs = Math.floor((milliseconds % 60000) / 1000);
    const millis = Math.floor((milliseconds % 1000) / 10);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}:${String(millis).padStart(2, '0')}`;
  };

  useEffect(()=>{
    console.log("STOPWATCH");
    if(!isTimeRunning){
        stopTimer();
        console.log(formatTime(time));
    }else{
      console.log("starting timer...");
        startTimer();
    }
  },[isTimeRunning])

  return (
    <View >
    </View>
  );
}