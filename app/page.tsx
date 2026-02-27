"use client";

import BrazilMap from "@/components/BrazilMap";
import { useState } from "react";

// Dados Oficiais Google Ads (Nov 2025 - Fev 2026) consolidados com CPM e CPV por estado
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
  const [activeMetric, setActiveMetric] = useState<Metric>('visualizations');

  const parseValue = (val: string) => parseFloat(val.replace(/\./g, "").replace(",", "."));

  const metricLabels: Record<Metric, string> = {
    impressions: "Impressões", visualizations: "Visualizações", cost: "Investimento", cpv: "CPV", cpm: "CPM"
  };

  // Ranking com lógica invertida para custo (menor valor = melhor performance no topo)
  const topStates = Object.entries(statesData)
    .sort(([, a], [, b]) => {
      const valA = parseValue(a[activeMetric]);
      const valB = parseValue(b[activeMetric]);
      return (activeMetric === 'cpv' || activeMetric === 'cpm') ? valA - valB : valB - valA;
    })
    .slice(0, 5);

  const kpiClass = (isActive: boolean) => 
    `cursor-pointer bg-[#111] border p-6 rounded-2xl transition-all duration-300 ${
      isActive ? 'border-[#ff5a00] bg-zinc-900 shadow-[0_0_20px_rgba(255,90,0,0.1)]' : 'border-zinc-800 hover:border-zinc-600'
    }`;

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 p-6 md:p-10 font-sans selection:bg-[#ff5a00] selection:text-white">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* HEADER EXECUTIVO */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-zinc-900 pb-10">
          <div>
            <h1 className="text-5xl font-black uppercase tracking-tighter text-[#ff5a00]">Desempenho - Saudade do Carai</h1>
            <p className="text-zinc-500 font-bold mt-2 text-sm tracking-widest uppercase">
              Mari Fernandez • BI Analytics • 21/11/2025 - 26/02/2026
            </p>
          </div>
          <div className="flex gap-3">
            <div className="bg-[#111] border border-zinc-800 px-6 py-3 rounded-xl text-center">
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Uplift Orgânico</p>
              <p className="text-2xl font-black text-emerald-400">1 : 4.1</p>
            </div>
          </div>
        </header>

        {/* KPIs DE ALTA PERFORMANCE */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div onClick={() => setActiveMetric('visualizations')} className={kpiClass(activeMetric === 'visualizations')}>
            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Visualizações Totais</h3>
            <p className="text-3xl font-black">37.685.527</p>
            <p className="text-[10px] text-zinc-600 mt-1 font-medium">80,6% ORGÂNICO</p>
          </div>
          <div className={kpiClass(false)}>
            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Views em Playlists</h3>
            <p className="text-3xl font-black text-white">17.255.336</p>
            <p className="text-[10px] text-[#ff5a00] mt-1 font-bold">45,7% DO TRÁFEGO</p>
          </div>
          <div onClick={() => setActiveMetric('cost')} className={kpiClass(activeMetric === 'cost')}>
            <h3 className="text-[10px] font-bold text-[#ff5a00] uppercase tracking-widest mb-2">Investimento Ads</h3>
            <p className="text-3xl font-black text-[#ff5a00]">R$ 130.432,92</p>
            <p className="text-[10px] text-zinc-600 mt-1 font-medium italic">7,3M VIEWS PAGAS</p>
          </div>
          <div onClick={() => setActiveMetric('cpv')} className={kpiClass(activeMetric === 'cpv')}>
            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">CPV Real (Total)</h3>
            <p className="text-3xl font-black text-emerald-400">R$ 0,003</p>
            <p className="text-[10px] text-zinc-600 mt-1 font-medium">EFICIÊNCIA MÁXIMA</p>
          </div>
          <div onClick={() => setActiveMetric('cpm')} className={kpiClass(activeMetric === 'cpm')}>
            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">CPM Real (Total)</h3>
            <p className="text-3xl font-black text-white">R$ 1,18</p>
            <p className="text-[10px] text-zinc-600 mt-1 font-medium">110M IMPRESSÕES</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* MAPA COM HEATMAP */}
          <div className="bg-[#111] p-8 rounded-3xl border border-zinc-900 shadow-2xl">
            <div className="flex justify-between items-start mb-8">
              <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-400 italic">Análise de Calor Geográfico</h2>
              <span className="text-[10px] bg-zinc-800 text-zinc-300 px-3 py-1 rounded-full font-bold uppercase">{metricLabels[activeMetric]}</span>
            </div>
            <BrazilMap 
              activeState={activeState} 
              onStateClick={(id) => setActiveState(id)} 
              data={statesData} 
              activeMetric={activeMetric}
            />
          </div>

          <div className="space-y-8">
            {/* PAINEL DE DETALHES GIGANTE */}
            <div className="bg-[#ff5a00] p-12 rounded-3xl shadow-[0_20px_50px_rgba(255,90,0,0.2)] min-h-[380px] flex flex-col justify-center transition-all duration-700 text-white relative overflow-hidden group">
              {activeState && statesData[activeState] ? (
                <div className="animate-in fade-in zoom-in-95 slide-in-from-bottom-6 duration-500">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-black uppercase tracking-widest text-lg italic text-black/40">{statesData[activeState].name}</span>
                    <button onClick={() => setActiveState(null)} className="text-black/30 hover:text-black font-black text-xs underline uppercase tracking-tighter">Fechar Detalhes</button>
                  </div>
                  
                  <h3 className="text-xs uppercase font-bold tracking-[0.2em] mb-4 opacity-70 italic">{metricLabels[activeMetric]} no Estado</h3>
                  
                  <div className="flex items-baseline gap-3">
                    {(activeMetric === 'cost' || activeMetric === 'cpv' || activeMetric === 'cpm') && <span className="text-5xl font-black">R$</span>}
                    <p className="text-8xl md:text-9xl font-black tracking-tighter leading-none drop-shadow-2xl">
                      {statesData[activeState][activeMetric]}
                    </p>
                  </div>

                  <div className="mt-12 pt-10 border-t border-white/20 grid grid-cols-3 gap-10">
                    <div>
                      <p className="text-black/40 text-[10px] uppercase font-black tracking-widest mb-2 italic">Investimento</p>
                      <p className="text-2xl font-black">R$ {statesData[activeState].cost}</p>
                    </div>
                    <div>
                      <p className="text-black/40 text-[10px] uppercase font-black tracking-widest mb-2 italic">Views Ads</p>
                      <p className="text-2xl font-black">{statesData[activeState].visualizations}</p>
                    </div>
                    <div>
                      <p className="text-black/40 text-[10px] uppercase font-black tracking-widest mb-2 italic">CPM</p>
                      <p className="text-2xl font-black">R$ {statesData[activeState].cpm}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center space-y-8 py-10">
                  <div className="p-6 rounded-full bg-white/10 ring-8 ring-white/5 animate-pulse">
                    <svg className="w-14 h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"></path></svg>
                  </div>
                  <div className="text-center">
                    <p className="font-black uppercase text-2xl tracking-tighter">Visão Detalhada</p>
                    <p className="text-sm font-bold opacity-60 uppercase tracking-widest mt-2">Toque em um estado no mapa para expandir</p>
                  </div>
                </div>
              )}
            </div>

            {/* RANKING DE PERFORMANCE */}
            <div className="bg-[#111] border border-zinc-900 p-8 rounded-3xl shadow-xl">
              <h2 className="text-xs font-bold mb-8 text-zinc-500 uppercase tracking-[0.3em] italic">Top Performance de Campanha</h2>
              <div className="space-y-4">
                {topStates.map(([id, state], i) => (
                  <div key={id} onClick={() => setActiveState(id)} className={`cursor-pointer flex justify-between items-center p-5 rounded-2xl transition-all duration-300 border ${activeState === id ? 'bg-[#ff5a00] border-transparent scale-105' : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-600'}`}>
                    <div className="flex items-center gap-5">
                      <span className={`font-black italic text-xl ${activeState === id ? 'text-black/50' : 'text-[#ff5a00]'}`}>#{i+1}</span>
                      <span className={`font-black uppercase text-sm tracking-widest ${activeState === id ? 'text-white' : 'text-zinc-300'}`}>{state.name}</span>
                    </div>
                    <span className={`font-black text-lg ${activeState === id ? 'text-white' : 'text-zinc-100'}`}>
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