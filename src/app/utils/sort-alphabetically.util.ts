export function sortAlphabetically(a: string, b: string): number {
  let item1 = (a || '').toLowerCase();
  let item2 = (b || '').toLowerCase();

  if (!item1) {
    return 1;
  }

  if (!item2) {
    return -1;
  }

  if (item1 < item2) {
    return -1;
  }

  if (item1 > item2) {
    return 1;
  }

  return 0;
}
