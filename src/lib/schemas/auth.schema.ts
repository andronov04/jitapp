import { z } from 'zod';

export const passwordSchema = z.string().refine(
  (password) => {
    if (password.length < 6) {
      return false;
    }
    const symbolRegex = /[$&+,:;=?@#|'<>.^*()%!-]/;
    const digitRegex = /[0-9]/;

    return symbolRegex.test(password) && digitRegex.test(password);
  },
  {
    message:
      'Password must be at least 6 characters and contain at least one symbol and one digit',
  },
);
