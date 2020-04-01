const Discord = require("discord.js");
const fs = require("fs");
const categories = fs.readdirSync("commands");

module.exports = {
    name: "help",
    description: "Detailed list of Discovid19's commands.",
    aliases: ["commands", "list"],
    cooldown: "15",
    usage: "[command name]",
    async run(client, message, args) {

        const msg = await message.channel.send(`Sending a list of all commands...`);
        const { commands } = message.client;
        const embed = new Discord.MessageEmbed()
            .setAuthor("Commands", "https://i.imgur.com/NVOshbv.png")
            .setDescription(`Help menu for Discovid19`)
            .setFooter(`For more information: ${client.settings.prefix} help <command>`)
            .setColor(client.colors.main);

        if (!args.length) {
            categories.forEach(async (category) => {
                const helpCommands = [];
                let categoryCommands = "";
                const commandsFile = fs.readdirSync(`commands/${category}`).filter(file => file.endsWith(".js"));

                for (let i = 0; i < commandsFile.length; i++) {
                    const commandName = commandsFile[i].split(".")[0];
                    helpCommands.push(`\`${commandName}\` `);
                }

                for (let i = 0; i < helpCommands.length; i++) categoryCommands += helpCommands[i];
                const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
                embed.addField(`${categoryName} (${commandsFile.length})`, categoryCommands);
            });
            await msg.edit("", embed);
        }
        else {

            if (!commands.has(args[0])) {
                return message.reply("That's not a valid command!");
            }
            const command = commands.get(args[0]);
            const embed = new Discord.MessageEmbed()
                .addField(`Name`,`${command.name}`);

            if (command.description) 
                embed.addField(`Description`, `${command.description}`);
            if (command.aliases) 
                embed.addField(`Aliases`, `${command.aliases.join(", ")}`);
            if (command.usage) 
                embed.addField(`Usage:`, `\`${client.settings.prefix} ${command.name} ${command.usage}\``);

            embed.addField(`Cooldown`, `${command.cooldown || 3} second(s)`);

            msg.delete();
            message.channel.send(embed);
        }
    },
};