'use strict'

const { database } = require('../config')
const { getBotMsg } = require('./botMessages')
const sqlQueries = require('./sqlQueries')

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

const setRole = (serverInfo, user, setRoleBool, ...roles) => {
  // On récupère les infos de l'user
  const userEle = serverInfo.members.get(user.id)
  if (userEle) {
    roles.forEach(aRole => {
      // On récupère les infos du rôle
      const aRoleEle = serverInfo.roles.find('name', aRole)
      if (aRoleEle) { // Role existe

        // On check si l'user possède déjà le rôle
        // Impossible d'utiliser array.find : c'est un Map.
        let userHasRole = false
        userEle.roles.forEach(x => {
          if (x.name === aRole) userHasRole = true
        })

        if (setRoleBool) { // On doit donner le rôle
          if (!userHasRole) { // Il ne possède pas le rôle
            return userEle.addRole(aRoleEle)
              .then(_ => console.log(`Ajout du role "${aRole}" à ${user.username} (ID=${user.id}).`))
              .catch(err => console.error(`Erreur lors de l'ajout du role "${aRole}" à ${user.username} (ID=${user.id}).`, err))
          }
        }
        else { // On doit retirer le rôle
          if (userHasRole) { // Il possède le rôle
            return userEle.removeRole(aRoleEle)
              .then(_ => console.log(`Retrait du role "${aRole}" à ${user.username} (ID=${user.id}).`))
              .catch(err => console.error(`Erreur lors du retrait du role "${aRole}" à ${user.username} (ID=${user.id}).`, err))
          }
        }
      }
    })
  }
}

const getAvailableGroupsStrErr = message =>
  database.query(sqlQueries.getAllGroups)
    .then(res =>
      getBotMsg('role-groupe-inexistant', message.author) +
      '\nLes groupes disponibles sont les suivants : ``` ' + res.rows.map(x => x.group_name).toString() + '```'
    )
    .catch(console.error)

const getAvailableClansStrErr = message =>
  database.query(sqlQueries.getAllClans)
    .then(res =>
      getBotMsg('role-clan-inexistant', message.author) +
      '\nLes clans disponibles sont les suivants : ``` ' + res.rows.map(x => x.clan_name).toString() + '```'
    )
    .catch(console.error)

const catchedError = (message, commandName, err) => {
  message.channel.send(getBotMsg('erreur-non-decrite-log', null, commandName, err.stack))
  console.error(`Erreur de la commande '${commandName}' :\n${err.stack}`)
}

const convertDate = date => {
  const res = new Date(date)
    .toLocaleString('en-us', {year: 'numeric', month: '2-digit', day: '2-digit'})
    .replace(/(\d+)\/(\d+)\/(\d+)/, '$3-$1-$2')
  return (res && res !== 'Invalid Date') ? res : null
}

module.exports = {
  isInRoleNameChannel,
  getCommandArgs,
  setRole,
  getAvailableGroupsStrErr,
  getAvailableClansStrErr,
  catchedError,
  convertDate
}
