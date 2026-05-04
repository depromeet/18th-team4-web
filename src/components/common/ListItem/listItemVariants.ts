import { cva } from 'class-variance-authority';

export const listItemVariants = cva(
  'flex w-full appearance-none items-center gap-[1.6rem] rounded-[2rem] border-0 px-[1.6rem] py-[1.8rem] text-left',
  {
    variants: {
      selected: {
        true: 'bg-gray-alpha-50',
        false: 'bg-transparent',
      },
    },
    defaultVariants: {
      selected: false,
    },
  },
);
