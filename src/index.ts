import { tokenToDate } from './utils/index.js';
export { Token } from './models/index.js';

// Para máxima compatibilidad CJS/ESM:
export const datetoken = tokenToDate;
export default tokenToDate;
// CJS: module.exports = tokenToDate y named
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = tokenToDate;
  module.exports.datetoken = tokenToDate;
  module.exports.Token = require('./models/index.js').Token;
}
