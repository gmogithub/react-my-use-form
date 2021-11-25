export const keyframesTransformScale = (nameIn: string, nameOut: string) => {
  const keyNameIn = `@keyframes ${nameIn}`;
  const keyNameOut = `@keyframes ${nameOut}`;
  return {
    [keyNameIn]: {
      to: {
        transform: "scale(1.01)",
        "-webkit-perspective": 1000,
        "-webkit-font-smoothing": "subpixel-antialiased"
      }
    },
    [keyNameOut]: {
      from: {
        transform: "scale(1.02)"
      },
      to: {
        transform: "scale(1)"
      }
    }
  };
};
