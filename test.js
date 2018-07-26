const categorizedomain = require('./categorize.js');
const json = require('json');

categorize = new categorizedomain()
categorize.test("http://verify.getbigeth.com").then(function(output) {
    console.log(JSON.stringify(output, null, 2))
})
