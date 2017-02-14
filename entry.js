import * as d3 from 'd3';

var margin = {top: 20, right: 20, bottom: 30, left: 50},
	width = 960 - margin.left - margin.right,
	height = 500 - margin.top - margin.bottom;

var x = d3.scaleLinear().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

var valueLine = d3.line()
	.x(function (d) { return x(d.year); })
	.y(function (d) { return y(d.age); });

var svg = d3.select("body").append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv('data.csv', function (error, data) {
	if (error) throw error;

	data.forEach(function (d) {
		d.year = parseInt(d.year);
		d.age = parseInt(d.age);
	});

	x.domain(d3.extent(data, function (d) { return d.year; }));
	y.domain([0, d3.max(data, function (d) { return d.age; })]);

	svg.append("path")
		.data([data])
		.attr("class", "line")
		.attr("d", valueLine);

	svg.append("g")
		.attr("transform", "translate(0," + height + ")")
		.call(d3.axisBottom(x));

	svg.append("g")
		.call(d3.axisLeft(y));
});