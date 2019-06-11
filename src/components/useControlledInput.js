import React, { useEffect } from "react";
import { useInput } from "react-hanger";

export default function useControlledInput(initialValue, options = {}) {
  const { shouldFocusInput = true, shouldClearInput = true } = options;
  const input = useInput(initialValue);
  const inputRef = React.useRef();

  // Clear the input
  useEffect(() => {
    if (shouldClearInput) {
      input.clear();
    }
  }, [shouldClearInput, input]);

  // Focus the input
  useEffect(() => {
    if (shouldFocusInput) {
      inputRef.current && inputRef.current.focus();
    }
  }, [shouldFocusInput]);

  return [input, inputRef];
}
