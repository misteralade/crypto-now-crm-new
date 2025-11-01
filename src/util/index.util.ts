import millify from "millify";

export const convertToMillify = (num: number, precision: number = 2): string => {
  const safe = Number.isFinite(num) ? num : 0;
  return millify(safe, { precision });
}

export const formatNumber = (value: string | number) => {
  return parseFloat(value.toString()).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 8,
  })
}

export const getCurrencySymbolFromCode = (currencyCode: string): string => {
  const formatter = new Intl.NumberFormat('en', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  const parts = formatter.formatToParts(0);
  const symbolPart = parts.find(part => part.type === 'currency');
  return symbolPart ? symbolPart.value : '';
}