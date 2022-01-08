const path = require('path');

exports.rootDir = path.dirname(
    require.main.filename || process.mainModule.filename
);
