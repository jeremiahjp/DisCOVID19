const fetch = require('node-fetch');
const Discord = require("discord.js");
const AsciiTable = require("ascii-table");
const timeAgo = require("timeago.js");
const decimalFormat = require("../../utils/decimalFormat");

module.exports = {
    name: "all",
    description: "Provides Coronavirus Disease (COVID-19) grand totals for all countries.",
    usage: "",
    args: false,
    async run(client, message, args) {
        let countryUrl = `https://services1.arcgis.com/0MSEUqKaxRlEPj5g/ArcGIS/rest/services/ncov_cases/FeatureServer/2/query?where=Country_Region+%3C%3E+null&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=Country_Region%2C+Confirmed%2C+Deaths%2C+Recovered%2C+Active%2CLast_Update&returnGeometry=false&featureEncoding=esriDefault&multipatchOption=none&maxAllowableOffset=&geometryPrecision=&outSR=&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnQueryGeometry=false&returnDistinctValues=false&cacheHint=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=pjson&token=`;
        const response = await fetch(countryUrl).then(r => r.json());

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
            .setTitle('Something happened')
            .setDescription('```Something happened. The dataset returned was empty.```')
            .setColor(client.colors.error)
            .setFooter("Data source: https://coronavirus.jhu.edu/map.html");
            message.channel.send(embed);
            return;
        }

        let totalConfirmed = 0;
        let totalDeaths = 0;
        let totalRecovered = 0;
        let totalActive = 0;
        let lastUpdated = 0;
        let previousLastUpdated = 0;
        for (let i = 0; i < response.features.length; i++) {
            totalConfirmed += response.features[i].attributes.Confirmed;
            totalDeaths += response.features[i].attributes.Deaths;
            totalRecovered += response.features[i].attributes.Recovered;
            totalActive += response.features[i].attributes.Active;
            lastUpdated = response.features[i].attributes.Last_Updated;
            response.features[i].attributes.Last_Updated > previousLastUpdated ? lastUpdated = response.features[i].attributes.Last_Updated : previousLastUpdated;
        }


        totalConfirmed = decimalFormat(totalConfirmed);
        totalDeaths = decimalFormat(totalDeaths);
        totalRecovered = decimalFormat(totalRecovered);
        totalActive = decimalFormat(totalActive);

        const timeSince = timeAgo.format(lastUpdated); //lastUpdated
        let asciiTable = new AsciiTable();
        asciiTable
            .setHeading(`All`, 'SARS CoV-2 Stats')
            .addRow("Confirmed", `${totalConfirmed}`)
            .addRow("Deaths", `${totalDeaths}`)
            .addRow("Recovered", `${totalRecovered}`)
            .addRow("Active", `${totalActive}`)
            .addRow("Last Updated", `${timeSince}`);

        const titleString = `Coronavirus COVID-19 Cases by the Center for Systems Science and Engineering (CSSE) at Johns Hopkins University (JHU)`;
        const randomDecimalColor = Math.floor(Math.random() * 16777214+ 1);
        const description = `\`\`\`\n${asciiTable.toString()}\`\`\``;

        const embed = new Discord.MessageEmbed()
            .setTitle(titleString)
            .setDescription(description)
            .setImage(`https://xtrading.io/static/layouts/qK98Z47ptC-embed.png?newest=${Date.now()}`)
            .setColor(randomDecimalColor)
            .setFooter("Data source: https://coronavirus.jhu.edu/map.html");

        message.channel.send(embed);
    }
}