const request = require('request')
const json = require('json')

module.exports = class CodeLookup {

    lookup (domain) {
        return new Promise(function(resolve, reject) {
            var options = {
                uri: domain,
                method: 'GET'
            }
            request(options, {timeout: 15*1000}, function(error, response, body) {
                console.log(JSON.stringify(response))
                if (error || !([200, 301, 302].includes(response.statusCode))) {
                    console.log(error)
                    console.log(response.statusCode)
                    resolve(error)
                }

                else if (!error && response.statusCode == 200) {
                    console.log("Request worked correctly")
                    resolve(JSON.parse(body))
                }
            })
        })
    }
}
