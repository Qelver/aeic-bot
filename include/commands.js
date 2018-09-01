'use strict'

const { database } = require('../config')
const util = require('./util')
const { getBotMsg } = require('./botMessages')
const { recupererEdt } = require('./getSchedule')
const sqlQueries = require('./sqlQueries')

// Until db is ready
const tempHomeworkDb = []
const sendHomeworkToDatabase = devoir => tempHomeworkDb.push(devoir)
const getHomeworkFromDatabase = () => tempHomeworkDb

// !aeic-bot-help
const aeicBotHelp = message =>
  message.channel.send(getBotMsg('aeic-bot-help'))

// !ajoutDevoir 2018-12-12 | Java | TP Breakout
const ajoutDevoir = message => {
  if (!util.isInRoleNameChannel(message.member.roles, message.channel.name))
    return message.channel.send(getBotMsg('channel-classe-seulement', message.author, '!ajoutDevoir'))

  const args = util.getCommandArgs(message.content.replace('!ajoutDevoir', '').trim())
  if (args.length >= 2) {
    const devoir = {}
    devoir.classe = message.channel.name
    devoir.auteur = `<@${message.author.id}>`
    devoir.date = args[0]
    devoir.matiere = args[1]
    devoir.contenu = args[2]

    sendHomeworkToDatabase(devoir)
    console.log(`Ajout d'un devoir pour la classe ${devoir.classe} par ${devoir.auteur}.`)
    message.channel.send(`**Un devoir a été ajouté** par ${devoir.auteur} : `
    + `Pour le \`${devoir.date}\` en \`${devoir.matiere}\` - \`${devoir.contenu}\``)
  }
  else message.channel.send(getBotMsg('manque-argument', message.author, '!ajoutDevoir'))
}

// !afficheDevoir
const afficheDevoir = message => {
  if (!util.isInRoleNameChannel(message.member.roles, message.channel.name))
    return message.channel.send(getBotMsg('channel-classe-seulement', message.author, '!afficheDevoir'))
  const devoirList = getHomeworkFromDatabase()
  if (devoirList.length > 0) {
    let msg = 'Liste des devoirs :\n'
    devoirList.forEach(devoir => {
      msg += `Auteur : ${devoir.auteur}. `
      + `Pour le \`${devoir.date}\` en \`${devoir.matiere}\`. `
      + `Contenu : \`${devoir.contenu}\`. `
      + '\n'
    })
    message.channel.send(msg.trim())
  }
}

// !choisirGroupe tp1a
const choisirGroupe = (message, serverInfo) => {
  const groupToAdd = message.content.replace('!choisirGroupe', '').trim()
  if (groupToAdd) {
    (async () => {

      const res = await database.query(sqlQueries.getRolesOfGroup, [groupToAdd])
      if (res.rowCount > 0) { // Le groupe existe
        const res2 = await database.query(sqlQueries.getAllRolesFromGroups)
        // On supprime tous les roles appartenant à des groupes
        util.setRole(serverInfo, message.author, false, ...res2.rows.map(x => x.role_name))

        // On ajoute les nouveaux roles
        setTimeout(() => {
          util.setRole(serverInfo, message.author, true, ...res.rows.map(x => x.role_name))
          message.channel.send(getBotMsg('role-groupe-ajoute', message.author))
        }, 2000) // Ajout de délais car on retire beaucoup de rôles avant : limite discord
      }
      else // Le groupe n'existe pas, on avertis le membre en listant les groupes possibles
        message.channel.send(await util.getAvailableGroupsStrErr(message))
    }).catch(err => util.catchedError(message, '!choisirGroupe', err))

  }
  else message.channel.send(getBotMsg('manque-argument', message.author, '!choisirGroupe'))
}

// !affichePlanning 1 1 b
const affichePlanning = message => {
  const msgContent = message.content.replace('!affichePlanning', '').trim()
  const args = util.getCommandArgs(msgContent)
  if (args.length >= 3) {
    if (parseInt(args[0], 10) && parseInt(args[1], 10)) {
      args[0] = parseInt(args[0], 10)
      args[1] = parseInt(args[1], 10)
      args[2] = args[2].toUpperCase()
      recupererEdt(args[0], args[1], args[2])
        .then(res => {
          const msg = `Voici l'emploi du temps pour Année ${args[0]} TD${args[1]} TP${args[2]} : `
          const scheduleStr = 'TODO'
          // TODO: Afficher le planning
          message.channel.send(`${msg}${scheduleStr}`)
        })
        .catch(err => util.catchedError(message, '!affichePlanning', err))
    }
    else message.channel.send(getBotMsg('argument-invalide', message.author, '!affichePlanning'))
  }
  else message.channel.send(getBotMsg('manque-argument', message.author, '!affichePlanning'))
}

const commandsList = {
  '!aeic-bot-help': {fn: aeicBotHelp, needServerInfo: false},
  '!ajoutDevoir': {fn: ajoutDevoir, needServerInfo: false},
  '!afficheDevoir': {fn: afficheDevoir, needServerInfo: false},
  '!affichePlanning': {fn: affichePlanning, needServerInfo: false},
  '!choisirGroupe': {fn: choisirGroupe, needServerInfo: true}
}

const searchCommand = (serverInfo, message) => {
  const usedCommand = Object.keys(commandsList).find(key => message.content.startsWith(key))
  if (usedCommand)
    commandsList[usedCommand].needServerInfo
      ? commandsList[usedCommand].fn(message, serverInfo)
      : commandsList[usedCommand].fn(message)
}

module.exports = {
  searchCommand
}
