
const config = {
    margin: {
        top: 45,
        right: 45,
        bottom: 45,
        left: 45
    },
    numIncomeGroups: 4
};

config.width = $(window).width() / 4 - config.margin.left - config.margin.right;
config.height = ($(window).height() - 40) / 3 - config.margin.top - config.margin.bottom;

$(function() {
    const charts = [
        {
            chartId: "sleepChart",
            title: "Sleeping",
            activityName: "sleep"
        },
        {
            chartId: "workChart",
            title: "Working",
            activityName: "work"
        },
        {
            chartId: "tvChart",
            title: "Watching TV",
            activityName: "entertainment"
        },
        {
            chartId: "sportChart",
            title: "Exercise & Sports",
            activityName: "sports"
        },
        {
            chartId: "eatChart",
            title: "Eating & Drinking",
            activityName: "eating"
        },
        {
            chartId: "educationChart",
            title: "Education",
            activityName: "education"
        },
        {
            chartId: "familyChart",
            title: "Family Care",
            activityName: "family"
        },
        {
            chartId: "shopChart",
            title: "Shopping",
            activityName: "shopping"
        },
        {
            chartId: "houseChart",
            title: "Household Activities",
            activityName: "household"
        },
        {
            chartId: "socialChart",
            title: "Socializing",
            activityName: "socializing"
        },
    ];

    d3.csv("data/aggregate-all.csv").then((data) => {
        charts.forEach((chart) => {
            chart.data = data.filter(row => row.activity == chart.activityName);

            visualize(chart);
        });
    });
});

function visualize(chartObj) {
    const svg = d3.select(`#${chartObj.chartId}`)
        .append("svg")
        .attr("width", config.width + config.margin.left + config.margin.right)
        .attr("height", config.height + config.margin.top + config.margin.bottom)
        .style("width", config.width + config.margin.left + config.margin.right)
        .style("height", config.height + config.margin.top + config.margin.bottom)
        .on("mouseleave", () => hideAreas(chartObj.activityName))
        .append("g")
        .attr("transform", "translate(" + config.margin.left + "," + config.margin.top + ")");

    const yScale = d3.scaleLinear()
        .range([config.height, 0])
        .domain([0, 1]);

    svg.append('g')
        .call(d3.axisLeft(yScale).ticks(5));

    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "translate("+ (-3 * config.margin.left / 4) +","+(config.height/2)+")rotate(-90)")
        .style("font-size", "12px")
        .style("font-style", "italic")
        .text("Percent of Population");

    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "translate("+ (config.width/2) +","+(config.height + 3 * config.margin.bottom / 4)+")")
        .style("font-size", "12px")
        .style("font-style", "italic")
        .text("Time of Day");

    const xScale = d3.scaleLinear()
        .range([0, config.width])
        .domain([0, 1435]);

    const ticks = [0, 240, 480, 720, 960, 1200, 1435];
    const tickLabels = ["12am", "4am", "8am", "12pm", "4pm", "8pm", "12am"];

    const bottomAxis = d3.axisBottom(xScale).ticks(1)
        .tickValues(ticks)
        .tickFormat((d, i) => tickLabels[i]);

    svg.append('g')
        .attr('transform', `translate(0, ${config.height})`)
        .call(bottomAxis)
        .selectAll("text")
        .attr("y", 15)
        .attr("dy", ".35em");

    svg.append("text")
        .attr("x", (config.width / 2))
        .attr("y", 0 - (config.margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .style("fill", "black")
        .text(chartObj.title);

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
    const lineData = [];

    for (let i = 0; i < config.numIncomeGroups; i++) {
        lineData.push(chartObj.data
            .filter(row => row.time % 30 == 0)
            .map(row => {
                return {time: row.time, percentOfGroup: row[`percent_${i}`]}
            })
        );

        svg.append("path")
            .datum(lineData[i])
            .attr("id", `${chartObj.activityName}area-${i}`)
            .attr("d", area)
            .style("fill", colors[i])
            .style("opacity", 0.2)
            .style("visibility", "hidden");
    }

    for (let i = 0; i < config.numIncomeGroups; i++) {
        svg.append("path")
            .data([lineData[i]])
            .attr("class", "line")
            .attr("d", line)
            .style("fill", "none")
            .style("stroke", colors[i])
            .style("stroke-width", "2px")
            .on("mouseenter", () => {
                hideAreas(chartObj.activityName);

                d3.select(`#${chartObj.activityName}area-${i}`).style("visibility", "visible");
            })
            .call(transition);
    }
};

function hideAreas(activity) {
    for (let i = 0; i < config.numIncomeGroups; i++) {
        d3.select(`#${activity}area-${i}`)
            .style("visibility", "hidden");
    }
}

function transition(path) {
    path.transition()
        .duration(1000)
        .attrTween("stroke-dasharray", tweenDash);
}

function tweenDash() {
    const l = this.getTotalLength();
    const i = d3.interpolateString("0," + l, l + "," + l);
    return t => i(t);
}