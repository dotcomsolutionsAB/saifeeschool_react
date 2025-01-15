import { useState } from "react";

// ----------------------------------------------------------------------

export default function useLocalStorage(key, defaultValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);

      if (item) {
        try {
          return JSON.parse(item);
        } catch {
          return item;
        }
      }

      const valueToStore =
        typeof defaultValue === "string"
          ? defaultValue
          : JSON.stringify(defaultValue);
      localStorage.setItem(key, valueToStore);
      return defaultValue;
    } catch (error) {
      console.error("Error accessing localStorage:", error);

      // Store the default value in case of error
      const valueToStore =
        typeof defaultValue === "string"
          ? defaultValue
          : JSON.stringify(defaultValue);
      try {
        localStorage.setItem(key, valueToStore);
      } catch (storageError) {
        console.error("Error storing default value:", storageError);
      }

      return defaultValue;
    }
  });

  const setValue = (newValueOrUpdater) => {
    try {
      let newValue;

      if (typeof newValueOrUpdater === "function") {
        newValue = newValueOrUpdater(storedValue);
      } else {
        newValue = newValueOrUpdater;
      }

      const valueToStore =
        typeof newValue === "string" ? newValue : JSON.stringify(newValue);
      localStorage.setItem(key, valueToStore);

      setStoredValue(newValue);
    } catch (error) {
      console.error("Error updating localStorage:", error);
    }
  };

  const removeValue = () => {
    try {
      localStorage.removeItem(key);
      setStoredValue(defaultValue);
    } catch (error) {
      console.error("Error removing item from localStorage:", error);
    }
  };

  return [storedValue, setValue, removeValue];
}
