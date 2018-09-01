'use strict'

require('dotenv').config()

const discordAuthToken = process.env.discordAuthToken
const serverName = process.env.serverName
const devDiscordId = process.env.devDiscordId
const configNotificationsChannelId = process.env.configNotificationsChannelId
const linkIcs = process.env.linkIcs

const allRoles = [
  'Première Année',
  'Deuxième Année',
  'TP1A',
  'TP1B',
  'TP1C',
  'TP1D',
  'TP1E',
  'TP2A',
  'TP2B',
  'TP2C',
  'TP2D',
  'TP2E',
  'Omega',
  'Theta',
  'Sigma',
  'Delta'
]

const rolesList = {
  groups: {
    'tp1a': ['Première Année', 'TP1A'],
    'tp1b': ['Première Année', 'TP1B'],
    'tp1c': ['Première Année', 'TP1C'],
    'tp1d': ['Première Année', 'TP1D'],
    'tp1e': ['Première Année', 'TP1E'],
    'tp2a': ['Deuxième Année', 'TP2A'],
    'tp2b': ['Deuxième Année', 'TP2B'],
    'tp2c': ['Deuxième Année', 'TP2C'],
    'tp2d': ['Deuxième Année', 'TP2D'],
    'tp2e': ['Deuxième Année', 'TP2E']
  },
  clans: [
    'Omega',
    'Theta',
    'Sigma',
    'Delta'
  ],
  notifications: [
    'notif_esport_on',
    'notif_echecs_on'
  ]
}


module.exports = {
  discordAuthToken,
  serverName,
  allRoles,
  rolesList,
  linkIcs,
  devDiscordId,
  configNotificationsChannelId
}
