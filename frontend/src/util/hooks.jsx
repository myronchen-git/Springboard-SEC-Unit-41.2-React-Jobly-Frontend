import { useEffect, useState } from 'react';

// ==================================================

/**
 * Retrieves and stores data into the local storage.  If the new value is null,
 * then the key-value pair will be removed from local storage.
 *
 * @param {String} key - The name for an entry in local storage.
 * @param {*} initialValue - The initial value for an entry if there is no
 *   stored value.
 * @returns {[*, Function]} The value and a function to update the value in
 *   the local storage.
 */
function useLocalStorage(key, initialValue) {
  if (typeof key !== 'string' || key === '')
    throw new Error('Key must be a non-empty String.');

  const [value, setValue] = useState(() => {
    let retrievedValue = null;
    try {
      retrievedValue = window.localStorage.getItem(key);
    } catch (err) {
      console.error(
        `Can not retrieve data from local storage.
        key = %s
        Error =
        %s`,
        key,
        err
      );
    }

    return retrievedValue || initialValue;
  });

  useEffect(() => {
    try {
      value == null
        ? window.localStorage.removeItem(key)
        : window.localStorage.setItem(key, value);
    } catch (err) {
      console.error(
        `Can not store data into local storage:
        key = %s
        value = %s
        Error =
        %s`,
        key,
        value,
        err
      );
    }
  }, [key, value]);

  return [value, setValue];
}

// ==================================================

export { useLocalStorage };
