import { cva } from 'class-variance-authority';

export const containerVariants = cva('max-w-[250px]', {
  variants: {
    user: {
      me: 'py-[1.2rem] px-[1.6rem] rounded-[14px] border border-gray-10 bg-gray-alpha-10',
      ai: 'bg-transparent self-start',
    },
  },
  defaultVariants: {
    user: 'me',
  },
});
