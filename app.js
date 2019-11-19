function makeResponsive() {

    // if the SVG area isn't empty when the browser loads,
    // remove it and replace it with a resized version of the chart
    var svgArea = d3.select("#scatter").select("svg");
  
    // clear svg is not empty
    if (!svgArea.empty()) {
      svgArea.remove();
      loadChart()
    }
// }  
  
 function loadChart() {
    // SVG wrapper dimensions are determined by the current width and
    // height of the browser window.
    var svgWidth = window.innerWidth;
    var svgHeight = window.innerHeight;
  
    var margin = {
      top: 50,
      bottom: 50,
      right: 50,
      left: 50
    };
  
    var height = svgHeight - margin.top - margin.bottom;
    var width = svgWidth - margin.left - margin.right;

    // Append SVG element
    var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);

    // Append group element
    var chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    d3.csv("assets/data.csv").then(function(healthData) {
        // if (error) return console.warn(error);

        console.log(healthData);

        healthData.forEach(function(data) {
          data.smokes = +data.smokes;
          data.age = +data.age;
        });

        // create scales
        var xLinearScale = d3.scaleLinear()
          .domain(d3.extent(healthData, d => d.age))
          .range([0, width]);

        var yLinearScale = d3.scaleLinear()
          .domain([8, d3.max(healthData, d => d.smokes)])
          .range([height, 0]);

        // create axes
        var xAxis = d3.axisBottom(xLinearScale);
        var yAxis = d3.axisLeft(yLinearScale);

        // append axes
        chartGroup.append("g")
          .attr("transform", `translate(0, ${height})`)
          .call(xAxis);

        chartGroup.append("g")
          .call(yAxis);

        chartGroup.selectAll("circle")
        .data(healthData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.age))
        .attr("cy", d => yLinearScale(d.smokes))
        .attr("r", "10")
        .attr("fill", "blue")
        .attr("stroke-width", "1")
        .attr("stroke", "black")
        .attr("opacity", ".5");

        chartGroup.append("g").selectAll("text")
        .data(healthData)
        .enter()
        .append("text")
        .text(d => d.abbr)
        .attr("x", d => xLinearScale(d.age))
        .attr("y", d => yLinearScale(d.smokes))
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "central")
        .attr("font_family", "sans-serif")
        .attr("font-size", "10px")
        .attr("fill", "white")
        .style("font-weight", "bold");

        chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top - 10})`)
        .attr("text-anchor", "middle")
        .attr("font-size", "16px")
        .attr("fill", "black")
        .text("Median Age");

        chartGroup.append("text")
        .attr("y", 0 - (margin.left / 2))
        .attr("x", 0 - (height / 2))
        .attr("text-anchor", "middle")
        .attr("font-size", "16px")
        .attr("fill", "black")
        .attr("transform", "rotate(-90)")
        .text("Percentage Who Smoke");

    })    

};

// When the browser loads, makeResponsive() is called.
makeResponsive();

// When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive);
