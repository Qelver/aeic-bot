'use strict'

const { database } = require('../config')
const util = require('./util')
const { getBotMsg } = require('./botMessages')
const { recupererEdt } = require('./getSchedule')
const sqlQueries = require('./sqlQueries')
const https = require('https')
const querystring = require('querystring')
const url = require('url')


// Affiche l'aide du bot
// !aide
const aide = message =>
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
      if (params.every(x => (x && x.hasOwnProperty('length') && x.length > 0))) {
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
        const rolesOfGroup = res.rows.map(x => x.role_name)

        // On supprime tous les roles appartenant à des groupes
        // On filtre les rôles du groupe à ajouter des rôles à supprimer
        // (On supprime les rôles AVANT, si on possède déjà le rôle, on économise 1 requête.)
        const rolesToRemove = res2.rows.map(x => x.role_name)
          .filter(x => !rolesOfGroup.find(y => y === x))

        await util.setRole(serverInfo, message.author, false, ...rolesToRemove)

        // On ajoute les nouveaux roles
        await util.setRole(serverInfo, message.author, true, ...rolesOfGroup)
        message.channel.send(getBotMsg('role-groupe-ajoute', message.author))
      }
      else // Le groupe n'existe pas, on avertis le membre en listant les groupes possibles
        message.channel.send(await util.getAvailableGroupsStrErr(message))
    })().catch(err => util.catchedError(message, '!choisirGroupe', err))
  }
  else message.channel.send(getBotMsg('manque-argument', message.author, '!choisirGroupe'))
}


// Applique le rôle correspondant au maison choisi
// !choisirMaison omega
const choisirMaison = (message, serverInfo) => {
  const maisonToAdd = message.content.replace('!choisirMaison', '').trim()
  if (maisonToAdd) {
    (async () => {

      const res = await database.query(sqlQueries.searchMaison, [maisonToAdd])
      if (res.rowCount > 0) { // La maison existe
        const res2 = await database.query(sqlQueries.getAllMaisons)
        // On supprime les roles des autres maisons
        const rolesToRemove = res2.rows
          .map(x => x.maison_name)
          .filter(x => x.toLowerCase() !== maisonToAdd.toLowerCase())

        await util.setRole(serverInfo, message.author, false, ...rolesToRemove)

        // On ajoute le nouveau rôle
        await util.setRole(serverInfo, message.author, true, ...res.rows.map(x => x.maison_name))
        message.channel.send(getBotMsg('role-maison-ajoute', message.author))
      }
      else // Le maison n'existe pas, on avertis le membre en listant les maisons possibles
        message.channel.send(await util.getAvailableMaisonsStrErr(message))
    })().catch(err => util.catchedError(message, '!choisirMaison', err))
  }
  else message.channel.send(getBotMsg('manque-argument', message.author, '!choisirMaison'))
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

// Valide un code d'appairage Discord-Moodle https://github.com/rigwild/register-discord
// !relierDiscord code
const relierDiscord = message => {
  const code = message.content.replace('!relierDiscord', '').trim()
  if (code) {
    const postData = querystring.stringify({code})
    const options = {
      hostname: url.parse('https://register-discord.now.sh/').hostname,
      path: url.parse('https://register-discord.now.sh/').path,
      port: 443,
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }
    let req = https.request(options, response => {
      let data = ''
      response.on('data', chunk => data += chunk)

      response.on('end', () => {
        data = JSON.parse(data)
        if (data.hasOwnProperty('success') && data.success)
          message.channel.send(getBotMsg('relier-discord-ok', message.author, '!relierDiscord'))
        else
          message.channel.send(getBotMsg('relier-discord-fail', message.author, '!relierDiscord'))
      })
    }).on('error', err => util.catchedError(message, '!relierDiscord', err))

    req.write(postData)
    req.end()
  }
  else message.channel.send(getBotMsg('manque-argument', message.author, '!relierDiscord'))
}

// Mentionne un membre du serveur via son "nom.prenom" ou "nom prénom" ou "prénom nom"
// !trouverDiscord sauvage.antoine
const trouverDiscord = message => {
  const toSearch = message.content.replace('!trouverDiscord', '').trim()
  if (toSearch) {
    const separated = toSearch.split(' ')
    (async () => {
      if (separated.length === 2) { // Format "nom prénom" ou "prénom nom"
        const res = await database.query(sqlQueries.searchDiscordByName, [separated[0], separated[1]])
        if (res.rowCount > 0)
          message.channel.send(`Le profil Discord de ${separated[0]} ${separated[1]} est <@${res.rows[0].discord_id}`)
        else
          message.channel.send(`Le profil Discord de ${separated[0]} ${separated[1]} n'a pas été trouvé.`)
      }
      else { // Format "nom.prenom"
        const res = await database.query(sqlQueries.searchDiscordByMoodleUsername, [toSearch])
        if (res.rowCount > 0)
          message.channel.send(`Le profil Discord de ${toSearch} est <@${res.rows[0].discord_id}`)
        else
          message.channel.send(`Le profil Discord de ${toSearch} n'a pas été trouvé.`)
      }
    })().catch(err => util.catchedError(message, '!trouverDiscord', err))
  }
  else message.channel.send(getBotMsg('manque-argument', message.author, '!trouverDiscord'))
}

// Trouve l'adresse mail d'un professeur
// !trouverMail synave
const trouverMail = message => {
  const toSearch = message.content.replace('!trouverMail', '').trim()
  if (toSearch) {
    (async () => {
      const res = await database.query(sqlQueries.searchMail, [toSearch])
      if (res.rowCount > 0)
        message.channel.send(`L'adresse mail de "${toSearch}" est la suivante : \`${res.rows[0].discord_id}\`.`)
      else
        message.channel.send(`L'adresse mail de "${toSearch}" n'a pas été trouvé.`)
    })().catch(err => util.catchedError(message, '!trouverMail', err))
  }
  else message.channel.send(getBotMsg('manque-argument', message.author, '!trouverMail'))
}


const commandsList = {
  '!aide': {fn: aide, needServerInfo: false},
  '!ajoutDevoir': {fn: ajoutDevoir, needServerInfo: false},
  '!afficheDevoir': {fn: afficheDevoir, needServerInfo: false},
  '!affichePlanning': {fn: affichePlanning, needServerInfo: false},
  '!choisirGroupe': {fn: choisirGroupe, needServerInfo: true},
  '!choisirMaison': {fn: choisirMaison, needServerInfo: true},
  '!relierDiscord': {fn: relierDiscord, needServerInfo: false},
  '!trouverDiscord': {fn: trouverDiscord, needServerInfo: false},
  '!trouverMail': {fn: trouverMail, needServerInfo: false}
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
