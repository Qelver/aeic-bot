'use strict'

const { database, devDiscordId, momentFormat } = require('../config')
const util = require('./util')
const { getBotMsg } = require('./botMessages')
const { recupererEdt } = require('./getSchedule')
const sqlQueries = require('./sqlQueries')
const https = require('https')
const querystring = require('querystring')
const url = require('url')
const moment = require('moment')


// Affiche l'aide du bot
// !aide
const aide = message =>
  message.channel.send(getBotMsg('aeic-bot-help'))

// Ajoute un devoir pour un groupe
// !ajouterDevoir tp1a | 2018-12-12 | Java | TP Breakout
const ajouterDevoir = message => {
  const args = message.content.replace(/!ajouterDevoir/i, '').trim().split(' | ').map(x => x.trim())
  if (args.length >= 4) {
    (async () => {
      const date = moment(args[1], momentFormat)
      if (!date.isValid())
        return message.channel.send(getBotMsg('mauvais-format-date', message.author))

      const params = [
        args[0], // 0 Groupe
        date.toDate().toDateString(), // 1 Date
        args[2], // 2 Cours
        args[3], // 3 Contenu
        message.author.id // 4 Id Discord auteur
      ]
      if (params.every(x => (x && x.hasOwnProperty('length') && x.length > 0))) {
        await database.query(sqlQueries.addHomework, params)
        console.log(`Ajout d'un devoir par ${message.author.username}. Groupe : ${params[0]}`)
        message.channel.send(`**Groupe ${params[0]}** Un devoir a été ajouté ! par <@${params[4]}>.\n`
        + `Pour le \`${date.format('DD/MM/YYYY')}\` en \`${params[2]}\`. `
        + `Contenu : \`\`\`${params[3]}\`\`\``)
      }
      else message.channel.send(getBotMsg('argument-invalide', message.author, '!ajouterDevoir'))
    })().catch(err => util.catchedError(message, '!ajouterDevoir', err))
  }
  else message.channel.send(getBotMsg('manque-argument', message.author, '!ajouterDevoir'))
}


// Affiche les devoirs d'un groupe
// !voirDevoir tp1a
const voirDevoir = message => {
  const groupName = message.content.replace(/!voirDevoir/i, '').trim()
  if (groupName.length > 0) {
    (async () => {
      const res = await database.query(sqlQueries.getHomework, [groupName])
      if (res.rowCount > 0) { // Il y a des devoirs pour ce groupe
        let msg = `**Groupe ${groupName}**. Liste des devoirs :\n`
        res.rows.forEach(homework => {
          const date = moment(homework.date, momentFormat).format('DD/MM/YYYY')

          // On ajoute le devoir au message
          msg += `Auteur : <@${homework.author_discord_id}>. `
          + `Pour le \`${date}\` en \`${homework.course}\`. `
          + `Contenu : \`${homework.content}\`.\n`
        })
        message.channel.send(msg)
      }
      else // Aucun devoir pour ce groupe (ou il n'existe pas)
        message.channel.send(getBotMsg('aucun-devoir'))
    })().catch(err => util.catchedError(message, '!voirDevoir', err))
  }
  else message.channel.send(getBotMsg('manque-argument', message.author, '!voirDevoir'))
}

// Vider les devoirs d'un groupe (Commande développeur)
// !viderDevoir tp1a
const viderDevoir = message => {
  if (message.author.id === devDiscordId) {
    const groupName = message.content.replace(/!viderDevoir/i, '').trim()
    if (groupName.length > 0) {
      (async () => {
        await database.query(sqlQueries.clearHomework, [groupName])
        message.channel.send(`Les devoirs du groupe \`${groupName}\` ont été supprimés.`)
      })().catch(err => util.catchedError(message, '!viderDevoir', err))
    }
    else message.channel.send(getBotMsg('manque-argument', message.author, '!viderDevoir'))
  }
  else message.channel.send(getBotMsg('commande-developpeur', message.author, '!viderDevoir'))
}

