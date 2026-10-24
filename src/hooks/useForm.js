import { useState, useCallback } from 'react';

/**
 * Custom Hook: useForm
 * Experiment 2: Reusable form handling hook with state management, validation, and submission control.
 * 
 * @param {Object} initialValues - Initial key-value pairs for form fields
 * @param {Function} validate - Validation function receiving values and returning an errors object
 * @param {Function} onSubmit - Callback function executed on valid form submission
 */
export function useForm(initialValues = {}, validate = null, onSubmit = null) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle standard input change
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;

    setValues((prev) => ({
      ...prev,
      [name]: fieldValue,
    }));

    // Clear field-specific error as user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  }, [errors]);

  // Handle field blur (when user leaves input)
  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    if (validate) {
      const validationErrors = validate(values);
      if (validationErrors[name]) {
        setErrors((prev) => ({
          ...prev,
          [name]: validationErrors[name],
        }));
      }
    }
  }, [validate, values]);

  // Set single field value programmatically
  const setFieldValue = useCallback((name, value) => {
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  // Handle Form Submission
  const handleSubmit = useCallback(async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    // Mark all fields as touched
    const allTouched = Object.keys(values).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    // Run validation if provided
    let validationErrors = {};
    if (validate) {
      validationErrors = validate(values);
      setErrors(validationErrors);
    }

    // Submit if no errors
    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true);
      try {
        if (onSubmit) {
          await onSubmit(values);
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  }, [values, validate, onSubmit]);

  // Reset form to initial state
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFieldValue,
    setValues,
    setErrors
  };
}

export default useForm;
