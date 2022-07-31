/*
const asd = new Array(100).fill(null).reduce((accum, item, index) => ({...accum, [index]: { [`${index}11`]: index, [`${index}222`]: {[`${index}333`]: index}} }), {});
const asd1 = new Array(100).fill(null).reduce((accum, item, index) => ({...accum, [index]: { [`${index}1`]: index%100 === 0 ? index + 1 : index, [`${index}2`]: {[`${index}3`]: index%50 === 0 ? index + 1 : index} }}), {});
*/

export const findDiff = (a: any, b: any): any => {
  if (JSON.stringify(a) === JSON.stringify(b)) return {};
  const entriesA = Object.entries(a);
  let result = {} as any;
  const existingKeys = {} as any;
  entriesA.forEach(([key, value]) => {
    if (key in b) existingKeys[key] = true;
    if (
      value &&
      typeof value === 'object' &&
      b[key] &&
      typeof b[key] === 'object'
    ) {
      const innerResult = findDiff(value, b[key]);
      result = Object.keys(innerResult).length
        ? { ...result, [key]: innerResult }
        : result;
      return;
    }
    if (value === b[key]) return;
    result = { ...result, [`${key}`]: { current: b[key], previous: value } };
  });
  b &&
    typeof b === 'object' &&
    Object.keys(b)
      .filter((key) => !existingKeys[key])
      .forEach((key) => {
        result[`${key}`] = { current: b[key], previous: undefined };
      });
  return result;
};

// findDiff(asd, asd1)
