import { cva } from 'class-variance-authority';

export const tabTriggerVariants = cva(
  'flex min-w-0 flex-1 cursor-pointer items-center justify-center gap-[0.6rem] border-b-[0.14rem] py-[1.2rem] outline-none',
  {
    variants: {
      active: {
        true: 'border-icon-secondary',
        false: 'border-transparent',
      },
    },
    defaultVariants: { active: false },
  },
);

export const tabTriggerLabelVariants = cva('body1-medium whitespace-nowrap', {
  variants: {
    active: {
      true: 'text-text-default',
      false: 'text-text-caption',
    },
  },
  defaultVariants: { active: false },
});
