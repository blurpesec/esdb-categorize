const levenshteintokens = require('./../tokens/tokens.json')
const config = require('./../config.js');
const leven = require('fast-levenshtein')

/*
* Check config.json and compare data there
*/
async function levenshteintest (inputdomain) {
    var output = {}
    var configdefaultlength = config.levenshteindefaultlength
    var configfirststep = config.levenshteinfirststep[0]
    var configfirstlength = config.levenshteinfirststep[1]
    var configsecondstep = config.levenshteinsecondstep[0]
    var configsecondlength = config.levenshteinsecondstep[1]
    var configthirdstep = config.levenshteinthirdstep[0]
    var configthirdlength = config.levenshteinthirdstep[1]
    var lengthtouse

    /*
    * Uses data from config.js and length of inputdomain to determine what length to use.
    */
    if (inputdomain.length-1 <= configdefaultlength) {
        lengthtouse = configfirstlength
    }
    if (inputdomain.length-1 > configfirststep && inputdomain.length <= configsecondstep) {
        lengthtouse = configsecondlength-1
    }
    if (inputdomain.length-1 > configsecondstep && inputdomain.length <= configthirdstep) {
        lengthtouse = configsecondlength
    }
    if (inputdomain.length-1 > configthirdstep) {
        lengthtouse = configthirdlength
    }

    // Length to use has been determined based off of length of inputdomain.

    var calculatedlength = 0
    var detecteddomain
    var smallestlevenlength = 15

    // For each domain in levenshteintokens.json where the token has a url parameter, calculate the levenshtein distance
    levenshteintokens.forEach(function(token) {
        if(token.url) {
            calculatedlength = leven.get(inputdomain,token.url)

            /*
            * If the last calculation is less than the smallest length currently detected.
            * Set the smallestlength variable equal to the length detected and change the detected category to the token's category
            */
            if (calculatedlength < smallestlevenlength) {
                smallestlevenlength = calculatedlength
                detecteddomain = token.subcategory
            }
        }
    })

    if (smallestlevenlength <= lengthtouse) {
        output.result = true
        output.category = "Phishing"
        output.subcategory = detecteddomain
    }

    else if (smallestlevenlength > lengthtouse) {
        output.result = false
    }
    return output;
};
module.exports = levenshteintest
