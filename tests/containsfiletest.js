const filetokens = require('./../tokens/tokens.json')
const request = require('request')
const json = require('json')

/*
* tests tokens.json filenames against code pulled from website
*/
async function containsfiletest (inputdomain) {
    var output = {}
    var detected = false

    var result = await lookup (inputdomain)
    if (result.response === undefined) {
        output.result = false
        return output
    }
    else if (result.response.statusCode == 200) {
        filetokens.forEach(function(token) {
            if (token.filenames) {
                token.filenames.forEach(function(filename) {
                    if (result.body.indexOf(filename) > -1) {
                        output.result = true
                        output.category = token.category
                        output.subcategory = token.subcategory
                        detected = true
                        return output
                    }
                })
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
    }
    else if (!([200, 301, 302].includes(result.response.statusCode))) {
        output.result = false
        return output
    }
}

async function lookup (domain) {
    return new Promise(function(resolve, reject) {
        request(domain, {timeout: 15*1000}, function(error, response, body) {
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
