import { cva } from 'class-variance-authority';

export const containerVariants = cva('max-w-[250px]', {
  variants: {
    user: {
      me: 'py-[1.2rem] px-[1.6rem] rounded-[14px] border border-gray-20 ',
      ai: 'bg-transparent self-start',
    },
    tone: {
      shadow: '',
      soft: '',
    },
  },
  compoundVariants: [
    { user: 'me', tone: 'shadow', class: 'bg-gray-alpha-10 shadow-chat' },
    { user: 'me', tone: 'soft', class: 'bg-gray-alpha-10' },
  ],
  defaultVariants: {
    user: 'me',
    tone: 'shadow',
  },
});
