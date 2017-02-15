import * as d3 from 'd3';

var margin = {top: 20, right: 50, bottom: 30, left: 50},
	width = window.innerWidth - margin.left - margin.right,
	height = window.innerHeight - margin.top - margin.bottom;

var dateParse = d3.timeParse("%Y-%m-%d");

var x = d3.scaleTime().range([0, width]);
var y1 = d3.scaleLinear().range([height, 0]);
var y2 = d3.scaleLinear().range([height, 0]);

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

	svg.append("path")
		.data([data])
		.attr("stroke", "#3a99fb")
		.attr("class", "line humidity")
		.attr("d", valueLine1);

	svg.append("path")
		.data([data])
		.attr("stroke", "#00f8b8")
		.attr("class", "line co2")
		.attr("d", valueLine2);

	svg.append("g")
		.attr("transform", "translate(0," + height + ")")
		.call(d3.axisBottom(x));

	svg.append("g")
		.attr("class", "humidity")
		.call(d3.axisLeft(y1)
			.ticks(5)
			.tickFormat(function (d) { return d + "%"; }));

	svg.append("g")
		.attr("class", "co2")
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