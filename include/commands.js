'use strict'

const { rolesList } = require('../config')
const { getBotMsg } = require('./botMessages')
const { recupererEdt } = require('./getSchedule')

const isInRoleNameChannel = (rolesMap, channelName) => {
  channelName = channelName.toLowerCase()
  let found = false
  rolesMap.forEach(key => {
    if (key.name.toLowerCase() === channelName) found = true
  })
  return found
}

const getCommandArgs = msgContent => {
  let args = msgContent.split(' | ')
  args = args.map(x => x.trim())
  return args
}

// Until db is ready
const tempHomeworkDb = []
const sendHomeworkToDatabase = devoir => tempHomeworkDb.push(devoir)
const getHomeworkFromDatabase = () => tempHomeworkDb


const setRole = (serverInfo, user, setRoleBool, ...roles) => {
  roles.forEach(aRole => {
    const aRoleEle = serverInfo.roles.find('name', aRole)
    const userEle = serverInfo.members.get(user.id)
    if (aRoleEle && userEle)
      setRoleBool
        ? userEle.addRole(aRoleEle)
          .then(_ => console.log(`Ajout du role "${aRole}" à ${user.username} (ID=${user.id}).`))
          .catch(err => console.error(`Erreur lors de l'ajout du role "${aRole}" à ${user.username} (ID=${user.id}).`, err))
        : userEle.removeRole(aRoleEle)
          .then(_ => console.log(`Retrait du role "${aRole}" à ${user.username} (ID=${user.id}).`))
          .catch(err => console.error(`Erreur lors du retrait du role "${aRole}" à ${user.username} (ID=${user.id}).`, err))
  })
}

const getAvailableGroupsStrErr = message => {
  let groupsStr = ''
  Object.keys(rolesList.groups).forEach(key => groupsStr += `${key}, `)
  groupsStr = groupsStr.slice(0, -2) // Remove the last comma

  return getBotMsg('role-groupe-inexistant', message.author) +
    '\nLes groupes disponibles sont les suivants : ``` ' + groupsStr + '```'
}


// !ajoutDevoir 2018-12-12 | Java | TP Breakout | [facultatif]
const ajoutDevoir = message => {
  if (!isInRoleNameChannel(message.member.roles, message.channel.name))
    return message.channel.send(getBotMsg('channel-classe-seulement', message.author, '!ajoutDevoir'))

  const args = getCommandArgs(message.content)
  if (args.length >= 2) {
    const devoir = {}
    devoir.classe = message.channel.name
    devoir.auteur = `<@${message.author.id}>`
    devoir.date = args[0].replace('!ajoutDevoir ', '')
    devoir.matiere = args[1]
    devoir.contenu = args[2]
    devoir.facultatif = (args.length >= 3 && args[3] === 'facultatif')

    sendHomeworkToDatabase(devoir)
    console.log(`Ajout d'un devoir pour la classe ${devoir.classe} par ${devoir.auteur}.`)
    message.channel.send(`**Un devoir a été ajouté** par ${devoir.auteur} : `
    + `Pour le \`${devoir.date}\` en \`${devoir.matiere}\` - \`${devoir.contenu}\` - Ce devoir `
    + `${devoir.facultatif ? 'est' : 'n\'est pas'} facultatif.`)
  }
  else message.channel.send(getBotMsg('manque-argument', message.author, '!ajoutDevoir'))
}

const afficheDevoir = message => {
  if (!isInRoleNameChannel(message.member.roles, message.channel.name))
    return message.channel.send(getBotMsg('channel-classe-seulement', message.author, '!afficheDevoir'))
  const devoirList = getHomeworkFromDatabase()
  if (devoirList.length > 0) {
    let msg = 'Liste des devoirs :\n'
    devoirList.forEach(devoir => {
      msg += `Auteur : ${devoir.auteur}. `
      + `Pour le \`${devoir.date}\` en \`${devoir.matiere}\`. `
      + `Contenu : \`${devoir.contenu}\`. `
      + `${devoir.facultatif ? 'Facultatif' : 'Non facultatif'}.`
      + '\n'
    })
    message.channel.send(msg.trim())
  }
}

// !choisirGroupe tp1a
const choisirGroupe = (message, serverInfo) => {
  const groupToAdd = message.content.replace('!choisirGroupe ', '')
  const group = Object.keys(rolesList.groups).find(key => key === groupToAdd)
  if (group) { // Le groupe existe, on applique les rôles en supprimant tous les autres des groupes

    // On récupère la liste des groupes et les suppriment
    let groupRoles = []
    Object.keys(rolesList.groups).forEach(key => {
      rolesList.groups[key].forEach(gRole => {
        if (!groupRoles.find(x => x === gRole))
          groupRoles.push(gRole)
      })
    })
    setRole(serverInfo, message.author, false, ...groupRoles)
    setTimeout(() => {
      setRole(serverInfo, message.author, true, ...rolesList.groups[group])
      message.channel.send(getBotMsg('role-groupe-ajoute', message.author))
    }, 2000) // Ajout de délais car on retire beaucoup de rôles avant
  }
  else { // il n'existe pas, on avertis le membre en listant les groupes possibles
    message.channel.send(getAvailableGroupsStrErr(message))
  }
}

// !affichePlanning 1 1 b
const affichePlanning = message => {
  const msgContent = message.content.replace('!affichePlanning ', '')
  const args = getCommandArgs(msgContent)
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
        .catch(err => {
          message.channel.send(getBotMsg('erreur-non-decrite-log', null, '!affichePlanning', err.stack))
          console.error(`Erreur de la commande '!affichePlanning' :\n${err.stack}`)
        })
    }
    else message.channel.send(getBotMsg('argument-invalide', message.author, '!affichePlanning'))
  }
  else message.channel.send(getBotMsg('manque-argument', message.author, '!affichePlanning'))
}

const commandsList = {
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

module.exports = { searchCommand }
