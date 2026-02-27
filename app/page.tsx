"use client";

import BrazilMap from "@/components/BrazilMap";
import { useState } from "react";

// Dados Oficiais do Google Ads (Nov 2025 - Fev 2026) atualizados com CPM
const statesData: Record<string, { name: string; impressions: string; visualizations: string; cost: string; cpv: string; cpm: string }> = {
  "SP": { name: "São Paulo", impressions: "9.835.264", visualizations: "1.133.198", cost: "21.858,19", cpv: "0,02", cpm: "2,22" },
  "MG": { name: "Minas Gerais", impressions: "4.684.739", visualizations: "534.555", cost: "10.117,58", cpv: "0,02", cpm: "2,16" },
  "BA": { name: "Bahia", impressions: "4.964.686", visualizations: "539.050", cost: "9.663,91", cpv: "0,02", cpm: "1,95" },
  "PE": { name: "Pernambuco", impressions: "4.179.695", visualizations: "459.493", cost: "8.003,78", cpv: "0,02", cpm: "1,91" },
  "RJ": { name: "Rio de Janeiro", impressions: "2.895.976", visualizations: "382.410", cost: "7.159,34", cpv: "0,02", cpm: "2,47" },
  "CE": { name: "Ceará", impressions: "3.835.032", visualizations: "403.128", cost: "7.065,19", cpv: "0,02", cpm: "1,84" },
  "MA": { name: "Maranhão", impressions: "3.176.610", visualizations: "317.282", cost: "5.430,76", cpv: "0,02", cpm: "1,71" },
  "RS": { name: "Rio Grande do Sul", impressions: "2.108.128", visualizations: "295.366", cost: "5.314,15", cpv: "0,02", cpm: "2,52" },
  "PA": { name: "Pará", impressions: "2.807.544", visualizations: "306.239", cost: "5.291,28", cpv: "0,02", cpm: "1,88" },
  "PR": { name: "Paraná", impressions: "2.124.928", visualizations: "246.484", cost: "4.736,85", cpv: "0,02", cpm: "2,23" },
  "GO": { name: "Goiás", impressions: "2.061.921", visualizations: "202.151", cost: "4.016,08", cpv: "0,02", cpm: "1,95" },
  "SC": { name: "Santa Catarina", impressions: "1.547.905", visualizations: "207.479", cost: "3.820,40", cpv: "0,02", cpm: "2,47" },
  "PB": { name: "Paraíba", impressions: "1.800.348", visualizations: "203.016", cost: "3.475,09", cpv: "0,02", cpm: "1,93" },
  "AL": { name: "Alagoas", impressions: "1.634.585", visualizations: "185.873", cost: "3.174,72", cpv: "0,02", cpm: "1,94" },
  "AM": { name: "Amazonas", impressions: "1.322.548", visualizations: "160.045", cost: "2.710,61", cpv: "0,02", cpm: "2,05" },
  "RN": { name: "Rio Grande do Norte", impressions: "1.354.858", visualizations: "151.140", cost: "2.571,69", cpv: "0,02", cpm: "1,90" },
  "ES": { name: "Espírito Santo", impressions: "1.133.618", visualizations: "136.012", cost: "2.470,77", cpv: "0,02", cpm: "2,18" },
  "PI": { name: "Piauí", impressions: "1.382.343", visualizations: "139.259", cost: "2.411,36", cpv: "0,02", cpm: "1,74" },
  "MT": { name: "Mato Grosso", impressions: "1.268.198", visualizations: "115.538", cost: "2.225,65", cpv: "0,02", cpm: "1,75" },
  "MS": { name: "Mato Grosso do Sul", impressions: "818.834", visualizations: "82.013", cost: "1.520,25", cpv: "0,02", cpm: "1,86" },
  "DF": { name: "Distrito Federal", impressions: "773.758", visualizations: "73.370", cost: "1.470,19", cpv: "0,02", cpm: "1,90" },
  "SE": { name: "Sergipe", impressions: "803.808", visualizations: "95.439", cost: "1.685,97", cpv: "0,02", cpm: "2,10" },
  "RO": { name: "Rondônia", impressions: "571.663", visualizations: "71.396", cost: "1.179,83", cpv: "0,02", cpm: "2,06" },
  "TO": { name: "Tocantins", impressions: "542.781", visualizations: "47.504", cost: "932,79", cpv: "0,02", cpm: "1,72" },
  "AC": { name: "Acre", impressions: "296.516", visualizations: "35.223", cost: "586,91", cpv: "0,02", cpm: "1,98" },
  "RR": { name: "Roraima", impressions: "235.945", visualizations: "26.256", cost: "451,42", cpv: "0,02", cpm: "1,91" },
  "AP": { name: "Amapá", impressions: "200.863", visualizations: "21.765", cost: "388,83", cpv: "0,02", cpm: "1,94" }
};

type Metric = 'impressions' | 'visualizations' | 'cost' | 'cpv' | 'cpm';

