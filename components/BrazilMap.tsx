"use client";

import React from "react";
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps";
import brazilTopoJson from "./brazil-states.json"; 

const stateCenters: Record<string, [number, number]> = {
  AC: [-70.55, -9.02], AL: [-36.63, -9.57], AP: [-52.02, 1.41], AM: [-64.62, -4.23], BA: [-41.71, -12.96], CE: [-39.32, -5.20], DF: [-47.86, -15.83], ES: [-40.34, -19.19], GO: [-49.83, -15.93], MA: [-45.27, -4.96], MT: [-56.13, -12.64], MS: [-54.84, -20.51], MG: [-44.68, -18.10], PA: [-52.39, -3.79], PB: [-36.56, -7.28], PR: [-51.33, -24.89], PE: [-37.99, -8.38], PI: [-42.94, -7.18], RJ: [-42.80, -22.25], RN: [-36.67, -5.81], RS: [-53.33, -29.71], SE: [-37.38, -10.57], RO: [-62.86, -10.83], RR: [-61.13, 2.05], SC: [-50.22, -27.33], SP: [-48.81, -22.04], TO: [-48.33, -10.25],
};

interface BrazilMapProps {
  activeState: string | null;
  onStateClick: (stateId: string) => void;
  data: any;
  activeMetric: 'impressions' | 'visualizations' | 'cost' | 'cpv' | 'cpm';
}

export default function BrazilMap({ activeState, onStateClick, data, activeMetric }: BrazilMapProps) {
  const parseValue = (val: string) => parseFloat(String(val).replace(/\./g, "").replace(",", "."));
  
  // Função para abreviar números no mapa (evita quebrar o layout)
  const abbreviateNum = (val: string) => {
    const n = parseValue(val);
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return (n / 1000).toFixed(0) + 'K';
    return val;
  };

  const maxValues = { impressions: 9835264, visualizations: 1133198, cost: 21858.19, cpv: 0.02, cpm: 2.52 };
  const minValues = { impressions: 0, visualizations: 0, cost: 0, cpv: 0.01, cpm: 1.71 };

  return (
    <div className="relative w-full h-[550px] bg-[#080808] rounded-[40px] border border-zinc-900 overflow-hidden cursor-grab active:cursor-grabbing">
      <ComposableMap projection="geoMercator" projectionConfig={{ scale: 1050, center: [-54, -15] }} className="w-full h-full">
        <ZoomableGroup center={[-54, -15]} zoom={1} minZoom={1} maxZoom={10}>
          <Geographies geography={brazilTopoJson}>
            {({ geographies }) => geographies.map((geo) => {
              const stateId = String(geo.properties.HASC_1 || geo.id || "").replace("BR.", "").replace("BR-", "");
              const stateData = data[stateId];
              const isActive = activeState === stateId;
              
              const getHeatmapColor = () => {
                if (isActive) return "#ffffff"; 
                if (!stateData) return "#151515";
                const val = parseValue(stateData[activeMetric]);
                
                let intensity;
                if (activeMetric === 'cpv' || activeMetric === 'cpm') {
                  const range = maxValues[activeMetric] - minValues[activeMetric];
                  intensity = range === 0 ? 0.8 : 1 - ((val - minValues[activeMetric]) / range);
                  intensity = Math.max(0.2, Math.min(1, intensity));
                } else {
                  intensity = Math.max(0.2, Math.min(1, val / maxValues[activeMetric]));
                }
                
                return `rgba(255, 90, 0, ${intensity})`; 
              };

              return (
                <Geography key={geo.rsmKey} geography={geo} onClick={() => onStateClick(stateId)}
                  style={{
                    default: { fill: getHeatmapColor(), stroke: "#000", strokeWidth: 0.4, outline: "none" },
                    hover: { fill: "#ff7a33", stroke: "#fff", strokeWidth: 2, cursor: "pointer", outline: "none" },
                    pressed: { fill: "#cc4800", outline: "none" },
                  }}
                />
              );
            })}
          </Geographies>

          {Object.entries(stateCenters).map(([id, coords]) => {
            const stateData = data[id];
            if (!stateData) return null;
            
            let displayValue = (activeMetric === 'cost' || activeMetric === 'cpm' || activeMetric === 'cpv') 
                               ? `R$ ${stateData[activeMetric]}` : abbreviateNum(stateData[activeMetric]);
            if (activeMetric === 'cost') displayValue = `R$ ${stateData.cost.split(',')[0]}`;

            return (
              <Marker key={id} coordinates={coords}>
                <text y={-6} textAnchor="middle" fill="#fff" fontSize={11} className="font-black pointer-events-none drop-shadow-2xl uppercase italic">{id}</text>
                <text y={6} textAnchor="middle" fill="#ffd1b3" fontSize={8} className="font-black pointer-events-none drop-shadow-2xl italic">{displayValue}</text>
              </Marker>
            );
          })}
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
}