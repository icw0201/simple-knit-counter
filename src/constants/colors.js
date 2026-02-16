/**
 * red-orange 팔레트
 * tailwind.config.js와 ColorPicker Swatches에서 공유
 */

const RED_ORANGE_PALETTE = {
  '50': '#fff1f1',
  '100': '#ffe1e0',
  '200': '#ffc7c6',
  '300': '#ffa09e',
  '400': '#ff6b67',
  '500': '#fc3e39',
  '600': '#ea1d18',
  '700': '#c51510',
  '800': '#a31511',
  '900': '#861916',
  '950': '#490806',
};

/** ColorPicker Swatches용 배열 (50 ~ 950 순서) */
const RED_ORANGE_SWATCHES = Object.values(RED_ORANGE_PALETTE);

module.exports = {
  RED_ORANGE_PALETTE,
  RED_ORANGE_SWATCHES,
};
