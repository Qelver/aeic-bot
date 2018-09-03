'use strict'

module.exports.getAllRoles = 'SELECT role_name FROM "role"'

module.exports.getAllGroups = 'SELECT group_name FROM "group"'

module.exports.getAllRolesFromGroups =
  `SELECT R.role_name FROM "role" R
  INNER JOIN role_group RG ON RG.id_role = R.id_role
  GROUP BY R.role_name`

module.exports.getRolesOfGroup =
  `SELECT R.role_name FROM "role" R
  INNER JOIN role_group RG ON RG.id_role = R.id_role
  INNER JOIN "group" G ON G.id_group = RG.id_group
  WHERE LOWER(G.group_name) = LOWER($1)`

module.exports.getAllMaisons = 'SELECT maison_name FROM maison'
module.exports.searchMaison = 'SELECT maison_name FROM maison WHERE LOWER(maison_name) = LOWER($1)'

module.exports.addHomework =
  `INSERT INTO homework (group_name, date, course, content, author_discord_id)
  VALUES ($1, $2, $3, $4, $5)`

module.exports.getHomework =
  `SELECT * FROM homework
  WHERE LOWER(group_name) = LOWER($1) AND date > current_date + 1
  ORDER BY date`

module.exports.getAllNotifications = 'SELECT notif_name FROM notification'

module.exports.searchDiscordByName =
`SELECT discord_id FROM discord_user
WHERE (LOWER(moodle_firstname) = LOWER($1) AND LOWER(moodle_lastname) = LOWER($2))
OR (LOWER(moodle_firstname) = LOWER($2) AND LOWER(moodle_lastname) = LOWER($1))`

module.exports.searchDiscordByMoodleUsername =
`SELECT discord_id FROM discord_user
WHERE LOWER(moodle_login) = LOWER($1)`

module.exports.searchMail = 'SELECT mail_address FROM mail_prof WHERE LOWER(prof_name) = LOWER($1)'

module.exports.clearHomework = 'DELETE FROM homework WHERE LOWER(group_name) = LOWER($1)'
