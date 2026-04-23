import React, { useEffect, useRef, useState } from 'react';
import { select } from 'd3-selection';
import { line, area } from 'd3-shape';
import { scaleLinear, scaleBand } from 'd3-scale';
import { axisBottom, axisLeft } from 'd3-axis';

interface TrailElevationGraphProps {
  geoJsonData: any;
  onHover: (elevation: number, distance: number) => void;
}

const TrailElevationGraph: React.FC<TrailElevationGraphProps> = ({ geoJsonData, onHover }) => {
  const [hoverData, setHoverData] = useState<{ elevation: number; distance: number } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !geoJsonData) return;

    const width = 800;
    const height = 400;
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };

    const distances = geoJsonData.features[0].geometry.coordinates.map((c: any) => c[0]);
    const elevations = geoJsonData.features[0].properties.elevations;

    const xScale = scaleLinear().domain([0, Math.max(...distances)]).range([margin.left, width - margin.right]);
    const yScale = scaleLinear().domain([Math.min(...elevations), Math.max(...elevations)]).range([height - margin.bottom, margin.top]);

    const svg = select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous drawings

    svg.append('g')
      .attr('transform', `translate(0, ${height - margin.bottom})`)
      .call(axisBottom(xScale));

    svg.append('g')
      .attr('transform', `translate(${margin.left}, 0)`)
      .call(axisLeft(yScale));

    const lineGenerator = line()
      .x((d, i) => xScale(distances[i]))
      .y((d, i) => yScale(elevations[i]));

    svg.append('path')
      .datum(elevations)
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 2)
      .attr('d', lineGenerator);

    svg.selectAll('.dot')
      .data(elevations)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('cx', (d, i) => xScale(distances[i]))
      .attr('cy', (d) => yScale(d))
      .attr('r', 5)
      .on('mouseover', (event, d) => {
        setHoverData({ elevation: d, distance: distances[elevations.indexOf(d)] });
        onHover(d, distances[elevations.indexOf(d)]);
      })
      .on('mouseout', () => {
        setHoverData(null);
      });

    // Tooltip display logic can be added here using hoverData 
  }, [geoJsonData, onHover]);

  return <svg ref={svgRef} width="800" height="400"></svg>;
};

export default TrailElevationGraph;
