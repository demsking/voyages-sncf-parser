'use strict'

const fs = require('fs')
const htmlparser = require("htmlparser2")

const findAll = (re, text, onMatching) => {
    let index = 0
    let results = []
    
    while (index < text.length && index != -1) {
        const matches = re.exec(text)
        
        if (!matches) {
            break
        }
        
        index = matches.index
        
        results.push(matches.slice(1))
    }
    
    return results
}

const find = (re, text) => {
    const matches = re.exec(text)
    
    if (!matches) {
        return null
    }
    
    return matches.slice(1)
}

const findPrice = (prefix, text) => {
    const re = new RegExp(prefix + '\\s+(\\d+,\\d+)\\s*€', 'gm')
    const matches = re.exec(text)
    
    if (!matches) {
        return null
    }
    
    return parseFloat(matches[1].replace(/,/, '.'))
}

const months = {
    'Janvier': '01',
    'Février': '02',
    'Mars': '03',
    'Avril': '04',
    'Mai': '05',
    'Juin': '06',
    'Juillet': '07',
    'Août': '08',
    'Septembre': '09',
    'Octobre': '10',
    'Novembre': '11',
    'Décembre': '12'
}

const re_date = /(\d+)\s+([A-Za-z]+)/

const parseDate = (str) => {
    const matches = re_date.exec(str)
    
    const year = new Date().getFullYear()
    const month = months[matches[2]]
    const day = matches[1]
    const prefix = parseInt(day) < 10 ? '0' : ''
    
    return `${year}-${month}-${prefix}${day} 00:00:00.000Z`
}

const parseText = (html) => {
    let contents = ''
    
    const parser = new htmlparser.Parser({
        ontext: (text) => {
            text = text.trim()
            
            if (!text || text === '\\r\\n') {
                return
            }
            
            contents += text + '\n'
        }
    }, {decodeEntities: true})
    
    parser.write(html)
    parser.end()
    
    return contents
}

const readFile = (filename) => {
    return parseText(fs.readFileSync(filename, 'utf8'))
}

module.exports = {
    findAll, find, findPrice, parseText, readFile, parseDate
}
