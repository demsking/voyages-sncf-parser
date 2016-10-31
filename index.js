'use strict';

const lib = require('./lib')

const re_trip = /([a-zA-Z]+ \d+ [a-zA-Z]+)\s+(Aller|Retour)\s+(\d+h\d+)\s+([A-Z ]+)\s+([A-Z]+)\s+(\d{4})\s+[\w\s]*\s+(\d+h\d+)\s+([A-Z ]+)([\w\s]+passager\s+(\(\d+\s.\s\d+ ans\)))*/gm
const re_passager = /passager\s+(\(\d+\s.\s\d+ ans\))/gm
const re_type = /Billet (échangeable|non échangeable) et remboursable/gm
const re_refs = /Référence\s+de\s+dossier\s+:\s+([A-Z0-9]+)\s+Nom\s+associé\s+:\s+(.+)\s/gm
const re_custom = /\s(passagers|Carte Enfant\+)\s+(\d+,\d+)\s€/g

const parse = contents => {
    /**
     * trips and passengers
     */
    
    let trips = []
    let passengers = []
    const matches = lib.findAll(re_trip, contents)

    for (let item of matches) {
        let trip = {
            type: item[1],
            date: lib.parseDate(item[0]),
            trains: []
        }
        
        let train = {
            departureTime: item[2].replace(/h/, ':'),
            departureStation: item[3],
            arrivalTime: item[6].replace(/h/, ':'),
            arrivalStation: item[7],
            type: item[4],
            number: item[5],
        }
        
        trip.trains.push(train)
        trips.push(trip)
        
        if (item[9]) {
            const matches_passengers = lib.find(re_type, contents)
            
            if (!matches_passengers) {
                continue
            }
            
            passengers.push({
                type: matches_passengers[0],
                age: item[9]
            })
        }
    }

    let trains = trips[trips.length - 1].trains
    trains[trains.length - 1].passengers = passengers

    /**
     * code, name, details, custom
     */

    let custom = { prices: [] }

    const results = lib.findAll(re_custom, contents)

    for (let i = 0; i < results.length; i++) {
        custom.prices.push({ value: parseFloat(results[i][1].replace(/,/, '.'))})
    }

    const refs = lib.find(re_refs, contents)
    const price = lib.findPrice('TOTAL payé en ligne :', contents)
    const status = refs && price && trips.length ? 'ok' : 'error'

    return {
        status: status,
        result: {
            trips: [
                {
                    code: refs[0],
                    name: refs[1],
                    details: {
                        price: price,
                        roundTrips: trips
                    }
                }
            ],
            custom
        }
    }
}

const parseFile = filename => {
    return parse(lib.readFile(filename))
}

module.exports = {
    parse,
    parseFile
}
