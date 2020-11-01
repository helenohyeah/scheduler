import { useState } from "react";

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);
  
  const transition = (mode) => {
    setHistory([...history, mode]);
    setMode(mode);
  }
  
  const back = () => {
    // Prevent navigating back from initial mode
    if (history.length <= 1) {
      setMode(initial);
      return;
    }
    
    const prevMode = history[history.length-2];
    setHistory(history.splice(0, history.length-1));
    setMode(prevMode);
  }
  
  return { mode, transition, back }
}