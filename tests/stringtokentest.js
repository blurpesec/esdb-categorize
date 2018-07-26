const stringtokens = require('./../tokens/tokens.json')



async function stringtokentest (inputdomain) {
    var output = {}
    var detected = false

    /*
    * For each object in tokens.json that has a tokens field, run through
    * and check for every stringtoken in the inputdomain name
    */
    stringtokens.forEach(function(strtoken) {
        if(strtoken.tokens) {
            strtoken.tokens.forEach(function(string) {

                /*
                * If inputdomain contains the stringtoken from the list,
                * mark it as detected
                */
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
