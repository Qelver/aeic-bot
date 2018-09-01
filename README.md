# aeic-bot

This is a Node.js Discord bot made to manage the student association at the Calais's IUT.
The goal is to automate common tasks on the Discord server.


## Features
 - Manage roles which serves as a notification configuration system.
 - `!aeic-bot-help` : Show the bot help message.
 - `!ajoutDevoir` : Add a homework to a class group.
 - `!afficheDevoir` : Show the homeworks from a class group.
 - `!affichePlanning` : Show the schedule of a class group.
 - `!choisirGroupe` : Select a class group. The bot will delete old class groups.
 - `!choisirClan` : Select a student association clan. The bot will delete old clans.


## Usage
Show the bot help message.

    !aeic-bot-help

Select the class group `tp1a`

    !choisirGroupe tp1a

Select the student association clan `Omega`

    !choisirClan Omega

Show the schedule of Year `1`, Work Group `2`, Practical Work Group `C`

    !affichePlanning 1 | 2 | c

Add a homework for the class group `tp1a`, due the `2018-12-27`

    !ajoutDevoir tp1a | 2018-12-27 | Java | TP Breakout

Show the homework list from the class group `tp1a`

    !afficheDevoir tp1a


## Contributing
If you want to contribute to this project, follow these guidelines :

 1. Fork this repository
 2. Create a branch on your repository matching the name of what you want to add/fix
 3. Commit on your banch
 4. Submit a pull request to this repository

## License

This project is licensed under [the MIT license](https://github.com/rigwild/aeic-bot/blob/master/LICENSE).