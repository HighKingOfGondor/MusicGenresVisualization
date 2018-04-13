//measurements
var width = 800;
var height = 775;
var margin = { top: 10, right: 10, bottom: 100, left: 50 };
var x = d3.scaleLinear().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

//axis
var dataXrange;
var dataYrange;
var xLabel;
var yLabel;

//chart variables
var chart;
var chartHeight;
var chartWidth;
var line = false;

//chart data visuals
var genres = [];
var publishers = [];
var displays = [];
var div = d3.select("body").append("div")   
    .attr("class", "tooltip")               
    .style("opacity", 0);


//data
var data;

init();

function set (genresPassed, publishersPassed, displaysPassed) {
    genres = genresPassed.slice(0);
    publishers = publishersPassed.slice(0);
    displays = displaysPassed.slice(0);
    if (displays.includes("Year")) {
        xLabel = "Year";
        yLabel = displays[1];
        line = true;
    } else {
        xLabel = displays[0];
        yLabel = displays[1];
        line = false;
    }
    console.log("set called");
    initChart();
    createAxis();
    drawDots();
}

function init() {

    chartWidth = width - margin.left - margin.right;
    chartHeight = height - margin.top - margin.bottom;
    d3.csv ("Video_Games_Sales_as_at_22_Dec_2016.csv", function (error, csv) {
        if (error) {
        return console.warn(error);
        } else {
            data = csv;
            data.forEach(function(d) {
                d.Global_Sales = +d.Global_Sales;
            });
            data.forEach(function(d) {
                d.Year_of_Release = +d.Year_of_Release;
            });
            data.forEach(function(d) {
                d.Critic_Score = +d.Critic_Score;
            });
            data.forEach(function(d) {
                d.User_Score = +d.User_Score;
            });
            console.log("CSV loaded");
        }
    })
}

function initChart () {
    chart = d3.select("#graph").append("svg")
        .attr("width", width)
        .attr("height", height);

    chart.plotArea = chart.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
}

function createAxis () {
    //load the ranges
    dataYrange = d3.extent(data, function (d) { 
        if (yLabel == "Year")
            return d.Year_of_Release;
        else if (yLabel == "Sales")
            return d.Global_Sales;
        else if (yLabel == "Critic Score") 
            return d.Critic_Score;
        else if (yLabel == "User Score")
            return d.User_Score;
    });
    dataXrange = d3.extent(data, function (d) { 
        if (xLabel == "Year")
            return d.Year_of_Release;
        else if (xLabel == "Sales")
            return d.Global_Sales;
        else if (xLabel == "Critic Score") 
            return d.Critic_Score;
        else if (xLabel == "User Score")
            return d.User_Score; 
    });


    // x axis
    chart.xScale = d3.scaleLinear()
        .domain([d3.min(dataXrange), d3.max(dataXrange)])
        .range([0, chartWidth]);

    chart.xAxis = d3.axisBottom()
        .ticks(10, "d")
        .scale(chart.xScale);

    chart.xAxisContainer = chart.append("g")
        //.attr("class", "xAxis")
        .attr("transform", "translate(" + (margin.left) + ", " + (chartHeight + margin.top) + ")")
        .call(chart.xAxis);

    // x axis header label
    chart.append("text")
        //.attr("class", "xAxis")
        .style("font-size", "12px")
        .attr("text-anchor", "middle")
        .attr("transform", "translate(" + (margin.left + chartWidth / 2.0) + ", " + (chartHeight + (margin.bottom / 2.0)) + ")")
        .text(xLabel);

    // y axis labels
    chart.yScale = d3.scaleLinear()
        .domain([0, d3.max(dataYrange)])
        .range([chartHeight, 0]);

    chart.yAxis = d3.axisLeft()
        .ticks(10, "d")
        .scale(chart.yScale);

    chart.yAxisContainer = chart.append("g")
        //.attr("class", "yAxis")
        .attr("transform", "translate(" + margin.left + ", " + margin.top + ")")
        .call(chart.yAxis);

    // y axis header label
    chart.append('text')
        .style("font-size", "12px")
        //.attr("class", "yAxis")
        .attr("text-anchor", "middle")
        .attr("transform", "translate(" + (margin.left / 2.0) + ", " + (chartHeight / 2.0) + ") rotate(-90)")
        .text(yLabel);
}

