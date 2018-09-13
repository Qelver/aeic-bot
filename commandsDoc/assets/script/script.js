'use strict'

const commands = [
  {
    name: '!choisirGroupe',
    description: 'Choisir son groupe de classe',
    example: `!choisirGroupe tp1a
    \nFormat : "tp + Année d'étude + Groupe de TP".`
  },
  {
    name: '!choisirMaison',
    description: 'Choisir sa maison',
    example: `!choisirMaison omega
    \nMaisons disponibles : Omega, Theta, Sigma ou Delta.`
  },
  {
    name: '!trouverDiscord',
    description: 'Mentionner un membre via son identifiant IUT',
    example: `!trouverDiscord sauvage.antoine
    \nFormat : "nom.prenom" (Identifiant IUT), "nom prénom" ou "prénom nom"`
  },
  {
    name: '!relierDiscord',
    description: 'Relier son compte Discord à son compte Moodle',
    example: `!relierDiscord code
    \nSe rendre sur cette page pour obtenir votre code : https://register-discord.now.sh/`
  },
  {
    name: '!planning',
    description: 'Afficher le planning d\'un groupe',
    example: `!planning 1 2 c
    \nFormat : Année [1], TD[2], TP[C]`
  },
  {
    name: '!trouverMail',
    description: 'Afficher le mail d\'un professeur de l\'IUT',
    example: `!trouverMail synave
    \nFormat : Nom de famille`
  },
  {
    name: '!ajouterDevoir',
    description: 'Ajouter un devoir à un groupe',
    example: `!ajouterDevoir tp1a | 2018-12-27 | Java | TP Breakout
    \nFormat : groupe, date, matière/module, contenu`
  },
  {
    name: '!afficherDevoir',
    description: 'Afficher la liste des devoirs d\'un groupe',
    example: '!afficherDevoir tp1a'
  }
]

const addCommandsEvents = commandDiv => {
  commandDiv.querySelectorAll('.command').forEach(x => {
    const symbolEle = x.querySelector('.symbol')
    const titleEle = x.querySelector('.commandTitle')
    const exampleEle = x.querySelector('.commandExample')
    titleEle.addEventListener('click', () => {
      const isHidden = exampleEle.classList.contains('hidden')
      symbolEle.classList.toggle('symbol-upside-down', isHidden)
      exampleEle.classList.toggle('hidden')
      x.classList.toggle('command-open', isHidden)
    })
  })
}

const createCommand = (name, description, example) => {
  const command = document.createElement('div')
  command.classList.add('command')


  const commandTitle = document.createElement('div')
  commandTitle.classList.add('commandTitle')

  const symbol = document.createElement('span')
  symbol.classList.add('symbol')

  const commandName = document.createElement('span')
  commandName.classList.add('commandName')
  commandName.appendChild(document.createTextNode(name))

  const commandDesc = document.createElement('span')
  commandDesc.classList.add('commandDesc')
  commandDesc.appendChild(document.createTextNode(description))


  const commandExample = document.createElement('span')
  commandExample.classList.add('commandExample', 'hidden')
  const exampleBreakLine = example.split('\n')
  exampleBreakLine.forEach((x, i) => {
    commandExample.appendChild(document.createTextNode(x))
    if (i !== example.length) commandExample.appendChild(document.createElement('br'))
  })


  commandTitle.appendChild(symbol)
  commandTitle.appendChild(commandName)
  commandTitle.appendChild(commandDesc)

  command.appendChild(commandTitle)
  command.appendChild(commandExample)

  return command
}

const showBotCommands = commandsDiv => {
  const commandsList = document.createElement('div')
  commands.forEach(x => {
    const ele = createCommand(x.name, x.description, x.example)
    commandsList.appendChild(ele)
  })
  commandsDiv.appendChild(commandsList)
  addCommandsEvents(commandsDiv)
}
