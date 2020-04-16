import React, { useState } from "react";

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  const transition = (newMode, replace = false) => {
    setMode(newMode);
    if (replace) {
      setHistory(prev => [...[...prev.slice(0, history.length - 1)], newMode]);
    } else {
      setHistory(prev => [...prev, newMode]);
    }
  };

  const back = () => {
    if (history.length > 1) {
      console.log(history);
      console.log(history.slice(0, history.length - 1));

      setHistory(prev => [...prev.slice(0, history.length - 1)]);

      console.log(history);
    }
  };

  return { mode: history[history.length - 1], transition, back };
}