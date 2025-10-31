import millify from "millify";

export const convertToMillify = (num: number, precision: number = 2): string => {
  const safe = Number.isFinite(num) ? num : 0;
  return millify(safe, { precision });
}