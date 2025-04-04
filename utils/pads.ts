const numPad = "(?:(?:[0-9]+\\.[0-9]+)|(?:[0-9]+))";

const nPad = `(?:(?:\\((\\-${numPad})\\))|(${numPad}))`;

export const nNumPad = new RegExp(`^-${numPad}?$`);

export const nPowPad = new RegExp(`^${nPad}$`);

export const nInPar = new RegExp(`\\((${numPad})\\)`);

export const multDivPad = new RegExp(`${nPad}([*/])${nPad}`);

export const sumSubPad = new RegExp(`${nPad}([+-])${nPad}`);

export const powPad = new RegExp(`${nPad}\\[(\\-?${numPad})\\]`);

export const terms = new RegExp(
  `(?:|-|\\+)(?:(?:${numPad}[xyz])|(?:[xyz])|${numPad})`,
  "g"
);
