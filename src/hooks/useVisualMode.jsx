import { useState } from 'react';

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  const transition = (newMode, replace = false) => {
    setMode(newMode);
    if (!replace) {
      setHistory([...history, newMode]);
    } 
  }

  const back = () => {
    if (history.length > 1) {
      setMode(history[history.length - 2]);
    } 
    history.pop();
  }

  return { mode, transition, back };
}