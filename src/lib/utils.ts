import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRupiah(price: number) {
  const priceString = price?.toString();
  let result = '';
  let counter = 0;

  for (let i = priceString.length - 1; i >= 0; i--) {
    counter++;
    result = priceString[i] + result;
    if (counter % 3 === 0 && i !== 0) {
      result = '.' + result;
    }
  }

  return `Rp ${result}`;
}
