const stringtokens = require('./../tokens/tokens.json')
const request = require('request')
const json = require('json')

/*
* tests tokens.json strings against code pulled from inputdomain
*/
async function containsfiletest (inputdomain) {
    var output = {}
    var detected = false

    inputdomain = "http://" + inputdomain

    /* Lookup inputdomain */
    var res = await lookup (inputdomain)
    if ( res.response.statusCode === 301 ) {

        res = await lookup(inputdomain.replace("http://","https://"))
    }

    /* Check if request failed */
    if (res.response === undefined || res.response === '' || ([301, 302].includes(res.response.statusCode))) {
        output.result = false
        return output
    }

    /* If request was successful */
    if (res.response.statusCode == 200) {
        /* search for each filename/string-token in tokens.json */
        stringtokens.forEach(function(token) {
            if (token.strings) {
                token.strings.forEach(function(filename) {
                    if (res.body.indexOf(filename) > -1) {
                        output.result = true
                        output.category = token.category
                        output.subcategory = token.subcategory
                        detected = true
                        return output
                    }
                })
            }
            if (detected) {
                output.result = true
                return output
            }
        })
        if (detected) {
            output.result = true
            return output
        }
        else {
            output.result = false
            return output
        }
    }/*
    else if (!([200, 301, 302].includes(res.response.statusCode))) {
        output.result = false
        return output
    }*/
}

async function lookup (domain) {
    return new Promise(function(resolve, reject) {
        var options = { uri: domain, followRedirect: false, followRedirects: false, headers: { 'User-Agent': 'request' } }
        request.get(options, function(error, response, body) {

            if (error || !([200, 301, 302].includes(response.statusCode))) {
                resolve({response, body})
            }

            else if (!error && response.statusCode == 200) {
                resolve({response, body})
            }
            resolve({response, body})
        })
    })
}

module.exports = containsfiletest
