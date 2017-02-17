import * as d3 from 'd3';

var margin = {top: 20, right: 50, bottom: 30, left: 50},
	width = window.innerWidth - margin.left - margin.right,
	height = window.innerHeight - margin.top - margin.bottom;

var dateParse = d3.timeParse("%Y-%m-%d");

var x = d3.scaleTime().range([0, width]);
var y1 = d3.scaleLinear().range([height, 0]);
var y2 = d3.scaleLinear().range([height, 0]);

var area1 = d3.area()
	.x(function (d) { return x(d.date); })
	.y0(height)
	.y1(function (d) { return y1(d.humidity); });

var area2 = d3.area()
	.x(function (d) { return x(d.date); })
	.y0(height)
	.y1(function (d) { return y2(d.co2); });

var valueLine1 = d3.line()
	.x(function (d) { return x(d.date); })
	.y(function (d) { return y1(d.humidity); });

var valueLine2 = d3.line()
	.x(function (d) { return x(d.date); })
	.y(function (d) { return y2(d.co2); });

var svg = d3.select("body").append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv('data.csv', function (error, data) {
	if (error) throw error;

	data.forEach(function (d) {
		d.date = dateParse(d.date);
		d.humidity = parseInt(d.humidity);
		d.co2 = parseInt(d.co2);
	});

	x.domain(d3.extent(data, function (d) { return d.date; }));
	y1.domain([0, d3.max(data, function (d) { return d.humidity; })]);
	y2.domain([0, d3.max(data, function (d) { return d.co2; })]);

	var svgDefs = svg.append("defs");

	var linearGradient1 = svgDefs
		.append("linearGradient")
		.attr("id", "data-1-gradient")
		.attr("x1", "0%")
		.attr("y1", "0%")
		.attr("x2", "0%")
		.attr("y2", "100%");

	linearGradient1.append("stop")
		.attr("offset", "0%")
		.attr("stop-color", "rgba(58, 153, 251, 0.5)");

	linearGradient1.append("stop")
		.attr("offset", "100%")
		.attr("stop-color", "transparent");

	var linearGradient2 = svgDefs
		.append("linearGradient")
		.attr("id", "data-2-gradient")
		.attr("x1", "0%")
		.attr("y1", "0%")
		.attr("x2", "0%")
		.attr("y2", "100%");

	linearGradient2.append("stop")
		.attr("offset", "0%")
		.attr("stop-color", "rgba(0, 248, 184, 0.5)");

	linearGradient2.append("stop")
		.attr("offset", "100%")
		.attr("stop-color", "transparent");

	svg.append("path")
		.data([data])
		.attr("stroke", "#3a99fb")
		.attr("class", "line line-1")
		.attr("d", valueLine1);

	svg.append("path")
		.data([data])
		.attr("stroke", "#00f8b8")
		.attr("class", "line line-2")
		.attr("d", valueLine2);

	svg.append("path")
		.data([data])
		.attr("class", "area area-1")
		.attr("d", area1);

	svg.append("path")
		.data([data])
		.attr("class", "area area-2")
		.attr("d", area2);

	svg.append("g")
		.attr("transform", "translate(0," + height + ")")
		.call(d3.axisBottom(x));

	svg.append("g")
		.attr("class", "axis axis-1")
		.call(d3.axisLeft(y1)
			.ticks(5)
			.tickFormat(function (d) { return d + "%"; }));

	svg.append("g")
		.attr("class", "axis axis-2")
		.attr("transform", "translate(" + width + ",0)")
		.call(d3.axisRight(y2)
			.ticks(5)
			.tickFormat(function (d) { return d + "ppm"; }));

	svg.selectAll("g.dot1")
		.data([data])
		.enter().append("g")
		.attr("class", "dot1")
		.selectAll("circle")
		.data(function (d) { return d; })
		.enter().append("circle")
		.attr("cx", function (d) { return x(d.date); })
		.attr("cy", function (d) { return y1(d.humidity); })
		.attr("r", 6)
		.attr("fill", "#3a99fb")
		.attr("stroke-width", "4px");

	svg.selectAll("g.dot2")
		.data([data])
		.enter().append("g")
		.attr("class", "dot2")
		.selectAll("circle")
		.data(function (d) { return d; })
		.enter().append("circle")
		.attr("cx", function (d) { return x(d.date); })
		.attr("cy", function (d) { return y2(d.co2); })
		.attr("r", 6)
		.attr("fill", "#00f8b8")
		.attr("stroke-width", "4px");
});