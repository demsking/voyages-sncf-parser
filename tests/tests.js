'use strict'

const fs = require('fs'),
      path = require('path'),
      mocha = require('mocha'),
      assert = require('assert'),
      lib = require('../')

const info = require('../package.json')
const result = require('./result.json')
const filename = path.join(__dirname, 'email.html')

describe(info.name, () => {
    it('should parse email and return a correct object', (next) => {
        assert.deepEqual(lib.parseFile(filename), result)
        
        next()
    })
})
