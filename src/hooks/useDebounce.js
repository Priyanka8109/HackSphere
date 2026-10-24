import { useState, useEffect } from 'react';

/**
 * Custom Hook: useDebounce
 * Experiment 2: Debounce rapid state changes (such as search bar typing) before filtering.
 * 
 * @param {any} value - Value to debounce
 * @param {number} delay - Delay in milliseconds (default 300ms)
 */
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
