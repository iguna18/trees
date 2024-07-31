import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const ClimateBiomeGraph = ({ width = 800, height = 600 }) => {
  const svgRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear svg content before redraw

    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Sample data for biomes and cities
    const biomes = [
      { name: "Desert", minTemp: 20, maxTemp: 35, minRain: 0, maxRain: 250, color: "#FFFF00" },
      { name: "Tropical Rainforest", minTemp: 20, maxTemp: 30, minRain: 1500, maxRain: 3000, color: "#00FF00" },
      // Add more biomes here
    ];

    const cities = [
      { name: "Cairo", temp: 25, rain: 100 },
      { name: "Rio", temp: 28, rain: 2000 },
      // Add more cities here
    ];

    // Scales
    const x = d3.scaleLinear().domain([0, 3000]).range([0, innerWidth]);
    const y = d3.scaleLinear().domain([0, 40]).range([innerHeight, 0]);

    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    // Draw biomes
    biomes.forEach(biome => {
      g.append("rect")
        .attr("x", x(biome.minRain))
        .attr("y", y(biome.maxTemp))
        .attr("width", x(biome.maxRain) - x(biome.minRain))
        .attr("height", y(biome.minTemp) - y(biome.maxTemp))
        .attr("fill", biome.color)
        .attr("opacity", 0.5);
    });

    // Draw cities
    g.selectAll(".city")
      .data(cities)
      .enter().append("circle")
      .attr("class", "city")
      .attr("cx", d => x(d.rain))
      .attr("cy", d => y(d.temp))
      .attr("r", 5)
      .attr("fill", "red");

    // Axes
    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x).ticks(5))
      .append("text")
      .attr("fill", "#000")
      .attr("y", 25)
      .attr("x", innerWidth / 2)
      .attr("text-anchor", "middle")
      .text("Annual Rainfall (mm)");

    g.append("g")
      .call(d3.axisLeft(y))
      .append("text")
      .attr("fill", "#000")
      .attr("transform", "rotate(-90)")
      .attr("y", -30)
      .attr("x", -innerHeight / 2)
      .attr("text-anchor", "middle")
      .text("Average Temperature (°C)");

    // Zoom functionality
    const zoom = d3.zoom()
      .scaleExtent([1, 8])
      .on("zoom", zoomed);

    svg.call(zoom);

    function zoomed(event) {
      g.attr("transform", event.transform);
    }

  }, [width, height]);

  return <svg ref={svgRef} width={width} height={height}></svg>;
};

export default ClimateBiomeGraph;