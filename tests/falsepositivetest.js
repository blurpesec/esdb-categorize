const falsepositivetokens = require('./../tokens/tokens.json')

/*
* tests for false positives by comparing to tokens.json's url fields
*/
async function falsepositivetest (inputdomain) {
    var output = {}
    var detected = false
    falsepositivetokens.forEach(function(token) {

        /*
        * If token has a field for url, cycle through each url to determine
        * if it is the same as inputdomain. If it is, it's a Verified Domain
        */
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
