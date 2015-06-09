/**

These constants are imported to css files as variables. Example:

.box {
  border-radius: $BORDER_RADIUS,
  padding-top: $PADDING
}

NOTE: if you change this file, you must restart webpack (npm run watch), as
these variables are imported when the webpack starts, not when a css module is
imported.

*/

module.exports = {
  PADDING: '8px',
  BORDER_RADIUS: '4px',
  BORDER_COLOR: '#ccc',
  SCREEN_SMALL: 'max-width:600px',
  BACKGROUND: '#eee',
  FONT_BASE: '14px',
  HEADER_BACKGROUND: '#fff'
}