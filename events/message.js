const Discord = require("discord.js");
const cooldowns = new Discord.Collection();

module.exports = (client, message) => {
    // Ignore all bots
    if (message.author.bot) return;

    // Ignore messages not starting with the prefix (in settings.js)
    if (!message.content.includes(client.settings.prefix))
        return;

    // Our standard argument/command name definition.
    const args = message.content.slice(client.settings.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    // Grab the command data from the client.commands Enmap
    const cmd = client.commands.get(command);

    // In the instance where someone provided usage was @bot as the prefix, we can use that.
    // NOT IMPLEMENTED
    const mentionPrefix = new RegExp(`^<@!?${client.user.id}>( |)$`);

    let prefix = client.settings.prefix;

    // If that command doesn't exist, silently exit and do nothing
    if (!cmd) {
        return message.channel.send(
            `\`\`\`Unrecognized command.\nCheck for typos and try again.\n\nFor help try: ${prefix} help\`\`\``
        );
    }
    // Check cooldowns. 5 second default cooldown
    if (!cooldowns.has(cmd.name)) {
        cooldowns.set(cmd.name, new Discord.Collection());
    }
    const now = Date.now();
    const timestamps = cooldowns.get(cmd.name);
    const cooldownAmount = (cmd.cooldown || 5) * 1000;
    if (!timestamps.has(message.author.id)) {
        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    } else {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.reply(
                `slow down champ. Wait ${timeLeft.toFixed(
                    1
                )} more second(s) before reusing the \`${cmd.name}\` command.`
            );
        }
        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    }

    // Check arguments, respond if incorrect usage
    if (prefix === client.settings.prefix) {
        if (cmd && !args[0] && cmd.args === true)
            return message.channel.send(
                `You didn't provide any arguments ${message.author}.\nCorrect Usage: \`${prefix} ${cmd.name} ${cmd.usage}\``
            );
    }

    // Run the command, reply with error message on error
    try {
        cmd.run(client, message, args);
    } catch (e) {
        console.error(e);
        message.reply("Yikes, you broke it. Error 0x69420");
    }
};