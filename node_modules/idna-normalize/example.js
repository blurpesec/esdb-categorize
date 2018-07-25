const IDNANormalizer = require('./normalize.js');

const domainnormalize = new IDNANormalizer();

const normalizeddomain = domainnormalize.normalize('mycrỵpto.com')
console.log(normalizeddomain)
