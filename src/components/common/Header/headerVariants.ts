import { cva } from "class-variance-authority";

export type HeaderVariant = "home" | "back" | "chat";

export const headerVariants = cva("flex w-full items-center", {
  variants: {
    variant: {
      home: "flex justify-between items-center border-b border-white/20 bg-linear-to-b from-white/47 to-[rgba(255,255,255,0.188)] px-[2.4rem] py-[1.6rem]",
      back: "pl-[1.8rem] pr-[2.4rem] py-[2.2rem]",
      chat: "justify-between pl-[1.8rem] pr-[2.4rem] py-[2.2rem]",
    },
  },
  defaultVariants: {
    variant: "home",
  },
});
