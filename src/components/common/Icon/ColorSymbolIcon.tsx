import { type SVGProps } from 'react';
import { ColorSymbol } from '@/assets';

type Props = SVGProps<SVGSVGElement>;

export const ColorSymbolIcon = (props: Props) => {
  const { ...rest } = props;

  return <ColorSymbol {...rest} />;
};
