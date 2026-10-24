import { useState, useEffect, useCallback } from 'react';

/**
 * Custom Hook: useFetch
 * Experiment 2: Reusable data fetching hook with loading, error handling, and manual refetch.
 * 
 * @param {Function|string} fetcher - Async function returning data or URL
 * @param {Array} dependencies - Dependency array for re-fetching
 */
export function useFetch(fetcher, dependencies = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const executeFetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (typeof fetcher === 'function') {
        const result = await fetcher();
        setData(result);
      } else if (typeof fetcher === 'string') {
        const response = await fetch(fetcher);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const result = await response.json();
        setData(result);
      }
    } catch (err) {
      setError(err.message || 'An error occurred while fetching data');
    } finally {
      setLoading(false);
    }
  }, [fetcher]);

  useEffect(() => {
    let isMounted = true;
    
    executeFetch();

    return () => {
      isMounted = false;
    };
  }, dependencies);

  return { data, loading, error, refetch: executeFetch, setData };
}

export default useFetch;
