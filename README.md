# voyages-sncf-parser
Parse a Voyages-SNCF confirmation email and extract data (customer, trips, prices)

[![Build Status](https://travis-ci.org/demsking/voyages-sncf-parser.svg?branch=master)](https://travis-ci.org/demsking/voyages-sncf-parser)

## Install

As a binary:

`npm install -g voyages-sncf-parser`

As a module:

`npm install --save voyages-sncf-parser`

## Usage
Shell:

```sh
$ voyages-sncf-parser email.html > result.json
```

In your project:

```js
const path = require('path')
const vsncf = require('voyages-sncf-parser')

const filename = path.join(__dirname, 'email.html')

// parsing from a file
const result = vsncf.parseFile(filename)

// parsing from a string
const result = vsncf.parse(contents)    // contents should be a plain text, not a HTML
```

## License

Under the MIT license. See [LICENSE](https://github.com/demsking/voyages-sncf-parser/blob/master/LICENSE) file for more details.
