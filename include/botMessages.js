const { devDiscordId } = require('../config')

const needHelp = ' Utilise `!aeicbot` pour obtenir de l\'aide sur les commandes.'

const botMsg = {
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
