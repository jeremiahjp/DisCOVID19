const AsciiTable = require("ascii-table");
const decimalFormat = require("./decimalFormat");
const timeAgo = require("timeago.js");

class CovidTable {
    constructor(attributes) {
        let  heading = attributes.Province_State != undefined && attributes.Country_Region != undefined ? `${attributes.Province_State}, ${attributes.Country_Region}` : `${attributes.Country_Region}`;
        heading = attributes.Admin2 ? `${attributes.Admin2}, ${attributes.Province_State}, ${attributes.Country_Region}` : heading;

        this.asciiTable = new AsciiTable()
            .setHeading(heading, 'SARS CoV-2 Stats')
            .addRow("People Tested", attributes.People_Tested === null ? 'N/A' : decimalFormat(attributes.People_Tested))
            .addRow("Confirmed", decimalFormat(`${attributes.Confirmed}`))
            .addRow("Recovered", decimalFormat(`${attributes.Recovered}`))
            .addRow("Active", decimalFormat(`${attributes.Active}`))
            .addRow("Deaths", decimalFormat(`${attributes.Deaths}`))
            .addRow("Mortality Rate", attributes.Mortality_Rate === undefined ? `${(attributes.Deaths/attributes.Confirmed*100).toFixed(2)}%` : `${attributes.Mortality_Rate.toFixed(2)}%`)
            .addRow("Incident Rate", decimalFormat(`${attributes.Incident_Rate.toFixed(0)} per 100,000`))
            .addRow("People Hospitalized", decimalFormat(attributes.People_Hospitalized === null ? 'N/A' : attributes.People_Hospitalized))
            .addRow("Last Updated", `${timeAgo.format(attributes.Last_Update)}`);
    }

    getCovidTable() { 
        return this.asciiTable;
    }
}

module.exports = CovidTable;
