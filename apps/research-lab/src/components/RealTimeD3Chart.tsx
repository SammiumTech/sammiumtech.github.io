import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { Cpu, Database } from "lucide-react";

interface DataPoint {
  time: Date;
  cpu: number;
  memory: number;
}

interface RealTimeD3ChartProps {
  cpu: number;
  memory: number;
}

// Generates smooth past baseline history to make chart beautiful immediately
const generateInitialData = (currentCpu: number, currentMemory: number): DataPoint[] => {
  const data: DataPoint[] = [];
  const now = Date.now();
  for (let i = 24; i >= 0; i--) {
    data.push({
      time: new Date(now - i * 2500),
      cpu: Math.max(2, Math.min(98, currentCpu + (Math.random() * 8 - 4))),
      memory: Math.max(5, Math.min(95, currentMemory + (Math.random() * 4 - 2)))
    });
  }
  return data;
};

export const RealTimeD3Chart: React.FC<RealTimeD3ChartProps> = ({ cpu, memory }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 160 });
  
  // Track continuous dynamic history
  const [history, setHistory] = useState<DataPoint[]>([]);

  // Initialize history on mount
  useEffect(() => {
    setHistory(generateInitialData(cpu || 12, memory || 45));
  }, []);

  // Update history buffer when new metrics stream in
  useEffect(() => {
    setHistory((prev) => {
      if (prev.length === 0) return prev;
      const now = new Date();
      const next = [...prev, { time: now, cpu, memory }];
      // Keep last 25 ticks
      if (next.length > 25) {
        return next.slice(next.length - 25);
      }
      return next;
    });
  }, [cpu, memory]);

  // Hook up ResizeObserver for perfect responsive containment sizing
  useEffect(() => {
    if (!containerRef.current) return;

    let debounceTimer: any = null;
    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const { width, height } = entries[0].contentRect;
      
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        setDimensions({
          width: width || 320,
          height: height || 160,
        });
      }, 50);
    });

    resizeObserver.observe(containerRef.current);
    return () => {
      resizeObserver.disconnect();
      if (debounceTimer) clearTimeout(debounceTimer);
    };
  }, []);

  // Primary D3 Painting Hook
  useEffect(() => {
    if (!svgRef.current || history.length === 0 || dimensions.width === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Fresh redraw buffer

    const margin = { top: 12, right: 10, bottom: 20, left: 32 };
    const width = dimensions.width - margin.left - margin.right;
    const height = dimensions.height - margin.top - margin.bottom;

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Time scaling (X Axis)
    const xScale = d3.scaleTime()
      .domain(d3.extent(history, (d) => d.time) as [Date, Date])
      .range([0, width]);

    // Percentage scaling (Y Axis)
    const yScale = d3.scaleLinear()
      .domain([0, 100])
      .range([height, 0]);

    // Create grid layout
    const yGrid = d3.axisLeft(yScale)
      .tickSize(-width)
      .tickFormat(() => "")
      .ticks(4);

    g.append("g")
      .attr("class", "grid text-slate-800/30")
      .call(yGrid)
      .call((g) => g.select(".domain").remove())
      .call((g) =>
        g.selectAll(".tick line")
          .attr("stroke", "currentColor")
          .attr("stroke-dasharray", "2,3")
      );

    // Setup interactive Axes
    const xAxis = d3.axisBottom(xScale)
      .ticks(4)
      .tickFormat(d3.timeFormat("%H:%M:%S") as any);

    const yAxis = d3.axisLeft(yScale)
      .ticks(4)
      .tickFormat((d) => `${d}%`);

    const xAxisGroup = g.append("g")
      .attr("transform", `translate(0,${height})`)
      .attr("class", "text-[8px] font-mono text-slate-500")
      .call(xAxis);

    xAxisGroup.select(".domain").attr("stroke", "rgba(71, 85, 105, 0.2)");
    xAxisGroup.selectAll("line").attr("stroke", "rgba(71, 85, 105, 0.2)");

    const yAxisGroup = g.append("g")
      .attr("class", "text-[8px] font-mono text-slate-500")
      .call(yAxis);

    yAxisGroup.select(".domain").attr("stroke", "rgba(71, 85, 105, 0.2)");
    yAxisGroup.selectAll("line").attr("stroke", "rgba(71, 85, 105, 0.2)");

    // Curve interpolation generators
    const cpuLineGen = d3.line<DataPoint>()
      .x((d) => xScale(d.time))
      .y((d) => yScale(d.cpu))
      .curve(d3.curveMonotoneX);

    const memLineGen = d3.line<DataPoint>()
      .x((d) => xScale(d.time))
      .y((d) => yScale(d.memory))
      .curve(d3.curveMonotoneX);

    const cpuAreaGen = d3.area<DataPoint>()
      .x((d) => xScale(d.time))
      .y0(height)
      .y1((d) => yScale(d.cpu))
      .curve(d3.curveMonotoneX);

    const memAreaGen = d3.area<DataPoint>()
      .x((d) => xScale(d.time))
      .y0(height)
      .y1((d) => yScale(d.memory))
      .curve(d3.curveMonotoneX);

    // Generate gradients and filters
    const defs = svg.append("defs");

    // Orange Glow Filter for CPU (SAO Theme)
    const glowFilter = defs.append("filter")
      .attr("id", "sao-orange-glow")
      .attr("x", "-20%")
      .attr("y", "-20%")
      .attr("width", "140%")
      .attr("height", "140%");
    glowFilter.append("feGaussianBlur")
      .attr("stdDeviation", "3.5")
      .attr("result", "blur");
    glowFilter.append("feMerge")
      .selectAll("feMergeNode")
      .data(["blur", "SourceGraphic"])
      .enter()
      .append("feMergeNode")
      .attr("in", (d) => d);

    // Area gradients
    const cpuGrad = defs.append("linearGradient")
      .attr("id", "sao-cpu-grad")
      .attr("x1", "0%").attr("y1", "0%")
      .attr("x2", "0%").attr("y2", "100%");
    cpuGrad.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "rgb(249, 115, 22)")
      .attr("stop-opacity", 0.22);
    cpuGrad.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "rgb(249, 115, 22)")
      .attr("stop-opacity", 0);

    const memGrad = defs.append("linearGradient")
      .attr("id", "sao-mem-grad")
      .attr("x1", "0%").attr("y1", "0%")
      .attr("x2", "0%").attr("y2", "100%");
    memGrad.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "rgb(245, 158, 11)")
      .attr("stop-opacity", 0.12);
    memGrad.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "rgb(245, 158, 11)")
      .attr("stop-opacity", 0);

    // Draw area fills
    g.append("path")
      .datum(history)
      .attr("fill", "url(#sao-cpu-grad)")
      .attr("d", cpuAreaGen);

    g.append("path")
      .datum(history)
      .attr("fill", "url(#sao-mem-grad)")
      .attr("d", memAreaGen);

    // Draw paths
    g.append("path")
      .datum(history)
      .attr("fill", "none")
      .attr("stroke", "rgb(249, 115, 22)") // SAO Orange
      .attr("stroke-width", 2)
      .attr("d", cpuLineGen)
      .attr("filter", "url(#sao-orange-glow)");

    g.append("path")
      .datum(history)
      .attr("fill", "none")
      .attr("stroke", "rgb(245, 158, 11)") // SAO Amber
      .attr("stroke-width", 1.5)
      .attr("stroke-dasharray", "3,2")
      .attr("d", memLineGen);

    // Interactive trailing telemetry nodes
    const latest = history[history.length - 1];
    if (latest) {
      g.append("circle")
        .attr("cx", xScale(latest.time))
        .attr("cy", yScale(latest.cpu))
        .attr("r", 4)
        .attr("fill", "rgb(249, 115, 22)")
        .attr("stroke", "#fff")
        .attr("stroke-width", 1);

      g.append("circle")
        .attr("cx", xScale(latest.time))
        .attr("cy", yScale(latest.memory))
        .attr("r", 3)
        .attr("fill", "rgb(245, 158, 11)")
        .attr("stroke", "#fff")
        .attr("stroke-width", 0.75);
    }

  }, [history, dimensions]);

  return (
    <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-850 flex flex-col gap-2">
      {/* Dynamic Header Metrics */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-[9px] font-mono uppercase tracking-wider text-slate-500">
          <span className="flex items-center gap-1">
            <span className="inline-block w-2 h-0.5 bg-orange-500" />
            <Cpu className="w-3 h-3 text-orange-500" /> CPU FLUX ({cpu}%)
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block w-2 h-0.5 border-t border-dashed border-amber-500" />
            <Database className="w-3 h-3 text-amber-500" /> RAM CORE ({memory}%)
          </span>
        </div>
        <span className="text-[8px] font-mono font-bold text-orange-500 animate-pulse px-1.5 py-0.5 bg-orange-500/10 rounded border border-orange-500/20">
          LIVE TELEMETRY STREAM
        </span>
      </div>

      {/* SVG Canvas Container */}
      <div ref={containerRef} className="w-full h-40 relative">
        <svg
          ref={svgRef}
          className="w-full h-full block"
          style={{ overflow: "visible" }}
        />
      </div>
    </div>
  );
};
