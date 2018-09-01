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
