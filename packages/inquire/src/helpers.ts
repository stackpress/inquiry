export const joins = {
  inner: 'INNER',
  left: 'LEFT',
  left_outer: 'LEFT OUTER',
  right: 'RIGHT',
  right_outer: 'RIGHT OUTER',
  full: 'FULL',
  full_outer: 'FULL OUTER',
  cross: 'CROSS'
};

/**
 * Returns true if the two objects are the same
 */
export function jsonCompare(from: any, to: any) {
  return JSON.stringify(from) === JSON.stringify(to);
}