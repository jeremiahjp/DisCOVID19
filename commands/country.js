const fetch = require('node-fetch');
const Discord = require("discord.js");
const AsciiTable = require("ascii-table");

module.exports = {
    name: "country",
    description: "Provides Coronavirus Disease (COVID-19) statistics on the provided country.",
    usage: "<country to search>",
    args: true,
    async run(client, message, args) {
        let countryUrl = `https://services1.arcgis.com/0MSEUqKaxRlEPj5g/ArcGIS/rest/services/ncov_cases/FeatureServer/2/query?where=Country_Region='${args}'&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=country_region%2C+Last_Update%2C+confirmed%2C+deaths%2C+recovered%2C+active&returnGeometry=true&featureEncoding=esriDefault&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnQueryGeometry=false&returnDistinctValues=false&cacheHint=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=pjson&token=`;
        const response = await fetch(countryUrl).then(r => r.json());

        if (!response.features.length) {
            const embed = new Discord.MessageEmbed()
            .setTitle('Nothing found!')
            .setDescription('```No Data found for this country.\n\nThe country does not exist, or was incorrectly typed.\n```')
            .setColor(client.colors.error)
            .setFooter("Data source: https://coronavirus.jhu.edu/map.html");
            message.channel.send(embed);
            return;
        }

        const countryAttributes = response.features[0].attributes;
        let asciiTable = new AsciiTable();
        let readableLastUpdate = new Date(countryAttributes.Last_Update)
        const dateOptions = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            dayPeriod: "short",
            timeZone: 'UTC',
            timeZoneName: 'short'
        };
        let readableDate = Intl.DateTimeFormat('en-US', dateOptions).format(readableLastUpdate);
        asciiTable
            .setHeading(`${countryAttributes.Country_Region}`, 'SARS CoV-2 Stats')
            .addRow("Confirmed", `${countryAttributes.Confirmed}`)
            .addRow("Deaths", `${countryAttributes.Deaths}`)
            .addRow("Recovered", `${countryAttributes.Recovered}`)
            .addRow("Active", `${countryAttributes.Active}`)
            .addRow("Last Updated", `${readableDate}`);

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