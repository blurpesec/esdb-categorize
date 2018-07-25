const categorizedomain = require('./categorize.js');
const json = require('json');

categorize = new categorizedomain()
categorize.test("xn--myetherwale-jb9e.com").then(function(output) {
    console.log(JSON.stringify(output, null, 2))
})
