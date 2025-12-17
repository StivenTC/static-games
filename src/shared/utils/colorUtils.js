/**
 * Darkens a hex color by a given percentage.
 * @param {string} color - Hex color (e.g., #ffffff or #fff)
 * @param {number} percent - Percentage to darken (0-100)
 * @returns {string} Darkened hex color
 */
export const darkenColor = (color, percent) => {
  let R = parseInt(color.substring(1).substring(0, 2), 16);
  let G = parseInt(color.substring(1).substring(2, 4), 16);
  let B = parseInt(color.substring(1).substring(4, 6), 16);

  R = parseInt((R * (100 - percent)) / 100);
  G = parseInt((G * (100 - percent)) / 100);
  B = parseInt((B * (100 - percent)) / 100);

  R = R < 255 ? R : 255;
  G = G < 255 ? G : 255;
  B = B < 255 ? B : 255;

  const RR =
    R.toString(16).length === 1 ? '0' + R.toString(16) : R.toString(16);
  const GG =
    G.toString(16).length === 1 ? '0' + G.toString(16) : G.toString(16);
  const BB =
    B.toString(16).length === 1 ? '0' + B.toString(16) : B.toString(16);

  return '#' + RR + GG + BB;
};
