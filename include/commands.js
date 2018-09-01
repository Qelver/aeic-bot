'use strict'

const { database } = require('../config')
const util = require('./util')
const { getBotMsg } = require('./botMessages')
const { recupererEdt } = require('./getSchedule')
const sqlQueries = require('./sqlQueries')


// Affiche l'aide du bot
// !aeic-bot-help
const aeicBotHelp = message =>
  message.channel.send(getBotMsg('aeic-bot-help'))

// Ajoute un devoir pour un groupe
// !ajoutDevoir tp1a | 2018-12-12 | Java | TP Breakout
const ajoutDevoir = message => {
  const args = util.getCommandArgs(message.content.replace('!ajoutDevoir', '').trim())
  if (args.length >= 4) {
    (async () => {
      const params = [
        args[0], // 0 Groupe
        util.convertDate(args[1]), // 1 Date
        args[2], // 2 Cours
        args[3], // 3 Contenu
        message.author.id // 4 Id Discord auteur
      ]
      if (params.every(x => x.length > 0)) {
        await database.query(sqlQueries.addHomework, params)
        console.log(`Ajout d'un devoir par ${message.author.username}. Groupe : ${params[0]}`)
        message.channel.send(`**Groupe ${params[0]}** Un devoir a été ajouté ! par <@${params[4]}>.\n`
        + `Pour le \`${params[1]}\` en \`${params[2]}\`. Contenu : \`\`\`${params[3]}\`\`\``)
      }
      else message.channel.send(getBotMsg('argument-invalide', message.author, '!ajoutDevoir'))
    })().catch(err => util.catchedError(message, '!ajoutDevoir', err))
  }
  else message.channel.send(getBotMsg('manque-argument', message.author, '!ajoutDevoir'))
}


// Affiche les devoirs d'un groupe
// !afficheDevoir tp1a
const afficheDevoir = message => {
  const groupName = message.content.replace('!afficheDevoir', '').trim()
  if (groupName.length > 0) {
    (async () => {
      const res = await database.query(sqlQueries.getHomework, [groupName])
      if (res.rowCount > 0) { // Il y a des devoirs pour ce groupe
        let msg = `**Groupe ${groupName}**. Liste des devoirs :\n`
        res.rows.forEach(homework => {
          const date = homework.date
          // On formate la date correctement
          let hDate = date.getFullYear() + '-'
          hDate += (date.getMonth() + 1).toString().padStart(2, '0') + '-'
          hDate += date.getDate().toString().padStart(2, '0')

          // On ajoute le devoir au message
          msg += `Auteur : <@${homework.author_discord_id}>. `
          + `Pour le \`${hDate}\` en \`${homework.course}\`. `
          + `Contenu : \`${homework.content}\`.\n`
        })
        message.channel.send(msg)
      }
      else // Aucun devoir pour ce groupe (ou il n'existe pas)
        message.channel.send(getBotMsg('aucun-devoir'))
    })().catch(err => util.catchedError(message, '!afficheDevoir', err))
  }
  else message.channel.send(getBotMsg('manque-argument', message.author, '!afficheDevoir'))
}

// Applique les rôles correspondants au groupe choisi
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
    })().catch(err => util.catchedError(message, '!choisirGroupe', err))
  }
  else message.channel.send(getBotMsg('manque-argument', message.author, '!choisirGroupe'))
}


// Applique le rôle correspondant au clan choisi
// !choisirClan omega
const choisirClan = (message, serverInfo) => {
  const clanToAdd = message.content.replace('!choisirClan', '').trim()
  if (clanToAdd) {
    (async () => {

      const res = await database.query(sqlQueries.searchClan, [clanToAdd])
      if (res.rowCount > 0) { // Le clan existe
        const res2 = await database.query(sqlQueries.getAllClans)
        // On supprime les roles des autres clans
        util.setRole(serverInfo, message.author, false, ...res2.rows.map(x => x.role_name))

        // On ajoute le nouveau rôle
        setTimeout(() => {
          util.setRole(serverInfo, message.author, true, ...res.rows.map(x => x.role_name))
          message.channel.send(getBotMsg('role-clan-ajoute', message.author))
        }, 2000) // Ajout de délais car on retire beaucoup de rôles avant : limite discord
      }
      else // Le clan n'existe pas, on avertis le membre en listant les clans possibles
        message.channel.send(await util.getAvailableClansStrErr(message))
    })().catch(err => util.catchedError(message, '!choisirClan', err))
  }
  else message.channel.send(getBotMsg('manque-argument', message.author, '!choisirClan'))
}


// Affiche l'emploi du temps demandé. Params : Année d'étude, Groupe de TD, Groupe de Tp
// !affichePlanning 1 | 1 | b
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
  '!choisirGroupe': {fn: choisirGroupe, needServerInfo: true},
  '!choisirClan': {fn: choisirClan, needServerInfo: true}
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
