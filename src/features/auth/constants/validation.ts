export const PASSWORD_VALIDATIONS = [
  {
    test: (val: string) => /[a-z]/.test(val) && /[A-Z]/.test(val),
    message: 'Use all case letters',
  },
  {
    test: (val: string) => val.length >= 8 && val.length <= 12,
    message: 'Enter 8-12 letters',
  },
  {
    test: (val: string) => /[@!~]/.test(val),
    message: 'Enter special letters (@/!/~)',
  },
] as const;
