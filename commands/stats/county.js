const fetch = require('node-fetch');
const Discord = require("discord.js");
const AsciiTable = require("ascii-table");
const timeAgo = require("timeago.js");
const stateAbbreviations = require('states-abbreviations');

module.exports = {
    name: "county",
    description: "Provides Coronavirus Disease (COVID-19) statistics on the provided county.",
    usage: "<county to search>",
    args: true,
    async run(client, message, args) {
        let cityOrCounty = args.join(" ");
        let state = '';
        cityOrCounty = cityOrCounty.includes('county') ? cityOrCounty.replace('county', '') : cityOrCounty;
        cityOrCounty = cityOrCounty.replace(/'/g, '');
        let cityOrCountryURL = `https://services1.arcgis.com/0MSEUqKaxRlEPj5g/ArcGIS/rest/services/ncov_cases_US/FeatureServer/0/query?where=admin2='${cityOrCounty}'&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=*&returnGeometry=true&featureEncoding=esriDefault&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnQueryGeometry=false&returnDistinctValues=false&cacheHint=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=pjson&token=`;
        if (cityOrCounty.includes(",")) {
            state = cityOrCounty.substring(cityOrCounty.indexOf(","));
            cityOrCounty = cityOrCounty.substring(0, cityOrCounty.indexOf(",")).trim();
            state = state.replace(",", "").trim();
            state = encodeURIComponent(state);
            state = state.replace(/'/g, '');
            state = stateAbbreviations[state.toUpperCase()] ? stateAbbreviations[state.toUpperCase()] : state;
            cityOrCountryURL = `https://services1.arcgis.com/0MSEUqKaxRlEPj5g/ArcGIS/rest/services/ncov_cases_US/FeatureServer/0/query?where=admin2='${cityOrCounty}'+and+Province_State='${state}'&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=*&returnGeometry=true&featureEncoding=esriDefault&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnQueryGeometry=false&returnDistinctValues=false&cacheHint=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=pjson&token=`;
        }

        const response = await fetch(cityOrCountryURL).then(r => r.json());

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
            .setDescription('```No data found for this county.\n\nThe county does not exist, or was incorrectly typed.\n```')
            .setColor(client.colors.error)
            .setFooter("Data source: https://coronavirus.jhu.edu/map.html");
            message.channel.send(embed);
            return;
        }


        else if (response.features.length > 1) {

            const embed = new Discord.MessageEmbed()
            .setTitle('Multiple city or county names found')
            .setDescription('```There are '+ response.features.length +' cities or counties with this name.\n\nTry again, specifying the state with a comma.\n\nExample: !covid19 county dallas, texas```')
            .setColor(client.colors.error)
            .setFooter("Data source: https://coronavirus.jhu.edu/map.html");
            message.channel.send(embed);
            return; 
        }

        const countryAttributes = response.features[0].attributes;
        const timeSince = timeAgo.format(countryAttributes.Last_Update);
        let asciiTable = new AsciiTable();
        asciiTable
            .setHeading(`${countryAttributes.Combined_Key}`, 'SARS CoV-2 Stats')
            .addRow("Confirmed", `${countryAttributes.Confirmed}`)
            .addRow("Deaths", `${countryAttributes.Deaths}`)
            .addRow("Recovered", `${countryAttributes.Recovered}`)
            .addRow("Active", `${countryAttributes.Active}`)
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