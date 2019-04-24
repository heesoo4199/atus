
// Using jQuery, read our data and call visualize(...) only once the page is ready:
$(function() {
  d3.csv("football.csv").then(function(data) {
    // Write the data to the console for debugging:
    console.log(data);

    // Call our visualize function:
    visualize(data);
  });
});


var visualize = function(data) {
    const config = {
        margin: {
            top: 50,
            right: 50,
            bottom: 100,
            left: 50
        },
        circleRadius: 5
    };

    config.width = 400 - config.margin.left - config.margin.right;
    config.height = 400 - config.margin.top - config.margin.bottom;
      
    const svg = d3.select(chartId)
        .append("svg")
        .attr("width", config.width + config.margin.left + config.margin.right)
        .attr("height", config.height + config.margin.top + config.margin.bottom)
        .style("width", config.width + config.margin.left + config.margin.right)
        .style("height", config.height + config.margin.top + config.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + config.margin.left + "," + config.margin.top + ")");

    const yScale = d3.scaleLinear()
        .range([config.height, 0])
        .domain([0, 5]);

    svg.append('g')
        .call(d3.axisLeft(yScale).ticks(5));

    const xScale = d3.scaleBand()
        .range([0, width])
        .domain(data.map((row) => row.opp))
        .padding(0.2)

    svg.append('g')
        .attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom(xScale))
        .selectAll("text")
        .attr("y", 0)
        .attr("x", 9)
        .attr("dy", ".35em")
        .attr("transform", "rotate(45)")
        .style("text-anchor", "start");

    svg.selectAll()
        .data(data)
        .enter()
        .append('rect')
        .attr('x', (row) => xScale(row.opp))
        .attr('y', (row) => yScale(row.ratio))
        .attr('height', (row) => height - yScale(row.ratio))
        .attr('width', xScale.bandwidth());

    svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "18px")
        .style("fill", "#417cf4")
        .style("text-decoration", "underline")  
        .text("Fighting Illini Win Percentage vs Most Played Teams");
};