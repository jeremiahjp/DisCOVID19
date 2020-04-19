const fetch = require('node-fetch');
const Discord = require("discord.js");
const AsciiTable = require("ascii-table");
const timeAgo = require("timeago.js");
const querystring = require('querystring');

module.exports = {
    name: "state",
    description: "Provides Coronavirus Disease (COVID-19) statistics on the provided state.",
    usage: "<state to search>",
    args: true,
    async run(client, message, args) {
        let state = args.join(" ");
        state = encodeURIComponent(state);
        state = state.replace(/'/g, '');
        let stateUrl = `https://services1.arcgis.com/0MSEUqKaxRlEPj5g/ArcGIS/rest/services/ncov_cases/FeatureServer/1/query?where=province_state='${state}'&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=Province_State%2C+Country_Region%2C+Last_Update%2C+Confirmed%2C+Recovered%2C+Deaths%2C+Active&returnGeometry=false&featureEncoding=esriDefault&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnQueryGeometry=false&returnDistinctValues=false&cacheHint=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=pjson&token=`;
        const response = await fetch(stateUrl).then(r => r.json());
        
        if (response.error) {
            const embed = new Discord.MessageEmbed()
            .setTitle(`JHU responded with error code ${response.error.code}`)
            .setDescription(`\`\`\`${response.error.message}\n\nLikely invalid characters in query.\`\`\``)
            .setColor(client.colors.errorSoft)
            .setFooter("Data source: https://coronavirus.jhu.edu/map.html");
            message.channel.send(embed);
            return;
        }

        if (!response.features.length) {
            const embed = new Discord.MessageEmbed()
            .setTitle('Nothing found!')
            .setDescription('```No Data found for this state.\n\nThe state does not exist, or was incorrectly typed.\n```')
            .setColor(client.colors.errorSoft)
            .setFooter("Data source: https://coronavirus.jhu.edu/map.html");
            message.channel.send(embed);
            return;
        }

        const stateAttributes = response.features[0].attributes;
        const timeSince = timeAgo.format(stateAttributes.Last_Update);
        let asciiTable = new AsciiTable();
        asciiTable
            .setHeading(`${stateAttributes.Province_State}, ${stateAttributes.Country_Region}`, 'SARS CoV-2 Stats')
            .addRow("Confirmed", `${stateAttributes.Confirmed}`)
            .addRow("Deaths", `${stateAttributes.Deaths}`)
            .addRow("Recovered", `${stateAttributes.Recovered}`)
            .addRow("Active", `${stateAttributes.Active}`)
            .addRow("Last Updated", `${timeSince}`);

        const titleString = `Coronavirus COVID-19 Cases by the Center for Systems Science and Engineering (CSSE) at Johns Hopkins University (JHU)`;
        const randomDecimalColor = Math.floor(Math.random() * 16777214+ 1);
        const description = `\`\`\`\n${asciiTable.toString()}\`\`\``;

        const embed = new Discord.MessageEmbed()
            .setTitle(titleString)
            .setDescription(description)
            .setColor(randomDecimalColor)
            .setFooter("Data source: https://coronavirus.jhu.edu/map.html");

        message.channel.send(embed);
    }
}