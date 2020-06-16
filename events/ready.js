const Discord = require("discord.js");
const cooldowns = new Discord.Collection();
const client = new Discord.Client();
const config = require("../config.json");

const DBL = require('dblapi.js');


module.exports = (client, message) => {
    const dbl = new DBL(config.dblToken, client);

    setInterval(() => {
        dbl.postStats(client.guilds.cache.size)
        .catch((reason) => {
            console.log(`Some server error occured: ${reason}`);
        });
    }, 60000);

    dbl.on('posted', () => {
        console.log('Top.gg server count posted successfully');
    })
  
    dbl.on('error', e => {
        console.log(`Something happened trying to update top.gg server count. ${e}`);
    })
};