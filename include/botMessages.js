const {
  devDiscordId,
  configNotificationsChannelId
} = require('../config')

const helpMsg =
`Pour configurer tes notifications rends-toi dans le channel <#${configNotificationsChannelId}>.

Voici la liste des commandes de l'AEIC-BOT :
\`!aeic-bot-help\` : Afficher ce message d'aide.
\`!choisirGroupe\` : Choisir son groupe de classe. Ex : \`!choisirGroupe tp1a\`
\`!affichePlanning\` : Afficher un planning. Ex : \`!affichePlanning tp1a\`
\`!ajoutDevoir\` : Ajouter un devoir. A utiliser dans son channel de classe. Ex : \`!ajoutDevoir 2018-12-12 | Java | TP Breakout\`
\`!afficheDevoir\` : Afficher la liste des devoirs. A utiliser dans son channel de classe.

Questions ? Suggestions ? MP le développeur de l'AEIC-BOT <@${devDiscordId}>.
Repository GitHub du bot (Node.js) : https://github.com/rigwild/aeic-bot.`

const needHelp = ' Utilise `!aeic-bot-help` pour obtenir de l\'aide sur les commandes.'

const botMsg = {
  'aeic-bot-help': helpMsg,
  'role-groupe-inexistant': 'Le groupe de classe indiqué n\'existe pas.',
  'role-groupe-ajoute': 'Les roles de groupe de classe ont été appliqués.',
  'channel-classe-seulement': 'La commande `#commandName#` n\'est utilisable que dans le channel de ta classe.',
  'manque-argument': 'Il manque des arguments à la commande `#commandName#`.' + needHelp,
  'argument-invalide': 'Les arguments entrés pour la commande `#commandName#` sont invalides.' + needHelp,
  'erreur-non-decrite': 'Une erreur non décrite s\'est produite. Help <@' + devDiscordId + '> ! Commande : `#commandName`',
  'erreur-non-decrite-log': 'Une erreur non décrite s\'est produite. Help <@' + devDiscordId + '> ! Commande : `#commandName#` ```#logMessage#```'
}

const msgExists = botMsgId => !!Object.keys(botMsg).find(x => x === botMsgId)

const getBotMsg = (botMsgId, msgAuthor, commandName, logMessage) => {
  let msgToSend = ''
  if (msgAuthor) msgToSend += `Hey <@${msgAuthor.id}> ! `
  msgToSend += msgExists(botMsgId) ? botMsg[botMsgId] : botMsg['erreur-non-decrite']
  if (commandName) msgToSend = msgToSend.replace('#commandName#', commandName)
  if (logMessage) msgToSend = msgToSend.replace('#logMessage#', logMessage)
  return msgToSend
}

module.exports = {
  getBotMsg
}
