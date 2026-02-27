"use client";

import BrazilMap from "@/components/BrazilMap";
import { useState } from "react";

const statesData: Record<string, { name: string; impressions: string; visualizations: string; cost: string; cpv: string }> = {
  "BA": { name: "Bahia", impressions: "2.851.213", visualizations: "320.797", cost: "4.163,45", cpv: "0,01" },
  "MT": { name: "Mato Grosso", impressions: "714.261", visualizations: "65.092", cost: "942,62", cpv: "0,01" },
  "MS": { name: "Mato Grosso do Sul", impressions: "497.724", visualizations: "51.946", cost: "703,73", cpv: "0,01" },
  "SC": { name: "Santa Catarina", impressions: "879.363", visualizations: "109.551", cost: "1.418,28", cpv: "0,01" },
  "RJ": { name: "Rio de Janeiro", impressions: "1.812.657", visualizations: "225.566", cost: "2.940,14", cpv: "0,01" },
  "AM": { name: "Amazonas", impressions: "772.128", visualizations: "99.891", cost: "1.226,73", cpv: "0,01" },
  "AP": { name: "Amapá", impressions: "114.052", visualizations: "13.250", cost: "172,77", cpv: "0,01" },
  "CE": { name: "Ceará", impressions: "2.214.262", visualizations: "248.996", cost: "3.220,65", cpv: "0,01" },
  "PA": { name: "Pará", impressions: "1.617.117", visualizations: "195.159", cost: "2.496,03", cpv: "0,01" },
  "AL": { name: "Alagoas", impressions: "963.212", visualizations: "118.108", cost: "1.491,01", cpv: "0,01" },
  "AC": { name: "Acre", impressions: "180.948", visualizations: "23.776", cost: "297,44", cpv: "0,01" },
  "RN": { name: "Rio Grande do Norte", impressions: "777.005", visualizations: "96.401", cost: "1.193,27", cpv: "0,01" },
  "SP": { name: "São Paulo", impressions: "5.856.738", visualizations: "652.763", cost: "9.056,10", cpv: "0,01" },
  "DF": { name: "Distrito Federal", impressions: "482.839", visualizations: "43.457", cost: "657,58", cpv: "0,02" },
  "PB": { name: "Paraíba", impressions: "1.031.299", visualizations: "126.307", cost: "1.582,33", cpv: "0,01" },
  "PE": { name: "Pernambuco", impressions: "2.371.130", visualizations: "280.582", cost: "3.539,82", cpv: "0,01" },
  "MG": { name: "Minas Gerais", impressions: "2.937.062", visualizations: "321.231", cost: "4.487,10", cpv: "0,01" },
  "RR": { name: "Roraima", impressions: "137.077", visualizations: "16.364", cost: "205,93", cpv: "0,01" },
  "SE": { name: "Sergipe", impressions: "467.328", visualizations: "57.724", cost: "728,78", cpv: "0,01" },
  "ES": { name: "Espírito Santo", impressions: "744.330", visualizations: "88.275", cost: "1.193,51", cpv: "0,01" },
  "MA": { name: "Maranhão", impressions: "1.800.842", visualizations: "199.148", cost: "2.573,52", cpv: "0,01" },
  "PI": { name: "Piauí", impressions: "781.182", visualizations: "86.758", cost: "1.127,23", cpv: "0,01" },
  "GO": { name: "Goiás", impressions: "1.218.584", visualizations: "116.330", cost: "1.728,04", cpv: "0,01" },
  "RO": { name: "Rondônia", impressions: "342.677", visualizations: "46.412", cost: "566,54", cpv: "0,01" },
  "PR": { name: "Paraná", impressions: "1.265.670", visualizations: "143.083", cost: "1.953,43", cpv: "0,01" },
  "RS": { name: "Rio Grande do Sul", impressions: "1.202.311", visualizations: "159.991", cost: "2.044,41", cpv: "0,01" },
  "TO": { name: "Tocantins", impressions: "302.689", visualizations: "27.119", cost: "412,83", cpv: "0,02" }
};

type Metric = 'impressions' | 'visualizations' | 'cost' | 'cpv';

