import useGlobalStore from '@/hooks/use-global';
import { convertToMajorUnit } from '@/lib';

export function Money({ value = 0 }: { value?: number }) {
  const { common } = useGlobalStore();
  const { currency } = common;

  return `${currency?.currency_symbol}${convertToMajorUnit(value)?.toFixed(2)}`;
}
