
// Using jQuery, read our data and call visualize(...) only once the page is ready:
$(function() {
  d3.csv("example.csv").then(function(data) {
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

    const svg = d3.select("#chart")
        .append("svg")
        .attr("width", config.width + config.margin.left + config.margin.right)
        .attr("height", config.height + config.margin.top + config.margin.bottom)
        .style("width", config.width + config.margin.left + config.margin.right)
        .style("height", config.height + config.margin.top + config.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + config.margin.left + "," + config.margin.top + ")");

    const yScale = d3.scaleLinear()
        .range([config.height, 0])
        .domain([0, 100]);

    svg.append('g')
        .call(d3.axisLeft(yScale).ticks(5));

    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "translate("+ (-3 * config.margin.left / 4) +","+(config.height/2)+")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
        .text("Percent of Population");

    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "translate("+ (config.width/2) +","+(config.height + config.margin.bottom / 2)+")")  // centre below axis
        .text("Time of Day");

    const xScale = d3.scaleLinear()
        .range([0, config.width])
        .domain([0, 1440]);

    const ticks = [0, 240, 480, 720, 960, 1200, 1440]
    const tickLabels = ["12am", "4am", "8am", "12pm", "4pm", "8pm", "12am"];

    const bottomAxis = d3.axisBottom(xScale).ticks(1)
        .tickValues(ticks)
        .tickFormat((d, i) => tickLabels[i]);

    svg.append('g')
        .attr('transform', `translate(0, ${config.height})`)
        .call(bottomAxis)
        .selectAll("text")
        .attr("text", "hahha")
        .attr("y", 15)
        .attr("dy", ".35em");

    svg.append("text")
        .attr("x", (config.width / 2))
        .attr("y", 0 - (config.margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .style("fill", "black")
        .text("Activity");

    const line = d3.line()
        .x(d => xScale(d.time))
        .y(d => yScale(d.percentOfGroup))
        .curve(d3.curveMonotoneX);

    const area = d3.area()
    		.x(function(d) {return xScale(d.time); })
    		.y0(function(d) { return yScale(d.percentOfGroup); })
    		.y1(function(d) { return yScale(0); })
        .curve(d3.curveMonotoneX);

    const colors = ["red", "orange", "blue", "green"];

    for (let i = 0; i < 4; i++) {
        const lineData = data.filter(row => row.incomeLevel == i);

        svg.append("path")
                .data([lineData])
                .attr("class", "line")
                .attr("d", line)
                .style("fill", "none")
                .style("stroke", colors[i])
                .style("stroke-width", "2px")
                .on("mouseover", () => {
                    var drawarea = svg.append("path")
          		    	.datum(lineData)
          		    	.attr("class", "area")
          		    	.attr("d", area);
                });
                .on("mouseleave", () => {
                    var drawarea = svg.append("path")
          		    	.datum(lineData)
          		    	.attr("class", "area")
          		    	.attr("d", area);
                });
    }
};
