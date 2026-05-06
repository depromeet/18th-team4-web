export const PATH_NAME = {
  main: () => '/',

  register: {
    list: () => '/register',
    complete: () => '/register/complete',
  },
} as const;
