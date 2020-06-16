const Discord = require("discord.js");
const Enmap = require("enmap");
const fs = require("fs");
const config = require("./config.json");

const client = new Discord.Client();
const settings = require("./settings.js"); // Settings for prefix, and other info

// We also need to make sure we're attaching the settings to the CLIENT so it's accessible everywhere!
client.settings = settings;

fs.readdir("./events/", (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
        const event = require(`./events/${file}`);
        let eventName = file.split(".")[0];
        client.on(eventName, event.bind(null, client));
    });
});

client.commands = new Enmap();
client.colors = require("./data/colors.json");

const commands = fs.readdirSync("./commands/");
console.log(`Running bot on ` + new Date().toString());
try {
    commands.forEach(async category => {
        fs.readdir(`./commands/${category}/`, err => {
            if (err) 
                return console.error(err);
            const init = async () => {
                const commands = fs
                    .readdirSync(`./commands/${category}`)
                    .filter(file => file.endsWith(".js"));
                for (const file of commands) {
                    const command = require(`./commands/${category}/${file}`);
                    console.log(`Attempting to load command ${command.name}`);
                    client.commands.set(command.name, command);
                }
            };
            init();
        });
    });
} catch (error) {
  console.log(error);
}

client.login(config.discordToken);