var pkg = require('../package.json');

// 兼容 isequal 和 @jsmini/isequal，@jsmini/isequal 替换为 jsmini_isequal
var name = pkg.name.replace('@', '').replace(/\//g, '_');
var version = pkg.version;

var banner = 
`/*!
 * isequal ${version} (https://github.com/jsmini/isequal)
 * API https://github.com/jsmini/isequal/blob/master/doc/api.md
 * Copyright 2017-${(new Date).getFullYear()} jsmini. All Rights Reserved
 * Licensed under MIT (https://github.com/jsmini/isequal/blob/master/LICENSE)
 */
`;

exports.name = name;
exports.banner = banner;
