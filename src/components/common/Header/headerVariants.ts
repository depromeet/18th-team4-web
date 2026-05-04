import { cva } from "class-variance-authority";

export const HEADER_VARIANT = {
  HOME: "home",
  BACK: "back",
  CHAT: "chat",
} as const;

export type HeaderVariant =
  (typeof HEADER_VARIANT)[keyof typeof HEADER_VARIANT];

  export const headerVariants = cva("flex w-full items-center", {
    variants: {
      variant: {
        [HEADER_VARIANT.HOME]:
          "flex justify-between items-center border-b border-white/20 bg-linear-to-b from-white/47 to-[rgba(255,255,255,0.188)] px-[2.4rem] py-[1.6rem]",
        [HEADER_VARIANT.BACK]:
          "pl-[1.8rem] pr-[2.4rem] py-[2.2rem]",
        [HEADER_VARIANT.CHAT]:
          "justify-between pl-[1.8rem] pr-[2.4rem] py-[2.2rem]",
      },
    },
    defaultVariants: {
      variant: HEADER_VARIANT.HOME,
    },
  });