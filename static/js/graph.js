queue()
    //utilises the queue library for asynchronous loading. Helpful when you are trying to get data
    // from multiple APIs for a single analysis. The queue function process that data hosted at the API
    // and inserts it into the apiData variable.
   .defer(d3.json, "/donorsUS/projects")
    .defer(d3.json, "/static/us-states.json")
   .await(makeGraphs);

function makeGraphs(error, projectsJson, statesJson) {

   //Clean projectsJson data
   var donorsUSProjects = projectsJson; //passes data inside projectsJson variable into dataSet variable.
   var dateFormat = d3.time.format("%Y-%m-%d %H:%M:%S");
   donorsUSProjects.forEach(function (d) {
       d["date_posted"] = dateFormat.parse(d["date_posted"]); //formats json date string to actual date
       d["date_posted"].setDate(1); //sets all project date days to 1.
       d["total_donations"] = +d["total_donations"]; //formats json number to actual number
   });


   //Create a Crossfilter instance
   var ndx = crossfilter(donorsUSProjects);

   //Create Dimensions based on the crossfilter instance
   var dateDim = ndx.dimension(function (d) {
       return d["date_posted"];
   });

   var resourceTypeDim = ndx.dimension(function (d) {
       return d["resource_type"];
   });
   var povertyLevelDim = ndx.dimension(function (d) {
       return d["poverty_level"];
   });
   var stateDim = ndx.dimension(function (d) {
       return d["school_state"];
   });
   var totalDonationsDim = ndx.dimension(function (d) {
       return d["total_donations"];
   });

   var fundingStatus = ndx.dimension(function (d) {
       return d["funding_status"];
   });

     var schoolCity = ndx.dimension(function (d) {
       return d["school_city"];
   });

    var primaryFocusAreaDim = ndx.dimension(function (d) {
       return d["primary_focus_area"];
   });





   //Calculate metrics
   var numProjectsByDate = dateDim.group();
   var numProjectsByResourceType = resourceTypeDim.group();
   var numProjectsByPovertyLevel = povertyLevelDim.group();
   var numProjectsByFundingStatus = fundingStatus.group();
    var numProjectsByCity = schoolCity.group();
    var numProjectsByPrimaryFocusArea = primaryFocusAreaDim.group();


   var totalDonationsByState = stateDim.group().reduceSum(function (d) {
       return d["total_donations"];
   });

    var primaryFocusAreaByDonation = primaryFocusAreaDim.group().reduceSum(function (d) {
       return d["total_donations"];
   });


    var stateGroup = stateDim.group();


   var all = ndx.groupAll();
   var totalDonations = ndx.groupAll().reduceSum(function (d) {
       return d["total_donations"];
   });

   var max_state = totalDonationsByState.top(1)[0].value;


   //Define values (to be used in charts)
   var minDate = dateDim.bottom(1)[0]["date_posted"];
   var maxDate = dateDim.top(1)[0]["date_posted"];


   //Charts: defines chart type objects using DC.js library & binds to charts to the div IDs in index.html
   var timeChart = dc.barChart("#time-chart");
   var resourceTypeChart = dc.rowChart("#resource-type-row-chart");
   var povertyLevelChart = dc.rowChart("#poverty-level-row-chart");
   var numberProjectsND = dc.numberDisplay("#number-projects-nd");
   var totalDonationsND = dc.numberDisplay("#total-donations-nd");
   var fundingStatusChart = dc.pieChart("#funding-chart");
    var cityChart = dc.pieChart("#city-chart");
    var fundingStatusmap = dc.geoChoroplethChart("#funding-map");
    var primaryFocusAreaChart = dc.pieChart("#focus-area");
    var primaryFocusAreaByTotalDonationsChart = dc.barChart("#focus-area2");





   selectField = dc.selectMenu('#menu-select')
       .dimension(stateDim)
       .group(stateGroup);

    selectField2 = dc.selectMenu('#menu-select2')
       .dimension(schoolCity)
       .group(numProjectsByCity);


   numberProjectsND
       .formatNumber(d3.format("d"))
       .valueAccessor(function (d) {
           return d;
       })
       .group(all);

   totalDonationsND
       .formatNumber(d3.format("d"))
       .valueAccessor(function (d) {
           return d;
       })
       .group(totalDonations)
       .formatNumber(d3.format(".3s"));

 timeChart
       .width(600)
       .height(260)
       .margins({top: 10, right: 50, bottom: 30, left: 50})
       .dimension(dateDim)
       .group(numProjectsByDate)
       .transitionDuration(500)
       .x(d3.time.scale().domain([minDate, maxDate]))
       .elasticY(true)
       .xAxisLabel("Year")
       .yAxis().ticks(5);


    primaryFocusAreaByTotalDonationsChart
        .width(600)
        .height(300)
        .margins({top: 10, right: 10, bottom: 100, left: 75})
        .dimension(primaryFocusAreaDim)
        .group(primaryFocusAreaByDonation)
        .x (d3.scale.ordinal().domain(resourceTypeDim))
        .xUnits(dc.units.ordinal)
        .elasticY(true)
        .yAxis().ticks(8);


    povertyLevelChart
       .width(600)
       .height(300)
       .dimension(povertyLevelDim)
       .group(numProjectsByPovertyLevel)
       .xAxis().ticks(10);


    resourceTypeChart
       .width(380)
       .height(250)
       .dimension(resourceTypeDim)
       .group(numProjectsByResourceType)
       .xAxis().ticks(5);


   fundingStatusChart //piechart
       .height(250)
       .width (280)
       .radius(100)
       .innerRadius(40)
       //.transitionDuration(1500)
       .dimension(fundingStatus)
        .ordinalColors(["red", "blue", "white"])
        .group(numProjectsByFundingStatus);


    primaryFocusAreaChart //piechart
       .height(250)
        .width(470)
       .radius(100)
       .innerRadius(0)
       .transitionDuration(1500)
       .dimension(primaryFocusAreaDim)
       .group(numProjectsByPrimaryFocusArea)
        .legend(dc.legend().x(350).y(60).gap(7))
        .renderLabel(false);




    cityChart
       .height(500)
        .width(500)
       .radius(200)
       .innerRadius(0)
       .transitionDuration(1500)
       .dimension(schoolCity)
       .group(numProjectsByCity)


    fundingStatusmap
        .width(900)
        .height(315)
        .dimension(stateDim)
        .group(totalDonationsByState)
        //.colors(["#E2F2FF", "#C4E4FF", "#9ED2FF", "#81C5FF", "#6BBAFF", "#51AEFF", "#36A2FF", "#1E96FF", "#0089FF", "#7C151D"])
        .colorDomain([0, max_state])
        .overlayGeoJson(statesJson["features"], "state", function (d) {
            return d.properties.name;
        })
        .projection(d3.geo.albersUsa()
            .scale(600)
            .translate([340, 150]))
        .title(function (p) {
            return "State: " + p["key"]
                + "\n"
                + "Total Donations: US$" + Math.round(p["value"]);
        });

   dc.renderAll();
}