import { deepEqual } from 'fast-equals';

/*
const asd = new Array(100).fill(null).reduce((accum, item, index) => ({...accum, [index]: { [`${index}11`]: index, [`${index}222`]: {[`${index}333`]: index}} }), {});
const asd1 = new Array(100).fill(null).reduce((accum, item, index) => ({...accum, [index]: { [`${index}1`]: index%100 === 0 ? index + 1 : index, [`${index}2`]: {[`${index}3`]: index%50 === 0 ? index + 1 : index} }}), {});
*/

export const undef = '[QA Debugger]: undefined';

const undefFallback = (v: any) => (v === undefined ? undef : v);
export const reverseUndefFallback = (v: any) => (v === undef ? undefined : v);

let counter = 0;

const waitForFrame = () => new Promise((r) => requestAnimationFrame(r));

export const findDiff = async (
  aRaw: any | Promise<any>,
  bRaw: any | Promise<any>
): Promise<{ diff: any; diffReadable: any }> => {
  if (!(counter % 1000)) {
    await waitForFrame();
  }
  counter++;
  const a = await aRaw;
  const b = await bRaw;
  if (deepEqual(a, b)) return { diff: undefined, diffReadable: undefined };
  const allKeys = [
    ...new Set([...Object.keys(a || {}), ...Object.keys(b || {})]),
  ];
  let result = {} as any;
  let resultReadable = {} as any;
  await allKeys.reduce(async (accum, key) => {
    await accum;
    const value = a?.[key];
    if (
      value &&
      typeof value === 'object' &&
      b?.[key] &&
      typeof b[key] === 'object'
    ) {
      const { diff: innerResult, diffReadable: innerResultReadable } =
        await findDiff(value, b[key]);
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
  }, new Promise((r) => r(null)));

  return { diff: result, diffReadable: resultReadable };
};

// findDiff(asd, asd1)
