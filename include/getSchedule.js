'use strict'

const { linkIcs } = require('../config')

/* Code by @minigugus */
const https = require('https')

const iso8601toUTCDate = textToParse =>
  new Date(Date.UTC(parseInt(textToParse.slice(0, 4)),
    parseInt(textToParse.slice(4, 6)) - 1,
    parseInt(textToParse.slice(6, 8)),
    parseInt(textToParse.slice(9, 11)),
    parseInt(textToParse.slice(11, 13)),
    parseInt(textToParse.slice(13, 15))))

const getEDT = () =>
  new Promise((resolve, reject) => {
    const dateFields = [ 'CREATED', 'LAST-MODIFIED', 'DTSTAMP', 'DTSTART', 'DTEND' ]
    let events = [], unparsedData
    https.get(linkIcs, (res) => {
      if (res.statusCode === 200) {
        res.on('data', (data) => {
          unparsedData += data
        })
        res.on('end', () => {
          if (unparsedData) {
            let posCour = 0, posSeparateur, posLigneSeparateur, ligne,
              eventCour = null,
              key = null, value = null
            while ((posSeparateur = unparsedData.indexOf('\n', posCour)) && posCour < posSeparateur) {
              ligne = unparsedData.slice(posCour, posSeparateur - 1)
              if (ligne.startsWith(' '))
                value += ligne.slice(1)
              else {
                if (key && value) {
                  if (key === 'BEGIN') {
                    if (value === 'VEVENT')
                      eventCour = {}
                  }
                  else if (key === 'END') {
                    if (eventCour)
                      events.push(eventCour)
                    eventCour = {}
                  }
                  else if (eventCour) {
                    if (key === 'DESCRIPTION') {
                      value = value.slice(2).split('\\n')
                      value.pop()
                    }
                    if (eventCour[key]) {
                      if (!Array.isArray(eventCour[key]))
                        eventCour[key] = [ eventCour[key] ]
                      eventCour[key].push(value)
                    }
                    else {
                      if (key && dateFields.indexOf(key) !== -1)
                        value = iso8601toUTCDate(value)
                      eventCour[key] = value
                    }
                  }
                }
                posLigneSeparateur = ligne.indexOf(':')
                if (posLigneSeparateur !== -1) {
                  key = ligne.slice(0, posLigneSeparateur)
                  value = ligne.slice(posLigneSeparateur + 1)
                }
                else {
                  key = null
                  value = null
                }
              }
              posCour = posSeparateur + 1
            }
            resolve(events)
          }
          else
            reject(new Error('Le serveur n\'a rien retourné.'))
        })
      }
      else
        reject(new Error(`La requête a échouée : Code d'erreur ${res.statusCode}.`))
    })
      .on('error', (err) => {
        reject(err)
      })
  })

const recupererEdt = (annee, numTd, numTp) => {
  numTp = numTp.toUpperCase()
  let resultat = [], groupes = {}
  groupes[`DUT INFO${annee}`] = 'CM'
  groupes[`DUT${annee} TD${numTd}`] = 'TD'
  groupes[`DUT${annee} TP${numTp}`] = 'TP'
  return getEDT()
    .then(events => {
      events.sort((a, b) => a.DTSTART - b.DTSTART)
      let dateCour = null, date, dateMin = Date.now()
      dateMin += 24 - (dateMin % (24 * 3600))
      for (let event of events)
        if (event.DTSTART >= dateMin && groupes[event.DESCRIPTION[0]]) {
          date = event.DTSTART.toLocaleDateString('fr-FR')
          if (dateCour === null)
            dateCour = date
          else if (date !== dateCour)
            break
          resultat.push({
            nom: event.SUMMARY,
            groupe: groupes[event.DESCRIPTION[0]],
            dateDebut: event.DTSTART,
            dateFin: event.DTEND,
            salle: event.LOCATION,
            enseignant: event.DESCRIPTION[event.DESCRIPTION.length - 1]
          })
        }
      return resultat
    })
}

module.exports = {
  recupererEdt
}
