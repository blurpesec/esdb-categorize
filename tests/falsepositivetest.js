const falsepositivetokens = require('./../tokens/tokens.json')

/*
* tests for false positives by comparing to tokens.json's url fields
*/
async function falsepositivetest (inputdomain) {
    var output = {}
    var detected = false
    falsepositivetokens.forEach(function(token) {
        if (token.url) {
            if (token.url == inputdomain) {
                output.result = true
                output.category = 'Verified Domain'
                output.subcategory = token.subcategory
                detected = true
                return output
            }
        }
    })
    if (detected == true) {
        output.result = true
        return output
    }
    output.result = false
    return output
}

module.exports = falsepositivetest
