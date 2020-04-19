const Discord = require("discord.js");

module.exports = {
  name: "stats",
  description: "Displays bot stats",
  cooldown: "5",
  async run (client, message, args) {
    const msg = await message.channel.send(` Gathering stats...`);
    const memUsed = process.memoryUsage().heapUsed / 1024 / 1024;
    const uptime = process.uptime();
    const actualSeconds = Math.floor(uptime % 60);
    const days = Math.floor((uptime % 31536000) / 86400);
    const hours = Math.floor((uptime / 3600) % 24);
    const mins = Math.floor((uptime / 60) % 60);
    const created = client.user.createdAt;
    const version = client.settings.version;
    const servers = client.guilds.cache.size;

    // Intentionally ignoring TOP.GG server, as its memberCount is inflating the count from servers that found the bot naturally
    const members = client.guilds.cache.reduce((prev, guild) => {
        return guild.id != '264445053596991498' ? prev + guild.memberCount : prev}, 0);
    const randomDecimalColor = Math.floor(Math.random() * 16777214+ 1);

    const statsEmbed = new Discord.MessageEmbed()
        .setAuthor("Discovid19", client.user.displayAvatarURL())
        .setColor(randomDecimalColor)
        .setThumbnail(client.settings.avatar)
        .addField("Created", created)
        .addField("Current Version", version, true)
        .addField("Servers", servers, true)
        .addField("Members", `${members} members`, true)
        .addField("Memory Used", `${Math.round(memUsed * 100) / 100}MB`, true)
        .addField("Uptime", `${days} days, ${hours} hours, ${mins} minutes, and ${actualSeconds} seconds`)
        .setFooter(`Latency ${msg.createdTimestamp - message.createdTimestamp}ms`)
        .setTimestamp();
    return msg.edit("", statsEmbed);
  },
};