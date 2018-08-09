'use strict'

const errors = {
  "channel-classe-seulement": "La commande `#commandName#` n'est utilisable que dans le channel de ta classe.",
  "manque-argument": "Il manque des arguments à la commande `#commandName#`.`",
  "erreur-non-decrite": "Une erreur non décrite s'est produite."
}
const errorExists = errorId => !!Object.keys(errors).find(x => x === errorId)

const getError = (errorId, msgAuthor, commandName) => {
  let error = ''
  if (msgAuthor) error += `Hey ${msgAuthor} ! `
  error += errorExists(errorId) ? errors[errorId] : errors["erreur-non-decrite"]
  if (commandName) error = error.replace('#commandName#', commandName)
  return error
}

//Until db is ready
const tempHomeworkDb = []
const sendHomeworkToDatabase = devoir => tempHomeworkDb.push(devoir)
const getHomeworkFromDatabase = () => tempHomeworkDb


const isInRoleNameChannel = (rolesMap, channelName) => {
  channelName = channelName.toLowerCase()
  let found = false
  rolesMap.forEach(key => { if (key.name.toLowerCase() === channelName) found = true })
  return found
}

const getCommandArgs = msgContent => {
  let args = msgContent.split(' | ')
  args = args.map(x => x.trim())
  return args
}

//!ajoutDevoir 2018-12-12 | Java | TP Breakout | [facultatif]
const ajoutDevoir = message => {
  if (!isInRoleNameChannel(message.member.roles, message.channel.name))
    return message.channel.send(getError("channel-classe-seulement", message.author.username, "!ajoutDevoir"))
  
  const args = getCommandArgs(message.content)
  if (args.length >= 2) {
    const devoir = {}
    devoir.classe = message.channel.name
    devoir.auteur = message.author.username
    devoir.date = args[0].replace('!ajoutDevoir ', '')
    devoir.matiere = args[1]
    devoir.contenu = args[2]
    devoir.facultatif = (args.length >= 3 && args[3] === 'facultatif')
    
    sendHomeworkToDatabase(devoir)
    console.log(`Ajout d'un devoir pour la classe ${devoir.classe} par ${devoir.auteur}.`)
    message.channel.send(`**Un devoir a été ajouté** par ${devoir.auteur} : `
    + `Pour le \`${devoir.date}\` en \`${devoir.matiere}\` - \`${devoir.contenu}\` - Ce devoir `
    + `${devoir.facultatif ? `est` : `n'est pas`} facultatif.`)
  }
  else message.channel.send("manque-argument", message.author.username, "!ajoutDevoir")
}

const afficheDevoir = message => {
  if (!isInRoleNameChannel(message.member.roles, message.channel.name))
    return message.channel.send(getError("channel-classe-seulement", message.author.username, "!afficheDevoir"))
  const devoirList = getHomeworkFromDatabase()
  if (devoirList.length > 0) {
    let msg = 'Liste des devoirs :\n'
    devoirList.forEach(devoir => {
      msg += `Auteur : ${devoir.auteur}. `
      + `Pour le \`${devoir.date}\` en \`${devoir.matiere}\`. `
      + `Contenu : \`${devoir.contenu}\`. `
      + `${devoir.facultatif ? `Facultatif` : `Non facultatif`}.`
      + `\n`
    })
    message.channel.send(msg.trim());
  }
}

const commandsList = {
  "!ajoutDevoir": ajoutDevoir,
  "!afficheDevoir": afficheDevoir
}

const searchCommand = message => {
  const usedCommand = Object.keys(commandsList).find(key => message.content.startsWith(key))
  if (usedCommand) {
    commandsList[usedCommand](message)
  }
}

module.exports = { searchCommand }
