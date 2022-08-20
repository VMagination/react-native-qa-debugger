import { deepEqual } from 'fast-equals';

/*
const asd = new Array(100).fill(null).reduce((accum, item, index) => ({...accum, [index]: { [`${index}11`]: index, [`${index}222`]: {[`${index}333`]: index}} }), {});
const asd1 = new Array(100).fill(null).reduce((accum, item, index) => ({...accum, [index]: { [`${index}1`]: index%100 === 0 ? index + 1 : index, [`${index}2`]: {[`${index}3`]: index%50 === 0 ? index + 1 : index} }}), {});
*/

export const undef = '[QA Debugger]: undefined';

const undefFallback = (v: any) => (v === undefined ? undef : v);
export const reverseUndefFallback = (v: any) => (v === undef ? undefined : v);

export const findDiff = (a: any, b: any): { diff: any; diffReadable: any } => {
  if (deepEqual(a, b)) return { diff: undefined, diffReadable: undefined };
  const allKeys = [
    ...new Set([...Object.keys(a || {}), ...Object.keys(b || {})]),
  ];
  let result = {} as any;
  let resultReadable = {} as any;
  allKeys.forEach((key) => {
    const value = a?.[key];
    if (
      value &&
      typeof value === 'object' &&
      b?.[key] &&
      typeof b[key] === 'object'
    ) {
      const { diff: innerResult, diffReadable: innerResultReadable } = findDiff(
        value,
        b[key]
      );
      result = Object.keys(innerResult || {}).length
        ? { ...result, [key]: undefFallback(innerResult) }
        : result;
      resultReadable = Object.keys(innerResultReadable || {}).length
        ? { ...resultReadable, [key]: undefFallback(innerResultReadable) }
        : resultReadable;
      return;
    }
    if (value === b?.[key]) return;
    result = { ...result, [`${key}`]: undefFallback(b?.[key]) };
    resultReadable = {
      ...resultReadable,
      [`${key}`]: {
        current: undefFallback(b?.[key]),
        previous: undefFallback(value),
      },
    };
  });

  return { diff: result, diffReadable: resultReadable };
};

// findDiff(asd, asd1)
