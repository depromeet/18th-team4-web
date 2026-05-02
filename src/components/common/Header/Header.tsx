import { type VariantProps } from "class-variance-authority";
import { Button, ArrowIcon, PlusIcon } from "@/components";
import { cn } from "@/lib";
import { headerVariants } from "./headerVariants";
import { Logo } from "@/assets";
import Image from "next/image";

type HeaderProps =
  React.ComponentProps<'header'> &
  VariantProps<typeof headerVariants> & {
    summarizeActive?: boolean;
    onBack?: () => void;
    onCta?: () => void;
  };

export const Header = (props: HeaderProps) => {
  const { variant = "home", className, summarizeActive = false, onBack, onCta, ...rest } = props;

  return (
    <header 
      className={cn(headerVariants({ variant }), className)}
      {...rest}
    >
      {variant === "home" && (
        <>
          <div className="relative h-[2.9rem] w-[12.3rem] shrink-0 overflow-hidden">
            <Image
              src={Logo}
              alt="logo"
              className="absolute"
            />
          </div>
          <Button
            aria-label="책 등록하기"
            onClick={onCta}
            className="relative flex shrink-0 size-[4.6rem] items-center justify-center p-[1.1rem] rounded-[3.6rem] bg-linear-to-b from-[rgba(255,255,255,0.47)] to-[rgba(255,255,255,0.19)] shadow-[0_0_3.2rem_rgba(0,0,0,0.16)]"
          >
            <PlusIcon className="size-[2.4rem]" />
          </Button>
        </>
      )}

      {(variant === "back" || variant === "chat") && (
        <Button
          aria-label="뒤로가기"
          onClick={onBack}
          className="flex shrink-0 items-center justify-center"
        >
          <ArrowIcon className="-rotate-90 size-[2.4rem] fill-icon-primary" />
        </Button>
      )}

      {variant === "chat" && (
        <span
          className={cn("body1-bold tracking-[-0.048rem]", {
            "text-icon-primary": summarizeActive,
            "text-icon-disabled": !summarizeActive,
          })}
        >
          요약하기
        </span>
      )}
    </header>
  );
};
