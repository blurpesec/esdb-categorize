const categorizedomain = require('./categorize.js');
const json = require('json');

categorize = new categorizedomain()
categorize.test("https://mycrypto.com/").then(function(output) {
    console.log(JSON.stringify(output, null, 2))
})
