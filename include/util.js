const { rolesList } = require('../config')
const { getBotMsg } = require('./botMessages')

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
  getBotMsg('role-groupe-inexistant', message.author) +
    '\nLes groupes disponibles sont les suivants : ``` ' + Object.keys(rolesList.groups).toString() + '```'

module.exports = {
  isInRoleNameChannel,
  getCommandArgs,
  setRole,
  getAvailableGroupsStrErr
}
