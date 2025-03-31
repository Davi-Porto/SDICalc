export const padPoly =
  /^((?:|\+|\-)(?:(?:(?:[a-z]|[A-Z])+)|(?:[1-9][0-9]*(?:[a-z]|[A-Z])+)|(?:[1-9][0-9]*))(?:(?:\^(?:|\+|\-)[1-9][0-9]*)|[¹²³⁴⁵⁶⁷⁸⁹⁰]+)?)+$/;

export const padTerm =
  /((?:|\+|\-)(?:(?:(?:[a-z]|[A-Z])+)|(?:[1-9][0-9]*(?:[a-z]|[A-Z])+)|(?:[1-9][0-9]*))(?:(?:\^(?:|\+|\-)[1-9][0-9]*)|[¹²³⁴⁵⁶⁷⁸⁹⁰]+)?)/g;

export const padExp =
  /(?:(?:[1-9][0-9]*(?:[a-z]|[A-Z])+)|(?:[a-z]|[A-Z])+|(?:[1-9][0-9]*))\^((?:|\-|\+)[0-9]+)/g;
