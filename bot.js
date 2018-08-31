const Discord = require('discord.js')
const auth = require('./auth')
const commands = require('./commands')

const bot = new Discord.Client()

let disc

bot.on('ready', () => {
  disc = bot.guilds.find('name', '!Bot Tournoi') // Remplacer le nom par AEIC

  console.log('Bot Connecté')
  disc.channels.find('name', 'accueil').fetchMessages({ limit: 5 })
})

const rolesList = {
  '1tpa': ['Première Année', '1A'],
  '1tpb': ['Première Année', '1B'],
  '1tpc': ['Première Année', '1C'],
  '1tpd': ['Première Année', '1D'],
  '1tpe': ['Première Année', '1E'],
  '2tpa': ['Deuxième Année', '2A'],
  '2tpb': ['Deuxième Année', '2B'],
  '2tpc': ['Deuxième Année', '2C'],
  '2tpd': ['Deuxième Année', '2D'],
  '2tpe': ['Deuxième Année', '2E'],
  'omega': ['Omega'],
  'theta': ['Theta'],
  'sigma': ['Sigma'],
  'delta': ['Delta']
}

const setRole = (discord, user, setRoleBool, ...roles) => roles.forEach(aRole => {
  const aRoleEle = discord.roles.find('name', aRole)
  const userEle = disc.members.get(user.id)
  if (aRoleEle && userEle)
    setRoleBool
      ? userEle.addRole(aRoleEle)
        .then(_ => console.log(`Ajout du role "${aRole}" à ${user.username} (ID=${user.id}).`))
        .catch(err => console.error(`Erreur lors de l'ajout du role "${aRole}" à ${user.username} (ID=${user.id}).`, err))
      : userEle.removeRole(aRoleEle)
        .then(_ => console.log(`Retrait du role "${aRole}" à ${user.username} (ID=${user.id}).`))
        .catch(err => console.error(`Erreur lors du retrait du role "${aRole}" à ${user.username} (ID=${user.id}).`, err))
})

bot.on('messageReactionAdd', (reaction, user) => {
  if (
    reaction.message.channel.name === 'accueil' &&
    reaction.emoji.name &&
    rolesList.hasOwnProperty(reaction.emoji.name)
  )
    setRole(disc, user, true, ...rolesList[reaction.emoji.name])
})

bot.on('messageReactionRemove', (reaction, user) => {
  if (
    reaction.message.channel.name === 'accueil' &&
    reaction.emoji.name &&
    rolesList.hasOwnProperty(reaction.emoji.name)
  ) {
    setRole(disc, user, false, ...rolesList[reaction.emoji.name])
  }
})

bot.on('message', message => {
  commands.searchCommand(message)
})

bot.login(auth.discordToken)
