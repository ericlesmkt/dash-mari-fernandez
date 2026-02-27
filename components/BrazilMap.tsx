"use client";

import React from "react";
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps";
import brazilTopoJson from "./brazil-states.json"; 

const stateCenters: Record<string, [number, number]> = {
  AC: [-70.55, -9.02], AL: [-36.63, -9.57], AP: [-52.02, 1.41], AM: [-64.62, -4.23], 
  BA: [-41.71, -12.96], CE: [-39.32, -5.20], DF: [-47.86, -15.83], ES: [-40.34, -19.19], 
  GO: [-49.83, -15.93], MA: [-45.27, -4.96], MT: [-56.13, -12.64], MS: [-54.84, -20.51],
  MG: [-44.68, -18.10], PA: [-52.39, -3.79], PB: [-36.56, -7.28], PR: [-51.33, -24.89], 
  PE: [-37.99, -8.38], PI: [-42.94, -7.18], RJ: [-42.80, -22.25], RN: [-36.67, -5.81], 
  RS: [-53.33, -29.71], RO: [-62.86, -10.83], RR: [-61.13, 2.05], SC: [-50.22, -27.33],
  SP: [-48.81, -22.04], SE: [-37.38, -10.57], TO: [-48.33, -10.25],
};

interface BrazilMapProps {
  activeState: string | null;
  onStateClick: (stateId: string) => void;
  data: any;
  activeMetric: 'impressions' | 'visualizations' | 'cost' | 'cpv';
}

export default function BrazilMap({ activeState, onStateClick, data, activeMetric }: BrazilMapProps) {
  const parseValue = (val: string) => parseFloat(String(val).replace(/\./g, "").replace(",", "."));

  const maxValues = {
    impressions: 5856738, visualizations: 652763, cost: 9056.10, cpv: 0.02
  };

  return (
    <div className="relative w-full h-[500px] bg-[#0c0c0c] rounded-lg border border-zinc-800 overflow-hidden">
      <ComposableMap 
        projection="geoMercator" 
        projectionConfig={{ scale: 900, center: [-54, -15] }}
        className="w-full h-full"
      >
        <ZoomableGroup center={[-54, -15]} zoom={1} minZoom={1} maxZoom={5}>
          <Geographies geography={brazilTopoJson}>
            {({ geographies }) => geographies.map((geo) => {
              // Limpeza robusta do ID para garantir compatibilidade
              const rawId = geo.properties.HASC_1 || geo.id || "";
              const stateId = String(rawId).replace("BR.", "").replace("BR-", "");
              
              const isActive = activeState === stateId;
              const stateData = data[stateId];
              
              const getHeatmapColor = () => {
                if (isActive) return "#ff5a00"; 
                if (!stateData) return "#1a1a1a";
                const val = parseValue(stateData[activeMetric]);
                const intensity = Math.max(0.15, Math.min(1, val / maxValues[activeMetric]));
                return `rgba(255, 90, 0, ${intensity})`; 
              };

              return (
                <Geography 
                  key={geo.rsmKey} 
                  geography={geo} 
                  onClick={() => onStateClick(stateId)}
                  style={{
                    default: { fill: getHeatmapColor(), stroke: "#000", strokeWidth: 0.5, outline: "none" },
                    hover: { fill: "#ff7a33", stroke: "#fff", strokeWidth: 1, cursor: "pointer", outline: "none" },
                    pressed: { fill: "#cc4800", outline: "none" },
                  }}
                />
              );
            })}
          </Geographies>

          {Object.entries(stateCenters).map(([id, coords]) => {
            const stateData = data[id];
            if (!stateData) return null;
            const displayValue = activeMetric === 'cost' ? `R$ ${stateData.cost.split(',')[0]}` : stateData[activeMetric];

            return (
              <Marker key={id} coordinates={coords}>
                <text y={-6} textAnchor="middle" fill="#fff" fontSize={10} className="font-bold pointer-events-none drop-shadow-md">
                    {id}
                </text>
                <text y={6} textAnchor="middle" fill="#ffd1b3" fontSize={7} className="font-medium pointer-events-none drop-shadow-md">
                  {displayValue}
                </text>
              </Marker>
            );
          })}
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
}