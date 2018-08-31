'use strict'

require('dotenv').config()

const discordAuthToken = process.env.discordAuthToken
const serverName = process.env.serverName

const rolesList = {
  groups: {
    '1tpa': ['Première Année', 'TP1A'],
    '1tpb': ['Première Année', 'TP1B'],
    '1tpc': ['Première Année', 'TP1C'],
    '1tpd': ['Première Année', 'TP1D'],
    '1tpe': ['Première Année', 'TP1E'],
    '2tpa': ['Deuxième Année', 'TP2A'],
    '2tpb': ['Deuxième Année', 'TP2B'],
    '2tpc': ['Deuxième Année', 'TP2C'],
    '2tpd': ['Deuxième Année', 'TP2D'],
    '2tpe': ['Deuxième Année', 'TP2E']
  },
  clans: [
    'omega',
    'theta',
    'sigma',
    'delta'
  ]
}


module.exports = {
  discordAuthToken,
  serverName,
  rolesList
}
