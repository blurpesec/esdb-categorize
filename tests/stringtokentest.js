const stringtokens = require('./../tokens/tokens.json')



async function stringtokentest (inputdomain) {
    var output = {}
    var detected = false
    stringtokens.forEach(function(strtoken) {
        if(strtoken.tokens) {
            strtoken.tokens.forEach(function(string) {
                // If inputdomain contains the stringtoken from the list, mark as detected
                if (inputdomain.indexOf(string) > -1) {
                    var category = strtoken.category;
                    var subcategory = strtoken.subcategory;
                    output.result = true
                    output.category = category
                    output.subcategory = subcategory
                    detected = true
                    return output
                }
            })
        }
    })
    if (detected) {
        return output
    }
    output.result = false
    return output
}

module.exports = stringtokentest
