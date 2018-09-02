'use strict'

const {
  devDiscordId,
  configNotificationsChannelId
} = require('../config')

const welcomeMsg =
`Bienvenue sur le Discord de l'**AEIC** ! Je suis l'**AEIC-BOT**.
Tu peux afficher la liste de mes commandes en utilisant la commande \`!aeic-bot-help\`.
Il est par exemple possible de choisir ton groupe de classe, ajouter/afficher les devoirs ou encore voir ton planning.

**Configure tes notifications** dans le channel <#${configNotificationsChannelId}>.`

const helpMsg =
`Pour configurer tes notifications rends-toi dans le channel <#${configNotificationsChannelId}>.

Voici la liste des commandes de l'AEIC-BOT :
\`!aeic-bot-help\` : Afficher ce message d'aide.
\`!choisirGroupe\` : Choisir son groupe de classe. Ex : \`!choisirGroupe tp1a\`

\`!choisirClan\` : Choisir son clan. Ex : \`!choisirClan Omega\`. Clans : Omega, Theta, Sigma et Delta.

\`!affichePlanning\` : Afficher un planning. Ex : \`!affichePlanning 1 | 2 | c\` (Année 1, TD2, TPC)

\`!ajoutDevoir\` : Ajouter un devoir. Ex : \`!ajoutDevoir tp1a | 2018-12-27 | Java | TP Breakout\`
\`!afficheDevoir\` : Afficher la liste des devoirs. Ex : \`!afficheDevoir tp1a\`

Questions ? Suggestions ? MP le développeur de l'AEIC-BOT <@${devDiscordId}>.
Repository GitHub du bot (Node.js) : https://github.com/rigwild/aeic-bot.`

const needHelp = ' Utilise `!aeic-bot-help` pour obtenir de l\'aide sur les commandes.'

const botMsg = {
  'aeic-bot-help': helpMsg,
  'welcome-message': welcomeMsg,
  'role-groupe-inexistant': 'Le groupe de classe indiqué n\'existe pas.' + needHelp,
  'role-groupe-ajoute': 'Les rôles de groupe de classe ont été appliqués.',
  'role-clan-inexistant': 'Le clan indiqué n\'existe pas.' + needHelp,
  'role-clan-ajoute': 'Le rôle de clan a été appliqué.',
  'channel-classe-seulement': 'La commande `#commandName#` n\'est utilisable que dans le channel de ta classe.' + needHelp,
  'manque-argument': 'Il manque des arguments à la commande `#commandName#`.' + needHelp,
  'argument-invalide': 'Les arguments entrés pour la commande `#commandName#` sont invalides.' + needHelp,
  'aucun-devoir': 'Il n\'y a aucun devoir **enregistré** pour ce groupe.' + needHelp,
  'erreur-non-decrite': 'Une erreur non décrite s\'est produite. Help <@' + devDiscordId + '> ! Commande : `#commandName`.',
  'erreur-non-decrite-log': 'Une erreur non décrite s\'est produite. Help <@' + devDiscordId + '> ! Commande : `#commandName#`. ```#logMessage#```'
}

const msgExists = botMsgId => !!Object.keys(botMsg).find(x => x === botMsgId)

const getBotMsg = (botMsgId, userToMention, commandName, logMessage) => {
  let msgToSend = ''
  if (userToMention) msgToSend += `Hey <@${userToMention.id}> ! `
  msgToSend += msgExists(botMsgId) ? botMsg[botMsgId] : botMsg['erreur-non-decrite']
  if (commandName) msgToSend = msgToSend.replace('#commandName#', commandName)
  if (logMessage) msgToSend = msgToSend.replace('#logMessage#', logMessage)
  return msgToSend
}

module.exports = {
  getBotMsg
}
