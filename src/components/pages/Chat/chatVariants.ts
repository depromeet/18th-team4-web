import { cva } from 'class-variance-authority';

export const containerVariants = cva('max-w-[250px]', {
  variants: {
    user: {
      me: 'py-[1.2rem] px-[1.6rem] bg-text-white shadow-chat rounded-[14px] self-end',
      ai: 'bg-transparent self-start',
    },
  },
  defaultVariants: {
    user: 'me',
  },
});
