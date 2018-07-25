const levenshteintokens = require('./../tokens/tokens.json')
const config = require('./../config.js');
const leven = require('fast-levenshtein')

/*
* Check config.json and compare inputdomain to data in tokens.json based on levenshtein distance
*/
async function levenshteintest (inputdomain) {
    var output = {}
    var configdefaultstep = config.levenshteindefaultstep
    var configfirststep = config.levenshteinfirststep[0]
    var configfirstlength = config.levenshteinfirststep[1]
    var configsecondstep = config.levenshteinsecondstep[0]
    var configsecondlength = config.levenshteinsecondstep[1]
    var configthirdstep = config.levenshteinthirdstep[0]
    var configthirdlength = config.levenshteinthirdstep[1]
    var lengthtouse = 5

    /*
    * Uses data from config.js and length of inputdomain to determine what length to use.
    */
    if (inputdomain.length-1 <= configdefaultstep) {
        lengthtouse = configfirstlength
    }
    if (inputdomain.length-1 > configfirststep && inputdomain.length-1 <= configsecondstep) {
        lengthtouse = configsecondlength-1
    }
    if (inputdomain.length-1 > configsecondstep && inputdomain.length-1 <= configthirdstep) {
        lengthtouse = configsecondlength
    }
    if (inputdomain.length-1 > configthirdstep) {
        lengthtouse = configthirdlength
    }

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

    /*
    * If the smallest levenshtein edit distance is less than the calculated length to use (),
    * then mark the ouput json as result = true, and edit in the category and detecteddomain 
    */
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
