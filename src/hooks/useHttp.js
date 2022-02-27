import {useState, useCallback} from 'react';

const baseUrl = process.env.REACT_APP_API_URL;

const useHttp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(async (url, method = 'GET', body = null, headers = {}) => {
    setLoading(true);
    try {
      if (body) {
        if (headers['Content-Type'] && headers['Content-Type'] === 'multipart/form-data') {
          delete headers['Content-Type'];
        } else {
          body = JSON.stringify(body);
          headers['Content-Type'] = 'application/json';
        }
      }

      const response = await fetch(`${baseUrl}${url}`, {method, body, headers});
      const data = await response.json();
      if (!response.ok) {
        if (data.errors) data.errors.forEach(err => { throw new Error(err.msg); });
        else throw new Error(data.message || 'Something went wrong');
      }

      setLoading(false);
      return data;
    } catch (e) {
      setLoading(false);
      setError(e.message);
      throw e;
    }
  }, []);

  const clearError = useCallback(() => {setError(null)}, []);

  return { loading, request, error, clearError }
}

export default useHttp;