export default function Dashboard() {
  const [activeState, setActiveState] = useState<string | null>(null);
  const [activeMetric, setActiveMetric] = useState<Metric>('cost');

  const parseValue = (val: string) => parseFloat(val.replace(/\./g, "").replace(",", "."));

  const metricLabels: Record<Metric, string> = {
    impressions: "Impressões", visualizations: "Visualizações", cost: "Investimento", cpv: "CPV Médio"
  };

  const kpiClass = (metric: Metric) => 
    `cursor-pointer bg-[#1a1a1a] border p-6 rounded-xl transition-all ${
      activeMetric === metric ? 'border-[#ff5a00] ring-1 ring-[#ff5a00]' : 'border-zinc-800 hover:border-zinc-700'
    }`;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Título Atualizado */}
        <header className="border-b border-zinc-800 pb-8">
          <h1 className="text-4xl font-black uppercase tracking-tighter text-[#ff5a00]">Desempenho - Saudade do Carai</h1>
          <p className="text-zinc-500 font-medium mt-1 uppercase text-xs tracking-widest">Relatório Analítico • Google ADS</p>
        </header>

        {/* KPIs Cabeçalho */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div onClick={() => setActiveMetric('impressions')} className={kpiClass('impressions')}>
            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 text-center">Impressões</h3>
            <p className="text-3xl font-black text-center">34.335.700</p>
          </div>
          <div onClick={() => setActiveMetric('visualizations')} className={kpiClass('visualizations')}>
            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 text-center">Visualizações</h3>
            <p className="text-3xl font-black text-center">3.934.077</p>
          </div>
          <div onClick={() => setActiveMetric('cost')} className={kpiClass('cost')}>
            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 text-[#ff5a00] text-center">Investimento</h3>
            <p className="text-3xl font-black text-center text-emerald-400">R$ 52.123,24</p>
          </div>
          <div onClick={() => setActiveMetric('cpv')} className={kpiClass('cpv')}>
            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 text-center">CPV Médio</h3>
            <p className="text-3xl font-black text-center">R$ 0,01</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="bg-[#111] p-6 rounded-2xl border border-zinc-800 shadow-2xl">
            <h2 className="text-xs font-bold mb-6 uppercase tracking-widest text-zinc-500 text-center">Visualização: {metricLabels[activeMetric]}</h2>
            <BrazilMap 
              activeState={activeState} 
              onStateClick={(id) => setActiveState(id)} 
              data={statesData} 
              activeMetric={activeMetric}
            />
          </div>

          <div className="space-y-6">
            {/* PAINEL DE DETALHES GIGANTE (AGORA FUNCIONANDO COM CLIQUE NO MAPA) */}
            <div className="bg-[#ff5a00] p-10 rounded-2xl shadow-2xl min-h-[350px] flex flex-col justify-center transition-all duration-500 text-white relative">
              {activeState && statesData[activeState] ? (
                <div className="animate-in fade-in zoom-in-95 duration-300">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-black uppercase tracking-widest text-sm italic text-black/60">
                      {statesData[activeState].name}
                    </span>
                    <button onClick={() => setActiveState(null)} className="text-black/40 hover:text-black font-bold text-xs underline">Fechar</button>
                  </div>
                  
                  <h3 className="text-xs uppercase font-bold tracking-tighter mb-4 opacity-80">
                    {metricLabels[activeMetric]}
                  </h3>
                  
                  <div className="flex items-baseline gap-2">
                    {(activeMetric === 'cost' || activeMetric === 'cpv') && <span className="text-4xl font-bold">R$</span>}
                    <p className="text-7xl md:text-8xl font-black tracking-tighter leading-none">
                      {statesData[activeState][activeMetric]}
                    </p>
                  </div>

                  <div className="mt-10 pt-8 border-t border-white/20 grid grid-cols-2 gap-8">
                    <div>
                      <p className="text-black/50 text-[10px] uppercase font-black tracking-widest mb-1">Custo Total UF</p>
                      <p className="text-2xl font-black">R$ {statesData[activeState].cost}</p>
                    </div>
                    <div>
                      <p className="text-black/50 text-[10px] uppercase font-black tracking-widest mb-1">CPV UF</p>
                      <p className="text-2xl font-black">R$ {statesData[activeState].cpv}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center space-y-6 py-10">
                  <div className="p-4 rounded-full bg-white/10">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"></path></svg>
                  </div>
                  <p className="text-center font-black uppercase text-lg tracking-tight">Selecione um estado no mapa<br/>para detalhar os números</p>
                </div>
              )}
            </div>

            {/* Ranking dos Maiores */}
            <div className="bg-[#111] border border-zinc-800 p-6 rounded-2xl">
              <h2 className="text-xs font-bold mb-6 text-zinc-500 uppercase tracking-widest">Maiores Performances ({metricLabels[activeMetric]})</h2>
              <div className="space-y-3">
                {Object.entries(statesData)
                  .sort(([, a], [, b]) => parseValue(b[activeMetric]) - parseValue(a[activeMetric]))
                  .slice(0, 5)
                  .map(([id, state], i) => (
                  <div key={id} onClick={() => setActiveState(id)} className={`cursor-pointer flex justify-between items-center p-4 rounded-xl transition-all border ${activeState === id ? 'bg-[#ff5a00]/10 border-[#ff5a00]' : 'bg-[#0a0a0a] border-zinc-800 hover:border-zinc-700'}`}>
                    <div className="flex items-center gap-3">
                      <span className="text-[#ff5a00] font-black italic">#{i+1}</span>
                      <span className="text-zinc-200 font-bold uppercase text-sm">{state.name}</span>
                    </div>
                    <span className="text-white font-black tracking-tight">
                      {(activeMetric === 'cost' || activeMetric === 'cpv') && "R$ "}
                      {state[activeMetric]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}