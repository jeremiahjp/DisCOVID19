const fetch = require('node-fetch');
const Discord = require("discord.js");
const covidTable = require("../../utils/covidTable.js");

module.exports = {
    name: "province",
    description: "Provides Coronavirus Disease (COVID-19) statistics on the provided province.",
    usage: "<province to search>",
    args: true,
    async run(client, message, args) {
        let province = args.join(" ");
        const msg = await message.channel.send(` Getting ${province}...`);
        let provinceUrl = `https://services1.arcgis.com/0MSEUqKaxRlEPj5g/ArcGIS/rest/services/ncov_cases2_v1/FeatureServer/3/query?where=province_state='${province}'&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=Province_State%2C+Country_Region%2C+Last_Update%2C+Confirmed%2C+active%2C+deaths%2C+recovered%2C+People_Tested%2C+People_Hospitalized%2C+Mortality_Rate+%2C+Incident_Rate&returnGeometry=false&featureEncoding=esriDefault&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnQueryGeometry=false&returnDistinctValues=false&cacheHint=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=pjson&token=`;

        const response = await fetch(provinceUrl).then(r => r.json());

        if (!response.features.length) {
            const embed = new Discord.MessageEmbed()
            .setTitle('Nothing found!')
            .setDescription('```No Data found for this state.\n\nThe state does not exist, or was incorrectly typed.\n```')
            .setColor(client.colors.errorSoft)
            .setFooter(`Data source: https://coronavirus.jhu.edu/map.html\nLatency: ${msg.createdTimestamp - message.createdTimestamp}ms`);
            return msg.edit("", embed);
        }

        const provinceAttributes = response.features[0].attributes;
        let asciiTable = new covidTable(provinceAttributes);

        const titleString = `Coronavirus COVID-19 Cases by the Center for Systems Science and Engineering (CSSE) at Johns Hopkins University (JHU)`;
        const randomDecimalColor = Math.floor(Math.random() * 16777214+ 1);
        const description = `\`\`\`\n${asciiTable.getCovidTable().toString()}\`\`\``;

        const embed = new Discord.MessageEmbed()
            .setTitle(titleString)
            .setDescription(description)
            .setColor(randomDecimalColor)
            .setFooter(`Data source: https://coronavirus.jhu.edu/map.html\nLatency: ${msg.createdTimestamp - message.createdTimestamp}ms`);
        return msg.edit("", embed);
    }
}