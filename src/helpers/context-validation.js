const fs = require('fs');

module.exports = function() {
  return fs.existsSync('./.sfdx');
};
