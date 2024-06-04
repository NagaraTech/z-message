/* eslint-disable import/namespace */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

interface Node {
  id: number;
  name: string;
}

const EthereumP2PTopology: React.FC = () => {
  const svgRef = useRef<SVGElement>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [randomNumber, setRandomNumber] = useState<number | null>(null);

  useEffect(() => {
    const svg = d3.select(svgRef.current);

    // Generate random nodes
    const numNodes = 20;
    const nodes: Node[] = d3.range(numNodes).map((d, i) => ({ id: i, name: `Node ${i}` }));

    // Generate random links between nodes
    const links = [];
    for (let i = 0; i < numNodes; i++) {
      const numLinks = Math.floor(Math.random() * (numNodes - 1)) + 1; // Random number of links for each node
      for (let j = 0; j < numLinks; j++) {
        const targetIndex = Math.floor(Math.random() * numNodes);
        if (targetIndex !== i) {
          links.push({ source: i, target: targetIndex });
        }
      }
    }

    // Create link elements
    const link = svg
      .selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .style('stroke', '#999')
      .style('stroke-width', 2);

    // Create node elements
    const node = svg
      .selectAll('g')
      .data(nodes)
      .enter()
      .append('g')
      .on('click', (event, d) => {
        setSelectedNode(d);
        setRandomNumber(Math.floor(Math.random() * 1000)); // Generate a random number
      });

    node
      .append('circle')
      .attr('r', 15) // Increase the radius of the circles
      .style('fill', 'steelblue');

    node
      .append('text')
      .text(d => d.name)
      .attr('x', 20) // Adjust the position of the text
      .attr('y', 5) // Adjust the position of the text
      .style('fill', 'black');

    // Define the simulation
    const simulation = d3
      .forceSimulation(nodes as any)
      .force(
        'link',
        d3
          .forceLink(links)
          .id(d => (d as Node).id)
          .distance(100),
      )
      .force('charge', d3.forceManyBody().strength(-200))
      .force('center', d3.forceCenter(200, 200));

    // Update positions of nodes and links
    simulation.on('tick', () => {
      link
        .attr('x1', d => (d.source as any).x)
        .attr('y1', d => (d.source as any).y)
        .attr('x2', d => (d.target as any).x)
        .attr('y2', d => (d.target as any).y);

      node.attr('transform', d => `translate(${(d as any).x},${(d as any).y})`);
    });
  }, []);

  return (
    <div className="flex justify-center items-center overflow-x-auto">
      <svg ref={svgRef as any} width="800" height="400">
        {selectedNode && (
          <g transform={`translate(${(selectedNode as any).x},${(selectedNode as any).y})`}>
            <text x="200" y="40" fill="black">
              {selectedNode.name}
            </text>
            <text x="200" y="60" fill="black">
              Random Number: {randomNumber}
            </text>
          </g>
        )}
      </svg>
    </div>
  );
};

export default EthereumP2PTopology;
