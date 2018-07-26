const json = require('json');
const idnanormalizer = require('idna-normalize')
const punycode = require('punycode')
const falsepositivetest = require('./tests/falsepositivetest.js')
const levenshteintest = require('./tests/levenshteintest.js')
const stringtokentest = require('./tests/stringtokentest.js')
const containsstringtest = require('./tests/containsstringtest.js')
const config = require('./config.js')

class categorize {
    test (inputdata) {
        return new Promise(async (resolve, reject) => {
            var inputdomain = inputdata.domain
            var returnjson = {}
            if (inputdata.description) {
                returnjson.description = inputdata.description
            }
            if (inputdata.addresses) {
                returnjson.addresses = inputdata.addresses
            }
            returnjson.input = inputdomain
            returnjson.categorized = false

            /* remove unneeded shit */
            var editeddomain = inputdomain.replace('http://','').replace('https://','').replace('[.]','.').replace('www.','').toLowerCase();
            var editeddowndomain = editeddomain.split(/[/?#]/)[0]
            var processdomain = punycode.toUnicode(editeddomain);

            /* normalize process */
            var domainnormalize = new idnanormalizer()
            var normalizedinput = domainnormalize.normalize(processdomain)
            returnjson.name = editeddowndomain

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

            if (!config.runfalsepositivetest && !config.runlevenshteintest && !config.runstringtokentest && !config.runcontainsstringtest) {
              console.log("Didnt select any tests to run. Edit the config.js file to do so.")
            }

            // checks to see if false-positive
            if (config.runfalsepositivetest) {
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
            }

            // starts testing
            if (config.runlevenshteintest) {
                var levenshteintestresults = await levenshteintest(normalizedinput)
                if (levenshteintestresults.result) {
                    if (returnjson.categorized === false) {
                        returnjson.categorized = true
                    }
                    returnjson.category = levenshteintestresults.category
                    returnjson.subcategory = levenshteintestresults.subcategory
                    returnjson.detectedbytest.push('levenshteintest')
                }
            }
            if (config.runstringtokentest) {
                var stringtokentestresults = await stringtokentest(normalizedinput)
                if (stringtokentestresults.result) {
                    if (returnjson.categorized === false) {
                        returnjson.categorized = true
                    }
                    returnjson.category = stringtokentestresults.category
                    returnjson.subcategory = stringtokentestresults.subcategory
                    returnjson.detectedbytest.push('stringtokentest')
                }
            }
            if (config.runcontainsstringtest) {
                var containsstringtestresults = await containsstringtest(editeddomain)
                if (containsstringtestresults.result) {
                    if (returnjson.categorized === false) {
                        returnjson.categorized = true
                    }
                    returnjson.status = containsstringtestresults.status
                    returnjson.category = containsstringtestresults.category
                    returnjson.subcategory = containsstringtestresults.subcategory
                    returnjson.detectedbytest.push('containsstringtest')
                }
                if (!containsstringtestresults.result) {
                    if (containsstringtestresults.status) {
                        returnjson.status = containsstringtestresults.status
                    }
                }
            }

            resolve(returnjson)
        })
    }
}

module.exports = categorize
