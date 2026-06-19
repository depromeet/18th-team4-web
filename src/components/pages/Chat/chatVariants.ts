import { cva } from 'class-variance-authority';

export const containerVariants = cva('', {
  variants: {
    user: {
      me: 'max-w-[250px] py-[1.2rem] px-[1.6rem] rounded-[14px] border border-gray-10 bg-gray-alpha-10',
      ai: 'w-[85%] max-w-[85%] bg-transparent self-start',
    },
  },
  defaultVariants: {
    user: 'me',
  },
});