function drawDots () {
    chart.plotArea.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("r", 2.5)
        .attr("cx", function(d) { 
            if (xLabel == "Sales")
                return chart.xScale(d.Global_Sales);
            else if (xLabel == "Critic Score") 
                return chart.xScale(d.Critic_Score);
            else if (xLabel == "User Score")
                return chart.xScale(d.User_Score);  
        })
        .attr("cy", function(d) { 
            if (yLabel == "Sales")
                return chart.yScale(d.Global_Sales);
            else if (yLabel == "Critic Score") 
                return chart.yScale(d.Critic_Score);
            else if (yLabel == "User Score")
                return chart.yScale(d.User_Score); 
        })
        .style("fill", "steelblue")
        .style("stroke", "none")
        .on("mouseover", function(d) {      
            div.transition()        
                .duration(200)      
                .style("opacity", .9);      
            div.html(d.Name + "<br/>"  + d.Publisher + "<br/>"  + d.Developer + "<br/>"  + d.Year_of_Release + "<br/>"  + d.Rating)  
                .style("left", (d3.event.pageX) + "px")     
                .style("top", (d3.event.pageY - 28) + "px");    
            })                  
        .on("mouseout", function(d) {       
            div.transition()        
                .duration(500)      
                .style("opacity", 0);   
        });
}






// var margin = {top: 20, right: 20, bottom: 30, left: 50},
//     width = 940 - margin.left - margin.right,
//     height = 450 - margin.top - margin.bottom;
// var x;
// var y;
// var xAxis;
// var yAxis;
// var svg;
// var data;

// init();
// callData();
// initAxis();
// updateChart();

// function init () {
//   svg = d3.select("#graph").append("svg")
//     .attr("width", width + margin.left + margin.right)
//     .attr("height", height + margin.top + margin.bottom)
//     .append("g")
//     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
//   xAxis = d3.axisBottom(x).tickFormat(d3.format("d"));
//   yAxis = d3.axisLeft(y);
//   x = d3.scaleLinear().range([0, width]);
//   y = d3.scaleLinear().range([height, 0]);
// }

// function initAxis() {
//     x.domain([d3.min((data, function(d) { return d.Year_of_Release; })), d3.max((data, function(d) { return d.Year_of_Release;}))]);
//     y.domain([d3.min((data, function(d) { return d.Global_Sales; })), d3.max((data, function(d) { return d.Global_Sales;}))]);
//     svg.append("g")
//         .attr("class", "x axis")
//         .attr("transform", "translate(0," + height + ")")
//         .call(xAxis)
//       .append("text")
//           .attr("class", "label")
//           .attr("x", width/2)
//           .attr("y", 30)
//           .style("font-size", "14px")
//           .style("text-anchor", "middle")
//           .text("Year of Release");
//     svg.append("g")
//         .attr("class", "y axis")
//         .call(yAxis)
//       .append("text")
//         .attr("class", "label")
//           .attr("transform", "rotate(-90)")
//           .attr("x", -(height/2))
//           .attr("y", -22)
//         .style("font-size", "14px")
//       .style("text-anchor", "middle")
//       .text("Global Sales (millions)");
// }

// function callData () {
//   d3.csv("./Video_Games_Sales_as_at_22_Dec_2016.csv", function(error, csv) {
//     if (error) 
//       throw error;
//     data = csv;
//   });
// }

// function updateChart() {
//     svg.selectAll(".dot")
//         .data(data)
//         .enter().append("circle")
//           .attr("class", "dot")
//           .attr("r", 1.5)
//           .attr("cx", function(d) { return d.Year_of_Release; })
//           .attr("cy", function(d) { return d.Global_Sales; })
//           .style("fill", "steelblue")
//           .style("stroke", "none");
// }