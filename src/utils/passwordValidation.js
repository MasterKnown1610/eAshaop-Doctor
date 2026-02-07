/**
 * Password validation rules:
 * - At least one capital letter
 * - More than 6 characters (min 7)
 * - At least one symbol
 * - At least one lowercase letter
 * - At least one number
 */

const MIN_LENGTH = 7;

const RULES = [
  {
    name: 'capLetter',
    test: (p) => /[A-Z]/.test(p),
    message: 'At least one capital letter required',
  },
  {
    name: 'minLength',
    test: (p) => p.length > 6,
    message: 'Password must be more than 6 characters',
  },
  {
    name: 'symbol',
    test: (p) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/.test(p),
    message: 'At least one symbol required (!@#$%^&* etc.)',
  },
  {
    name: 'smallLetter',
    test: (p) => /[a-z]/.test(p),
    message: 'At least one lowercase letter required',
  },
  {
    name: 'number',
    test: (p) => /[0-9]/.test(p),
    message: 'At least one number required',
  },
];

/**
 * Validates a password against all rules.
 *
 * @param {string} password - The password to validate
 * @returns {{ isValid: boolean, errors: string[] }}
 */
export function validatePassword(password) {
  if (!password || typeof password !== 'string') {
    return {
      isValid: false,
      errors: ['Please enter a password'],
    };
  }

  const errors = RULES.filter((r) => !r.test(password)).map((r) => r.message);

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Returns the first validation error message, or null if valid.
 * Useful for showing a single error under the input.
 *
 * @param {string} password
 * @returns {string | null}
 */
export function getPasswordError(password) {
  const {isValid, errors} = validatePassword(password);
  return isValid ? null : errors[0];
}
