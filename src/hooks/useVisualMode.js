import { useState } from "react";

export default function useVisualMode(initialMode) {
  const [mode, setMode] = useState(initialMode);

  const transition = (mode) => setMode(mode);
  
  return { mode, transition }
}