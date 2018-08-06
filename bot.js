const Discord = require("discord.js");
const auth = require("./auth");

const bot = new Discord.Client();

let disc;

bot.on("ready", () => {
    disc = bot.guilds.find("name", "!Bot Tournoi"); // Remplacer le nom par AEIC
    console.log("Bot Connecté");
    disc.channels.find("name", "accueil").fetchMessages({ limit: 5 });

});


bot.on("messageReactionAdd", (reaction, user) => {

    let role;

    if (reaction.message.channel.name === "accueil") {

        switch (reaction.emoji.name) {
            case "1tpa":
                role = disc.roles.find("name", "Première Année");
                disc.members.get(user.id).addRole(role);
                role = disc.roles.find("name", "1A");
                disc.members.get(user.id).addRole(role);
                break;

            case "1tpb":
                role = disc.roles.find("name", "Première Année");
                disc.members.get(user.id).addRole(role);
                role = disc.roles.find("name", "1B");
                disc.members.get(user.id).addRole(role);
                break;

            case "1tpc":
                role = disc.roles.find("name", "Première Année");
                disc.members.get(user.id).addRole(role);
                role = disc.roles.find("name", "1C");
                disc.members.get(user.id).addRole(role);
                break;

            case "1tpd":
                role = disc.roles.find("name", "Première Année");
                disc.members.get(user.id).addRole(role);
                role = disc.roles.find("name", "1D");
                disc.members.get(user.id).addRole(role);
                break;

            case "1tpe":
                role = disc.roles.find("name", "Première Année");
                disc.members.get(user.id).addRole(role);
                role = disc.roles.find("name", "1E");
                disc.members.get(user.id).addRole(role);
                break;

            case "2tpa":
                role = disc.roles.find("name", "Deuxième Année");
                disc.members.get(user.id).addRole(role);
                role = disc.roles.find("name", "2A");
                disc.members.get(user.id).addRole(role);
                break;

            case "2tpb":
                role = disc.roles.find("name", "Deuxième Année");
                disc.members.get(user.id).addRole(role);
                role = disc.roles.find("name", "2B");
                disc.members.get(user.id).addRole(role);
                break;

            case "2tpc":
                role = disc.roles.find("name", "Deuxième Année");
                disc.members.get(user.id).addRole(role);
                role = disc.roles.find("name", "2C");
                disc.members.get(user.id).addRole(role);
                break;

            case "2app":
                role = disc.roles.find("name", "Deuxième Année");
                disc.members.get(user.id).addRole(role);
                role = disc.roles.find("name", "2APP");
                disc.members.get(user.id).addRole(role);
                break;

            case "omega":
                role = disc.roles.find("name", "Omega");
                disc.members.get(user.id).addRole(role);
                break;

            case "theta":
                role = disc.roles.find("name", "Theta");
                disc.members.get(user.id).addRole(role);
                break;

            case "sigma":
                role = disc.roles.find("name", "Sigma");
                disc.members.get(user.id).addRole(role);
                break;

            case "delta":
                role = disc.roles.find("name", "Delta");
                disc.members.get(user.id).addRole(role);
                break;

        }
    }
});

bot.on("messageReactionRemove", (reaction, user) => {
    let role;

    if (reaction.message.channel.name === "accueil") {

        switch (reaction.emoji.name) {
            case "1tpa":
                role = disc.roles.find("name", "Première Année");
                disc.members.get(user.id).removeRole(role);
                role = disc.roles.find("name", "1A");
                disc.members.get(user.id).removeRole(role);
                break;

            case "1tpb":
                role = disc.roles.find("name", "Première Année");
                disc.members.get(user.id).removeRole(role);
                role = disc.roles.find("name", "1B");
                disc.members.get(user.id).removeRole(role);
                break;

            case "1tpc":
                role = disc.roles.find("name", "Première Année");
                disc.members.get(user.id).removeRole(role);
                role = disc.roles.find("name", "1C");
                disc.members.get(user.id).removeRole(role);
                break;

            case "1tpd":
                role = disc.roles.find("name", "Première Année");
                disc.members.get(user.id).removeRole(role);
                role = disc.roles.find("name", "1D");
                disc.members.get(user.id).removeRole(role);
                break;

            case "1tpe":
                role = disc.roles.find("name", "Première Année");
                disc.members.get(user.id).removeRole(role);
                role = disc.roles.find("name", "1E");
                disc.members.get(user.id).removeRole(role);
                break;

            case "2tpa":
                role = disc.roles.find("name", "Deuxième Année");
                disc.members.get(user.id).removeRole(role);
                role = disc.roles.find("name", "2A");
                disc.members.get(user.id).removeRole(role);
                break;

            case "2tpb":
                role = disc.roles.find("name", "Deuxième Année");
                disc.members.get(user.id).removeRole(role);
                role = disc.roles.find("name", "2B");
                disc.members.get(user.id).removeRole(role);
                break;

            case "2tpc":
                role = disc.roles.find("name", "Deuxième Année");
                disc.members.get(user.id).removeRole(role);
                role = disc.roles.find("name", "2C");
                disc.members.get(user.id).removeRole(role);
                break;

            case "2app":
                role = disc.roles.find("name", "Deuxième Année");
                disc.members.get(user.id).removeRole(role);
                role = disc.roles.find("name", "2APP");
                disc.members.get(user.id).removeRole(role);
                break;

            case "omega":
                role = disc.roles.find("name", "Omega");
                disc.members.get(user.id).removeRole(role);
                break;

            case "theta":
                role = disc.roles.find("name", "Theta");
                disc.members.get(user.id).removeRole(role);
                break;

            case "sigma":
                role = disc.roles.find("name", "Sigma");
                disc.members.get(user.id).removeRole(role);
                break;

            case "delta":
                role = disc.roles.find("name", "Delta");
                disc.members.get(user.id).removeRole(role);
                break;
        }
    }
});

bot.login(auth.discordToken);