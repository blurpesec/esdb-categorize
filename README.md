# esdb-categorize

npm package to categorize domains for [EtherScamDB](https://etherscamdb.info)

Created by [blurpesec](https://twitter.com/blurpesec) of [MyCrypto](https://mycrypto.com)

###### To add:

```
npm install esdb-categorize
```

###### To run test:

```
npm test
```

###### Example test.js implementation:

```
const categorizedomain = require('./categorize.js');
const json = require('json');

categorize = new categorizedomain()
categorize.test("https://www.mycryptor.com/").then(function(output) {
    console.log(JSON.stringify(output, null, 2))
})
  ```

###### Output:

Outputs come in the form of a JSON object which contains some data

For verified domains:
```
{
  "input": "https://www.mycrypto.com/",
  "categorized": true,
  "idnhomograph": false,
  "detectedbytest": [
    "falsepositivetest"
  ],
  "category": "Verified Domain",
  "subcategory": "MyCrypto"
}
```

For categorized domains:
```
{
  "input": "https://www.verify.getbigeth.com/",
  "categorized": true,
  "idnhomograph": false,
  "detectedbytest": [
    "stringtokentest",
    "containsfiletest"
  ],
  "category": "Scamming",
  "subcategory": "Trust-Trading"
}
```

For uncategorized domains:
```
{
  "input": "https://www.mqsdadasroperas.com/",
  "categorized": false,
  "idnhomograph": false,
  "detectedbytest": []
}
```
