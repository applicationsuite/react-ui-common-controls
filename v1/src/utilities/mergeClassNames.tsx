export const mergeClassNames = (classNames: (string | undefined)[]) =>
  classNames.filter((className) => !!className).join(' ');
