"use client";

import BrazilMap from "@/components/BrazilMap";
import { useState } from "react";

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
  "AL": { name: "Alagoas", impressions: "1.634.585", visualizations: "185.873", cost: "3174,72", cpv: "0,02", cpm: "1,94" },
  "AM": { name: "Amazonas", impressions: "1.322.548", visualizations: "160.045", cost: "2.710,61", cpv: "0,02", cpm: "2,05" },
  "RN": { name: "Rio Grande do Norte", impressions: "1.354.858", visualizations: "151.140", cost: "2.571,69", cpv: "0,02", cpm: "1,90" },
  "ES": { name: "Espírito Santo", impressions: "1.133.618", visualizations: "136.012", cost: "2470,77", cpv: "0,02", cpm: "2,18" },
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

  const parseValue = (val: string) => parseFloat(String(val).replace(/\./g, "").replace(",", "."));
  const formatNum = (val: string | number) => {
    const num = typeof val === 'string' ? parseValue(val) : val;
    return new Intl.NumberFormat('pt-BR').format(num);
  };

  const metricLabels: Record<Metric, string> = {
    impressions: "Impressões Ads", visualizations: "Visualizações Ads", cost: "Investimento Ads", cpv: "CPV da Campanha", cpm: "CPM da Campanha"
  };

  const topStates = Object.entries(statesData)
    .sort(([, a], [, b]) => {
      const valA = parseValue(a[activeMetric]);
      const valB = parseValue(b[activeMetric]);
      return (activeMetric === 'cpv' || activeMetric === 'cpm') ? valA - valB : valB - valA;
    })
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 p-6 md:p-10 font-sans selection:bg-[#ff5a00]">
      <div className="max-w-7xl mx-auto space-y-12">
        
        <header className="border-b border-zinc-900 pb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-5xl font-black uppercase tracking-tighter text-[#ff5a00]">Mari Fernandez Analytics</h1>
            <p className="text-zinc-500 font-bold mt-2 text-sm tracking-widest uppercase italic">Saudade do Carai • BI Executivo • 2025/2026</p>
          </div>
          <div className="bg-[#111] border border-[#ff5a00]/30 px-6 py-4 rounded-2xl">
            <p className="text-[10px] text-[#ff5a00] font-black uppercase tracking-widest mb-1">Custo Efetivo Total</p>
            <p className="text-3xl font-black text-white">R$ 0,003</p>
          </div>
        </header>

        {/* KPIs SEPARADOS POR FONTE (A SOLICITAÇÃO DOS SÓCIOS) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#111] border border-zinc-800 p-6 rounded-2xl">
            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Alcance Total YouTube</h3>
            <p className="text-4xl font-black text-white">{formatNum(37685527)}</p>
            <p className="text-[10px] text-emerald-400 mt-2 font-bold uppercase tracking-tighter">110M Impressões Totais</p>
          </div>
          <div className="bg-[#111] border border-zinc-800 p-6 rounded-2xl">
            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Engajamento Playlists</h3>
            <p className="text-4xl font-black text-white">{formatNum(17255336)}</p>
            <p className="text-[10px] text-[#ff5a00] mt-2 font-bold uppercase tracking-tighter">45,7% da Audiência</p>
          </div>
          <div onClick={() => setActiveMetric('visualizations')} className={`cursor-pointer bg-[#111] border p-6 rounded-2xl transition-all ${activeMetric === 'visualizations' ? 'border-[#ff5a00]' : 'border-zinc-800'}`}>
            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Views Pagas (Ads)</h3>
            <p className="text-4xl font-black text-white">{formatNum(9367214)}</p>
            <p className="text-[10px] text-zinc-500 mt-2 font-medium uppercase tracking-tighter">Origem: Google Ads</p>
          </div>
          <div onClick={() => setActiveMetric('cost')} className={`cursor-pointer bg-[#111] border p-6 rounded-2xl transition-all ${activeMetric === 'cost' ? 'border-[#ff5a00]' : 'border-zinc-800'}`}>
            <h3 className="text-[10px] font-bold text-[#ff5a00] uppercase tracking-widest mb-2 italic text-center">Investimento Campanha</h3>
            <p className="text-4xl font-black text-[#ff5a00] text-center">R$ {formatNum(130432.92)}</p>
            <p className="text-[10px] text-center text-zinc-500 mt-2 font-bold uppercase tracking-tighter">CPV Ads: R$ 0,02</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="bg-[#111] p-8 rounded-3xl border border-zinc-900">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-8 text-center italic">Distribuição Geográfica de Compra (Ads)</h2>
            <BrazilMap activeState={activeState} onStateClick={(id) => setActiveState(id)} data={statesData} activeMetric={activeMetric} />
          </div>

          <div className="space-y-8">
            {/* PAINEL DE DETALHES GIGANTE E SEM CORTES */}
            <div className="bg-[#ff5a00] p-12 rounded-3xl shadow-[0_30px_60px_rgba(255,90,0,0.3)] min-h-[400px] flex flex-col justify-center transition-all text-white relative">
              {activeState && statesData[activeState] ? (
                <div className="animate-in fade-in zoom-in-95 duration-500">
                  <div className="flex justify-between items-center mb-6">
                    <span className="font-black uppercase tracking-[0.2em] text-lg italic text-black/40">{statesData[activeState].name}</span>
                    <button onClick={() => setActiveState(null)} className="text-black/30 hover:text-black font-black text-[10px] underline uppercase">Fechar</button>
                  </div>
                  
                  <h3 className="text-xs uppercase font-black tracking-widest mb-6 opacity-70 italic border-b border-white/20 pb-4">{metricLabels[activeMetric]}</h3>
                  
                  <div className="flex items-baseline gap-4">
                    {(activeMetric === 'cost' || activeMetric === 'cpv' || activeMetric === 'cpm') && <span className="text-5xl font-black">R$</span>}
                    <p className="text-7xl md:text-9xl font-black tracking-tighter leading-none">
                      {statesData[activeState][activeMetric]}
                    </p>
                  </div>

                  <div className="mt-12 pt-10 border-t border-white/20 grid grid-cols-3 gap-6">
                    <div>
                      <p className="text-black/40 text-[9px] font-black tracking-widest mb-2 italic">INVESTIMENTO UF</p>
                      <p className="text-2xl font-black whitespace-nowrap">R$ {statesData[activeState].cost}</p>
                    </div>
                    <div>
                      <p className="text-black/40 text-[9px] font-black tracking-widest mb-2 italic">IMPRESSÕES ADS</p>
                      <p className="text-2xl font-black">{formatNum(statesData[activeState].impressions)}</p>
                    </div>
                    <div>
                      <p className="text-black/40 text-[9px] font-black tracking-widest mb-2 italic">CPM MÉDIO</p>
                      <p className="text-2xl font-black whitespace-nowrap text-center">R$ {statesData[activeState].cpm}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center space-y-8 py-10 opacity-60">
                  <div className="p-8 rounded-full bg-white/10 ring-1 ring-white/20 animate-pulse text-center">
                    <p className="text-4xl font-black italic">BI</p>
                  </div>
                  <p className="text-center font-black uppercase text-xl tracking-tighter">Selecione um estado no mapa<br/>para detalhamento completo</p>
                </div>
              )}
            </div>

            <div className="bg-[#111] border border-zinc-900 p-8 rounded-3xl">
              <h2 className="text-[10px] font-black mb-8 text-zinc-600 uppercase tracking-[0.4em] italic text-center">Top 5 Estados - Foco em Performance</h2>
              <div className="space-y-4">
                {topStates.map(([id, state], i) => (
                  <div key={id} onClick={() => setActiveState(id)} className={`cursor-pointer flex justify-between items-center p-6 rounded-2xl transition-all border ${activeState === id ? 'bg-[#ff5a00] border-transparent scale-105' : 'bg-zinc-900/40 border-zinc-800 hover:border-zinc-700'}`}>
                    <div className="flex items-center gap-6">
                      <span className={`font-black italic text-2xl ${activeState === id ? 'text-black/40' : 'text-[#ff5a00]'}`}>0{i+1}</span>
                      <span className={`font-black uppercase text-sm tracking-widest ${activeState === id ? 'text-white' : 'text-zinc-200'}`}>{state.name}</span>
                    </div>
                    <span className="font-black text-xl">
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