import { useId } from 'react';

type Props = {
  opacity?: number;
};

export const GrainyOverlay = (props: Props) => {
  const { opacity = 0.11 } = props;
  const id = useId();
  const filterId = `grainy-overlay-${id}`;

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <filter id={filterId}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="4"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncR type="linear" slope="6" intercept="-2.5" />
            <feFuncG type="linear" slope="6" intercept="-2.5" />
            <feFuncB type="linear" slope="6" intercept="-2.5" />
          </feComponentTransfer>
        </filter>
      </defs>
      <rect width="100%" height="100%" filter={`url(#${filterId})`} opacity={opacity} />
    </svg>
  );
};