export default function Dashboard() {
  const [activeState, setActiveState] = useState<string | null>(null);
  const [activeMetric, setActiveMetric] = useState<Metric>('cost');

  const parseValue = (val: string) => parseFloat(val.replace(/\./g, "").replace(",", "."));

  const metricLabels: Record<Metric, string> = {
    impressions: "Impressões", 
    visualizations: "Visualizações", 
    cost: "Investimento", 
    cpv: "CPV Médio",
    cpm: "CPM Médio"
  };

  const kpiClass = (metric: Metric) => 
    `cursor-pointer bg-[#1a1a1a] border p-5 rounded-xl transition-all ${
      activeMetric === metric ? 'border-[#ff5a00] ring-1 ring-[#ff5a00]' : 'border-zinc-800 hover:border-zinc-700'
    }`;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-10">
        
        <header className="border-b border-zinc-800 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter text-[#ff5a00]">Desempenho - Saudade do Carai</h1>
            <p className="text-zinc-500 font-medium mt-1">Sertões Petrobras • 21 de Nov. 2025 - 26 de Fev. 2026</p>
          </div>
          <div className="bg-[#ff5a00] text-black px-4 py-1 rounded font-black text-xs tracking-tighter uppercase">Relatório Ads Oficial</div>
        </header>

        {/* KPIs Cabeçalho Clicáveis */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <div onClick={() => setActiveMetric('impressions')} className={kpiClass('impressions')}>
            <h3 className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Impressões</h3>
            <p className="text-2xl font-black">63.856.843</p>
          </div>
          <div onClick={() => setActiveMetric('visualizations')} className={kpiClass('visualizations')}>
            <h3 className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Visualizações</h3>
            <p className="text-2xl font-black">7.301.529</p>
          </div>
          <div onClick={() => setActiveMetric('cost')} className={kpiClass('cost')}>
            <h3 className="text-[9px] font-bold text-[#ff5a00] uppercase tracking-widest mb-1">Investimento</h3>
            <p className="text-2xl font-black text-[#ff5a00]">R$ 130.432,92</p>
          </div>
          <div onClick={() => setActiveMetric('cpv')} className={kpiClass('cpv')}>
            <h3 className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1">CPV Médio</h3>
            <p className="text-2xl font-black text-emerald-400 text-center">R$ 0,02</p>
          </div>
          <div onClick={() => setActiveMetric('cpm')} className={kpiClass('cpm')}>
            <h3 className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1 text-center">CPM Médio</h3>
            <p className="text-2xl font-black text-white text-center">R$ 2,04</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="bg-[#111] p-6 rounded-2xl border border-zinc-800 shadow-2xl">
            <h2 className="text-xs font-bold mb-6 uppercase tracking-widest text-zinc-500 text-center">Mapa de Calor: {metricLabels[activeMetric]}</h2>
            <BrazilMap 
              activeState={activeState} 
              onStateClick={(id) => setActiveState(id)} 
              data={statesData} 
              activeMetric={activeMetric}
            />
          </div>

          <div className="space-y-6">
            {/* PAINEL DE DETALHES GIGANTE */}
            <div className="bg-[#ff5a00] p-10 rounded-2xl shadow-2xl min-h-[350px] flex flex-col justify-center transition-all duration-500 text-white relative">
              {activeState && statesData[activeState] ? (
                <div className="animate-in fade-in zoom-in-95 duration-300">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-black uppercase tracking-widest text-sm italic text-black/60">
                      {statesData[activeState].name}
                    </span>
                    <button onClick={() => setActiveState(null)} className="text-black/40 hover:text-black font-bold text-xs underline uppercase tracking-tighter">Fechar</button>
                  </div>
                  
                  <h3 className="text-xs uppercase font-bold tracking-tighter mb-4 opacity-80">
                    {metricLabels[activeMetric]} UF
                  </h3>
                  
                  <div className="flex items-baseline gap-2">
                    {(activeMetric === 'cost' || activeMetric === 'cpv' || activeMetric === 'cpm') && <span className="text-4xl font-bold">R$</span>}
                    <p className="text-6xl md:text-8xl font-black tracking-tighter leading-none">
                      {statesData[activeState][activeMetric]}
                    </p>
                  </div>

                  <div className="mt-10 pt-8 border-t border-white/20 grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-black/50 text-[10px] uppercase font-black tracking-widest mb-1">Custo</p>
                      <p className="text-xl font-black">R$ {statesData[activeState].cost}</p>
                    </div>
                    <div>
                      <p className="text-black/50 text-[10px] uppercase font-black tracking-widest mb-1">Visualizações</p>
                      <p className="text-xl font-black">{statesData[activeState].visualizations}</p>
                    </div>
                    <div>
                      <p className="text-black/50 text-[10px] uppercase font-black tracking-widest mb-1">CPM</p>
                      <p className="text-xl font-black">R$ {statesData[activeState].cpm}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center space-y-6 py-10">
                  <div className="p-4 rounded-full bg-white/10 animate-pulse">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"></path></svg>
                  </div>
                  <p className="text-center font-black uppercase text-lg tracking-tight leading-tight">Selecione um estado no mapa<br/>para expandir as métricas</p>
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
                    <span className="text-white font-black tracking-tight uppercase">
                      {(activeMetric === 'cost' || activeMetric === 'cpv' || activeMetric === 'cpm') && "R$ "}
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