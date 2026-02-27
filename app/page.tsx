"use client";

import BrazilMap from "@/components/BrazilMap";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Função para formatar números e moedas no padrão brasileiro
const formatNum = (val: string | number, isCurrency = false, decimals = 0) => {
  const num = typeof val === 'string' ? parseFloat(val.replace(/\./g, "").replace(",", ".")) : val;
  return new Intl.NumberFormat('pt-BR', {
    style: isCurrency ? 'currency' : 'decimal',
    currency: 'BRL',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
};

// Componente para transição suave dos valores (Substitui o odômetro)
const AnimatedValue = ({ value, className }: { value: string | number; className?: string }) => (
  <AnimatePresence mode="wait">
    <motion.span
      key={value}
      initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -10, filter: "blur(8px)" }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`inline-block ${className}`}
    >
      {value}
    </motion.span>
  </AnimatePresence>
);

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
  "GO": { name: "Goiás", impressions: "2.061.921", visualizations: "202.151", cost: "4016,08", cpv: "0,02", cpm: "1,95" },
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

type Metric = 'visualizations' | 'cost' | 'cpv' | 'cpm';

export default function Dashboard() {
  const [activeState, setActiveState] = useState<string | null>(null);
  const [activeMetric, setActiveMetric] = useState<Metric>('visualizations');

  const metricLabels: Record<Metric, string> = {
    visualizations: "Views Pagas", cost: "Investimento Ads", cpv: "CPV Campanha", cpm: "CPM Campanha"
  };

  const topStates = Object.entries(statesData)
    .sort(([, a], [, b]) => {
      const valA = parseFloat(a[activeMetric].replace(/\./g, "").replace(",", "."));
      const valB = parseFloat(b[activeMetric].replace(/\./g, "").replace(",", "."));
      return (activeMetric === 'cpv' || activeMetric === 'cpm') ? valA - valB : valB - valA;
    })
    .slice(0, 5);

  const glassStyle = "bg-white/[0.03] border border-white/10 backdrop-blur-xl rounded-[2rem] shadow-2xl transition-all duration-300 hover:bg-white/[0.06]";

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 p-4 md:p-8 font-sans selection:bg-[#ff5a00] overflow-x-hidden">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* HEADER */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white">
              <span className="text-[#ff5a00]">DASH</span> <span className="text-zinc-700">|</span> Mari Fernandez
            </h1>
            <p className="text-zinc-500 font-bold text-[10px] tracking-[0.4em] uppercase italic opacity-60">BI Analytics • Saudade do Carai</p>
          </div>
          <div className="flex gap-3">
             <div className={`${glassStyle} px-6 py-3`}>
                <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mb-1">Impressões Canal</p>
                <p className="text-xl font-black text-white">110.218.166</p>
             </div>
             <div className={`${glassStyle} px-6 py-3 border-[#ff5a00]/30`}>
                <p className="text-[9px] text-[#ff5a00] font-black uppercase tracking-widest mb-1">Custo Efetivo</p>
                <p className="text-xl font-black text-white italic">R$ 0,003</p>
             </div>
          </div>
        </header>

        {/* SECTION 1: AUDIÊNCIA (VIEWS) */}
        <div className="space-y-4">
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 ml-2 italic">Audiência e Alcance (YouTube)</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`${glassStyle} p-6`}>
              <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Visualizações Totais</h3>
              <p className="text-3xl font-black text-white">{formatNum(37685527)}</p>
              <p className="text-[9px] text-emerald-400 mt-2 font-black">↑ 80,6% ORGÂNICO</p>
            </div>
            <div className={`${glassStyle} p-6`}>
              <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Views Playlists</h3>
              <p className="text-3xl font-black text-white">{formatNum(17255336)}</p>
              <p className="text-[9px] text-[#ff5a00] mt-2 font-black uppercase tracking-tighter italic">45,7% PARTICIPAÇÃO</p>
            </div>
            <div onClick={() => setActiveMetric('visualizations')} className={`${glassStyle} p-6 cursor-pointer ${activeMetric === 'visualizations' ? 'border-[#ff5a00] bg-[#ff5a00]/5' : ''}`}>
              <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Views Pagas (Ads)</h3>
              <p className="text-3xl font-black text-white">{formatNum(9367214)}</p>
              <p className="text-[9px] text-zinc-600 mt-2 font-bold uppercase">ORIGEM PUBLICIDADE</p>
            </div>
          </div>
        </div>

        {/* SECTION 2: FINANCEIRO (INVESTIMENTO LARGO) */}
        <div className="space-y-4">
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 ml-2 italic">Eficiência e Investimento (Ads)</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div onClick={() => setActiveMetric('cost')} className={`${glassStyle} md:col-span-2 p-6 cursor-pointer ${activeMetric === 'cost' ? 'border-[#ff5a00] bg-[#ff5a00]/5' : ''}`}>
              <h3 className="text-[10px] font-black text-[#ff5a00] uppercase tracking-widest mb-1 italic">Investimento Total Campanha</h3>
              <p className="text-3xl md:text-4xl font-black text-white">R$ {formatNum(130432.92, false, 2)}</p>
            </div>
            <div onClick={() => setActiveMetric('cpv')} className={`${glassStyle} p-6 cursor-pointer flex flex-col justify-center items-center ${activeMetric === 'cpv' ? 'border-[#ff5a00] bg-[#ff5a00]/5' : ''}`}>
              <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">CPV Campanha</h3>
              <p className="text-2xl font-black text-emerald-400">R$ 0,02</p>
            </div>
            <div onClick={() => setActiveMetric('cpm')} className={`${glassStyle} p-6 cursor-pointer flex flex-col justify-center items-center ${activeMetric === 'cpm' ? 'border-[#ff5a00] bg-[#ff5a00]/5' : ''}`}>
              <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">CPM Médio</h3>
              <p className="text-2xl font-black text-white italic">R$ 2,04</p>
            </div>
          </div>
        </div>

        {/* SECTION 3: MAPA + DETALHES + RANKING */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className={`${glassStyle} p-6 overflow-hidden`}>
            <BrazilMap activeState={activeState} onStateClick={(id) => setActiveState(id)} data={statesData} activeMetric={activeMetric} />
          </div>

          <div className="flex flex-col gap-6">
            {/* PAINEL LARANJA EXECUTIVO */}
            <div className="bg-[#ff5a00] p-8 rounded-[2.5rem] shadow-2xl min-h-[220px] flex flex-col justify-center text-white relative overflow-hidden group">
              <div className="absolute top-[-20%] right-[-10%] w-[40%] h-[40%] bg-white/20 blur-[60px] rounded-full" />
              {activeState && statesData[activeState] ? (
                <div className="w-full relative z-10">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-black uppercase tracking-widest text-sm italic text-black/40">{statesData[activeState].name}</span>
                    <button onClick={() => setActiveState(null)} className="text-black/30 hover:text-black font-black text-[9px] underline uppercase">Fechar</button>
                  </div>
                  <div className="flex items-baseline gap-2 leading-none">
                    <AnimatedValue 
                      value={formatNum(statesData[activeState][activeMetric], activeMetric === 'cost' || activeMetric === 'cpv' || activeMetric === 'cpm', (activeMetric === 'visualizations') ? 0 : 2)} 
                      className="text-5xl md:text-6xl font-black tracking-tighter drop-shadow-xl"
                    />
                  </div>
                  <div className="mt-6 pt-4 border-t border-white/20 flex gap-8">
                     <div>
                        <p className="text-black/50 text-[9px] font-black uppercase tracking-widest italic leading-none">Gasto Regional</p>
                        <p className="text-lg font-black italic">R$ {statesData[activeState].cost}</p>
                     </div>
                     <div>
                        <p className="text-black/50 text-[9px] font-black uppercase tracking-widest italic leading-none">CPM UF</p>
                        <p className="text-lg font-black italic">R$ {statesData[activeState].cpm}</p>
                     </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center opacity-70 text-center relative z-10">
                  <p className="font-black uppercase text-xl tracking-tighter">BI ESTRATÉGICO</p>
                  <p className="text-[9px] font-bold uppercase tracking-[0.3em] mt-2 opacity-60">Selecione uma região no mapa</p>
                </div>
              )}
            </div>

            {/* TOP 5 RANKING */}
            <div className={`${glassStyle} p-6 flex-1`}>
              <h2 className="text-[10px] font-black mb-6 text-zinc-500 uppercase tracking-[0.5em] italic text-center">Top Eficiência Regional</h2>
              <div className="space-y-3">
                {topStates.map(([id, state], i) => (
                  <motion.div 
                    key={id} 
                    whileHover={{ x: 5 }}
                    onClick={() => setActiveState(id)} 
                    className={`cursor-pointer flex justify-between items-center p-4 rounded-2xl transition-all border ${activeState === id ? 'bg-[#ff5a00] border-transparent scale-[1.02]' : 'bg-white/[0.02] border-white/5 hover:border-zinc-700'}`}
                  >
                    <div className="flex items-center gap-4">
                      <span className={`font-black italic text-lg ${activeState === id ? 'text-black/30' : 'text-[#ff5a00]/60'}`}>0{i+1}</span>
                      <span className="font-black uppercase text-[11px] tracking-widest truncate max-w-[120px]">{state.name}</span>
                    </div>
                    <span className="font-black text-sm">{(activeMetric === 'cost' || activeMetric === 'cpv' || activeMetric === 'cpm') && "R$ "}{state[activeMetric]}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}