# DisCOVID19
A bot for Discord that utilizes John Hopkins rest service.

The John Hopkins visualization can be found here: https://coronavirus.jhu.edu/map.html

The ncov_cases REST service can be found here: https://services1.arcgis.com/0MSEUqKaxRlEPj5g/arcgis/rest/services/ncov_cases/FeatureServer

A simple usage for this bot could be seen as this:

# Usage
* !covid19 state New York
* !covid19 province Ontario
* !covid19 country Italy
* !covid19 county Dallas, Texas
* !covid19 help

# Usage Examples:
* !covid19 state new york

![Bot](https://i.imgur.com/SiPF9Ra.png)

* !covid19 country US

![Bot](https://i.imgur.com/1s4PUW9.png)

* !covid19 province ontario

![Bot](https://i.imgur.com/HzlEA2l.png)

You can also check specific US counties 
If the county has multiple results (county names are used multiple times fairly often: Washington, Union are some examples) then you need to specify with the state.
Rarely, you can query a city like this. It all depends on what JHU provides. 
Currently New York City is an example of one. 

* !covid19 county dallas, texas (this usage specifies the state. It MUST be comma state as the example).

![Bot](https://i.imgur.com/sPHenz2.png)

* !covid19 county new york city
* !covid19 county bexar

![Bot](https://i.imgur.com/t4PU2A2.png)