// Applique les rôles correspondants au groupe choisi
// !choisirGroupe tp1a
const choisirGroupe = (message, serverInfo) => {
  const groupToAdd = message.content.replace(/!choisirGroupe/i, '').trim()
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
  const maisonToAdd = message.content.replace(/!choisirMaison/i, '').trim()
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
// !planning 1 1 b
const planning = message => {
  const msgContent = message.content.replace(/!planning/i, '').trim()
  const args = util.getCommandArgs(msgContent)
  if (args.length >= 3) {
    if (parseInt(args[0], 10) && parseInt(args[1], 10)) {
      args[0] = parseInt(args[0], 10)
      args[1] = parseInt(args[1], 10)
      args[2] = args[2].toUpperCase()
      recupererEdt(args[0], args[1], args[2])
        .then(res => {
          if (res && res.length > 0) {
            const msg = `Voici l'emploi du temps pour Année ${args[0]} TD${args[1]} TP${args[2]} :\n`
            let scheduleStr = ''

            res.forEach(x => {
              const day = moment(x.dateDebut).format('DD/MM/YYYY')
              const hourStart = moment(x.dateDebut).format('HH[h]mm')
              const hourEnd = moment(x.dateFin).format('HH[h]mm')
              scheduleStr += `Le ${day}, de ${hourStart} à ${hourEnd} : `
              scheduleStr += `${x.groupe} de \`${x.nom}\` en \`${x.salle}\` par ${x.enseignant}.\n`
            })
            message.channel.send(`${msg}${scheduleStr}`.trim())
          }
          else message.channel.send(getBotMsg('planning-vide', message.author, '!planning'))
        })
        .catch(err => util.catchedError(message, '!planning', err))
    }
    else message.channel.send(getBotMsg('argument-invalide', message.author, '!planning'))
  }
  else message.channel.send(getBotMsg('manque-argument', message.author, '!planning'))
}

// Valide un code d'appairage Discord-Moodle https://github.com/rigwild/register-discord
// !relierDiscord code
const relierDiscord = message => {
  const code = message.content.replace(/!relierDiscord/i, '').trim()
  if (code) {
    const postData = querystring.stringify({
      pairCode: code,
      discordId: message.author.id
    })
    const options = {
      hostname: url.parse('https://register-discord.now.sh/linkDiscord').hostname,
      path: url.parse('https://register-discord.now.sh/linkDiscord').path,
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
  const toSearch = message.content.replace(/!trouverDiscord/i, '').trim()
  if (toSearch) {
    const separated = toSearch.split(' ');
    (async () => {
      if (separated.length === 2) { // Format "nom prénom" ou "prénom nom"
        const res = await database.query(sqlQueries.searchDiscordByName, [separated[0], separated[1]])
        if (res.rowCount > 0)
          message.channel.send(`Le profil Discord de "${separated[0]} ${separated[1]}" est <@${res.rows[0].discord_id}>. Reliez votre Discord à votre compte Moodle ici : https://register-discord.now.sh/`)
        else
          message.channel.send(`Le profil Discord de "${separated[0]} ${separated[1]}" n'a pas été trouvé. Reliez votre Discord à votre compte Moodle ici : https://register-discord.now.sh/`)
      }
      else { // Format "nom.prenom"
        const res = await database.query(sqlQueries.searchDiscordByMoodleUsername, [toSearch])
        if (res.rowCount > 0)
          message.channel.send(`Le profil Discord de "${toSearch}" est <@${res.rows[0].discord_id}>. Reliez votre Discord à votre compte Moodle ici : https://register-discord.now.sh/`)
        else
          message.channel.send(`Le profil Discord de "${toSearch}" n'a pas été trouvé. Reliez votre Discord à votre compte Moodle ici : https://register-discord.now.sh/`)
      }
    })().catch(err => util.catchedError(message, '!trouverDiscord', err))
  }
  else message.channel.send(getBotMsg('manque-argument', message.author, '!trouverDiscord'))
}

// Trouver le nom d'un membre du serveur via son Discord. (Commande développeur)
// !trouverNom @rigwild#5145
const trouverNom = message => {
  if (message.author.id === devDiscordId) {
    const toSearch = message.mentions.users.size > 0 ? message.mentions.users.map(x => x.id) : null
    if (toSearch) {
      (async () => {
        message.channel.send(`Hey <@${message.author.id}>, je t'ai envoyé en message privé le résultat de la commande. Reliez votre Discord à votre compte Moodle ici : https://register-discord.now.sh/`)

        let toSend = ''
        await Promise.all(toSearch.map(async (x, i) => {
          const res = await database.query(sqlQueries.searchNameByDiscord, [x])
          if (res.rowCount > 0)
            toSend += `Le nom de <@${x}> est "${res.rows[0].firstname} ${res.rows[0].lastname}".`
          else
            toSend += `Le nom de <@${x}> n'a pas été trouvé.`
          if (i < toSearch.length) toSend += '\n'
        }))
        message.author.send(toSend)

      })().catch(err => util.catchedError(message, '!trouverNom', err))
    }
    else message.channel.send(getBotMsg('argument-invalide', message.author, '!trouverNom'))
  }
  else message.channel.send(getBotMsg('commande-developpeur', message.author, '!trouverNom'))
}

// Trouve l'adresse mail d'un professeur
// !trouverMail synave
const trouverMail = message => {
  const toSearch = message.content.replace(/!trouverMail/i, '').trim()
  if (toSearch) {
    (async () => {
      const res = await database.query(sqlQueries.searchMail, [toSearch])
      if (res.rowCount > 0)
        message.channel.send(`L'adresse mail de M./Mme. "${toSearch}" est la suivante : \`${res.rows[0].mail_address}\``)
      else
        message.channel.send(`L'adresse mail de M./Mme. "${toSearch}" n'a pas été trouvé.`)
    })().catch(err => util.catchedError(message, '!trouverMail', err))
  }
  else message.channel.send(getBotMsg('manque-argument', message.author, '!trouverMail'))
}


const commandsList = {
  '!aide': {fn: aide, needServerInfo: false},
  '!ajouterDevoir': {fn: ajouterDevoir, needServerInfo: false},
  '!voirDevoir': {fn: voirDevoir, needServerInfo: false},
  '!planning': {fn: planning, needServerInfo: false},
  '!choisirGroupe': {fn: choisirGroupe, needServerInfo: true},
  '!choisirMaison': {fn: choisirMaison, needServerInfo: true},
  '!relierDiscord': {fn: relierDiscord, needServerInfo: false},
  '!trouverDiscord': {fn: trouverDiscord, needServerInfo: false},
  '!trouverNom': {fn: trouverNom, needServerInfo: false},
  '!trouverMail': {fn: trouverMail, needServerInfo: false},
  '!viderDevoir': {fn: viderDevoir, needServerInfo: false}
}

const searchCommand = (serverInfo, message) => {
  const usedCommand = Object.keys(commandsList).find(key =>
    message.content.toLowerCase().startsWith(key.toLowerCase()))

  if (usedCommand)
    commandsList[usedCommand].needServerInfo
      ? commandsList[usedCommand].fn(message, serverInfo)
      : commandsList[usedCommand].fn(message)
}

module.exports = {
  searchCommand
}
