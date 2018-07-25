const json = require('json');
const idnanormalizer = require('idna-normalize')
const punycode = require('punycode')
const falsepositivetest = require('./tests/falsepositivetest.js')
const levenshteintest = require('./tests/levenshteintest.js')
const stringtokentest = require('./tests/stringtokentest.js')
const containsfiletest = require('./tests/containsfiletest.js')

module.exports = class Categorize {
    test (inputdomain) {
        return new Promise(async (resolve, reject) => {
            var returnjson = {}
            returnjson.input = inputdomain
            returnjson.categorized = false

            /* remove unneeded shit */
            var editeddomain = inputdomain.replace('http://','').replace('https://','').replace('[.]','.').replace('www.','').split(/[/?#]/)[0].toLowerCase();
            var processdomain = punycode.toUnicode(editeddomain);

            /* normalize process */
            var domainnormalize = new idnanormalizer()
            var normalizedinput = domainnormalize.normalize(processdomain)

            /* detect if idn homograph attack */
            if (processdomain != editeddomain) {
                returnjson.idnhomograph = true
                returnjson.unicodeinput = processdomain
                returnjson.normalizedinput = normalizedinput
            }
            else {
                returnjson.idnhomograph = false
            }

            returnjson.detectedbytest = []

            // checks to see if false-positive
            var falsepositivetestresults = await falsepositivetest(editeddomain)
            if (falsepositivetestresults.result) {
                if (returnjson.categorized === false ) {
                    returnjson.categorized = true
                }
                returnjson.category = falsepositivetestresults.category
                returnjson.subcategory = falsepositivetestresults.subcategory
                returnjson.detectedbytest.push('falsepositivetest')
                resolve(returnjson)
            }

            // starts testing
            var levenshteintestresults = await levenshteintest(normalizedinput)
            var stringtokentestresults = await stringtokentest(normalizedinput)
            var containsfiletestresults = await containsfiletest(inputdomain)

            if (levenshteintestresults.result) {
                if (returnjson.categorized === false) {
                    returnjson.categorized = true
                }
                returnjson.category = levenshteintestresults.category
                returnjson.subcategory = levenshteintestresults.subcategory
                returnjson.detectedbytest.push('levenshteintest')
            }
            if (stringtokentestresults.result) {
                if (returnjson.categorized === false) {
                    returnjson.categorized = true
                }
                returnjson.category = stringtokentestresults.category
                returnjson.subcategory = stringtokentestresults.subcategory
                returnjson.detectedbytest.push('stringtokentest')
            }
            if (containsfiletestresults.result) {
                if (returnjson.categorized === false) {
                    returnjson.categorized = true
                }
                returnjson.category = containsfiletestresults.category
                returnjson.subcategory = containsfiletestresults.subcategory
                returnjson.detectedbytest.push('containsfiletest')
            }
            resolve(returnjson)
        })
    }
}
