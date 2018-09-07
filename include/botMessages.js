'use strict'

const {
  devDiscordId,
  configNotificationsChannelId
} = require('../config')

const welcomeMsgPrivate =
`**Ce message est automatique, je ne peux pas répondre aux messages privés.** :sweat_smile:

Bienvenue sur le Discord de l'**AEIC** ! Je suis l'**AEIC-BOT**. :robot:
Mes commandes te seront peut être utiles. Elles sont à utiliser **sur le serveur Discord de l'AEIC.**
Pour éviter de gêner les autres membres avec mes longs messages, pense à m'utiliser dans le channel **"ask_aeic_bot"**. :eyes:

Tu peux afficher la liste de mes commandes en utilisant la commande \`!aide\`. :book:
Il est par exemple possible de choisir ton groupe de classe, voir ton planning ou encore trouver le mail d'un prof (Et plein d'autres trucs).

Commence par choisir ton groupe de classe et ta maison d'asso (**sur le serveur discord AEIC**) :ok_hand:
\`!choisirGroupe tp1a\` ("tp" + Année d'étude + Groupe TP / OU ulco / OU invité)
\`!choisirMaison omega\` (Omega, Theta, Sigma ou Delta)

Ensuite, pense à relier ton compte Moodle (Compte IUT) à ton compte Discord pour pouvoir être retrouvé facilement sur le serveur : https://register-discord.now.sh/
Enfin, **Configure tes notifications** :bell:  dans le channel <#${configNotificationsChannelId}>.

Allez, j'arrête mon spam ! :nerd: Tu peux voir l'ensemble de mes commandes sur ce site : https://aeic.now.sh/.`

const welcomeMsgPublic = `Bienvenue à toi sur le Discord de l'AEIC !
Je t\'ai envoyé un message privé pour t\'expliquer mon fonctionnement. :wink:`

const helpMsg =
`Pour configurer tes notifications rends-toi dans le channel <#${configNotificationsChannelId}>.

Voici la liste des commandes de l'AEIC-BOT :
\`!aide\` : Afficher ce message d'aide.

\`!choisirGroupe\` : Choisir son groupe de classe. Ex : \`!choisirGroupe tp1a\` (Sinon ULCO ou invité)
\`!choisirMaison\` : Choisir sa maison. Ex : \`!choisirMaison Omega\`. Maisons disponibles : Omega, Theta, Sigma ou Delta.
\`!trouverDiscord\` : Mentionnez un membre du serveur Discord via son identifiant IUT \`nom.prenom\`, \`nom prénom\` ou \`prénom nom\` Ex : \`!trouverDiscord sauvage.antoine\`

Pour des raisons de lisibilité du chat, l'ensemble des commandes sont répertoriées ici : https://aeic.now.sh/.

Questions ? Suggestions ? MP le développeur de l'AEIC-BOT <@${devDiscordId}>.
Repository GitHub du bot (Node.js) : https://github.com/rigwild/aeic-bot.`

const needHelp = ' Utilise `!aide` pour obtenir de l\'aide sur les commandes.'

const botMsg = {
  'aeic-bot-help': helpMsg,
  'welcome-message-public': welcomeMsgPublic,
  'welcome-message-private': welcomeMsgPrivate,
  'role-groupe-inexistant': 'Le groupe de classe indiqué n\'existe pas.' + needHelp,
  'role-groupe-ajoute': 'Les rôles de groupe de classe ont été appliqués.',
  'role-maison-inexistant': 'La maison indiquée n\'existe pas.' + needHelp,
  'role-maison-ajoute': 'Le rôle de maison a été appliqué.',
  'channel-classe-seulement': 'La commande `#toReplace#` n\'est utilisable que dans le channel de ta classe.' + needHelp,
  'manque-argument': 'Il manque des arguments à la commande `#toReplace#`.' + needHelp,
  'argument-invalide': 'Les arguments entrés pour la commande `#toReplace#` sont invalides.' + needHelp,
  'aucun-devoir': 'Il n\'y a aucun devoir **enregistré** pour ce groupe.' + needHelp,
  'relier-discord-ok': 'Ton profil Discord a bien été relié à ton compte Moodle. Reliez votre Discord à votre compte Moodle ici : https://register-discord.now.sh/',
  'relier-discord-fail': 'Le code d\'appairage Discord-Moodle est invalide.' + needHelp + 'Reliez votre Discord à votre compte Moodle ici : https://register-discord.now.sh/',
  'planning-vide': 'Le planning pour ce groupe est vide. **Attention** ! Cela peut être un bug.' + needHelp,
  'commande-developpeur': 'La commande `#toReplace#` est réservée au développeur du bot. <@' + devDiscordId + '>',
  'mauvais-format-date': 'Le format de date est incorrect.',

  'erreur-non-decrite': 'Une erreur non décrite s\'est produite. Help <@' + devDiscordId + '> ! Commande : `#toReplace#`.',
  'erreur-non-decrite-log': 'Une erreur non décrite s\'est produite. Help <@' + devDiscordId + '> ! Commande : `#toReplace#`. ```#logMessage#```'
}

const msgExists = botMsgId => !!Object.keys(botMsg).find(x => x === botMsgId)

const getBotMsg = (botMsgId, userToMention, commandName, logMessage) => {
  let msgToSend = ''
  if (userToMention) msgToSend += `Hey <@${userToMention.id}> ! `
  msgToSend += msgExists(botMsgId) ? botMsg[botMsgId] : botMsg['erreur-non-decrite']
  if (commandName) msgToSend = msgToSend.replace('#toReplace#', commandName)
  if (logMessage) msgToSend = msgToSend.replace('#logMessage#', logMessage)
  return msgToSend
}

module.exports = {
  getBotMsg
}
