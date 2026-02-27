"use client";

import BrazilMap from "@/components/BrazilMap";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Dados Oficiais Consolidados
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

type Metric = 'visualizations' | 'cost' | 'cpv' | 'cpm' | 'impressions';

const formatNum = (val: string | number, isCurrency = false, decimals = 0) => {
  const num = typeof val === 'string' ? parseFloat(val.replace(/\./g, "").replace(",", ".")) : val;
  return new Intl.NumberFormat('pt-BR', {
    style: isCurrency ? 'currency' : 'decimal',
    currency: 'BRL',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
};

const AnimatedValue = ({ value, className }: { value: string | number; className?: string }) => (
  <AnimatePresence mode="wait">
    <motion.span
      key={value}
      initial={{ opacity: 0, y: 5, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -5, filter: "blur(6px)" }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={`inline-block ${className}`}
    >
      {value}
    </motion.span>
  </AnimatePresence>
);

export default function Dashboard() {
  const [activeState, setActiveState] = useState<string | null>(null);
  const [activeMetric, setActiveMetric] = useState<Metric>('visualizations');

  const metricLabels: Record<Metric, string> = {
    visualizations: "Views Pagas", cost: "Investimento Ads", cpv: "CPV Campanha", cpm: "CPM Campanha", impressions: "Impressões Ads"
  };

  const topStates = Object.entries(statesData)
    .sort(([, a], [, b]) => {
      const valA = parseFloat(a[activeMetric].replace(/\./g, "").replace(",", "."));
      const valB = parseFloat(b[activeMetric].replace(/\./g, "").replace(",", "."));
      return (activeMetric === 'cpv' || activeMetric === 'cpm') ? valA - valB : valB - valA;
    })
    .slice(0, 5);

  const glassCard = "bg-white/[0.03] border border-white/10 backdrop-blur-xl rounded-[2rem] shadow-2xl transition-all duration-300 hover:bg-white/[0.06] hover:border-white/20";

  const insights = [
    { title: "Organic Uplift", text: "Proporção de 1:4.02. Para cada visualização paga, o canal gerou mais de 4 visualizações orgânicas espontâneas.", icon: "📈", color: "text-emerald-400" },
    { title: "Eficiência CPM", text: "Maranhão lidera o ranking com custo de R$ 1,71 por mil impressões, 16% abaixo da média nacional.", icon: "📍", color: "text-[#ff5a00]" },
    { title: "Retenção Editorial", text: "O tráfego de playlists apresenta 2:26m de duração média, validando a alta aderência do clipe.", icon: "🎧", color: "text-blue-400" },
    { title: "Recall de Marca", text: "3.3 milhões de buscas ativas pela artista provam a força da marca e intenção de consumo clara.", icon: "🔥", color: "text-purple-400" }
  ];

  const suggestions = [
    { title: "Otimização Geográfica", text: "Migrar 15% do budget de estados com alto CPM (RS/RJ) para estados de alta eficiência (MA/TO/PI) no próximo lançamento." },
    { title: "Estratégia de Retenção", text: "Criar versões 'Corte de Playlist' de 15s-30s focadas nos momentos de maior engajamento para reduzir ainda mais o CPV." },
    { title: "SEO de Pesquisa", text: "Utilizar os termos das 3.3M de buscas para otimizar as tags e descrições dos próximos clipes, aumentando o tráfego orgânico direto." }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 p-4 md:p-8 lg:p-12 font-sans selection:bg-[#ff5a00] overflow-x-hidden">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* HEADER */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white leading-none">
              <span className="text-[#ff5a00]">DASH</span> <span className="text-zinc-700">|</span> Mari Fernandez
            </h1>
            <p className="text-zinc-500 font-bold text-[10px] tracking-[0.4em] uppercase italic opacity-60">BI Analytics • Saudade do Carai</p>
          </div>
          <div className="flex gap-3">
             <div className={`${glassCard} px-6 py-3`}>
                <p className="text-[9px] text-zinc-500 font-black uppercase tracking-widest mb-1 italic">Impressões Totais Canal</p>
                <p className="text-xl font-black text-white leading-none">110.218.166</p>
             </div>
             <div className={`${glassCard} px-6 py-3 border-[#ff5a00]/30 shadow-[0_0_20px_rgba(255,90,0,0.1)]`}>
                <p className="text-[9px] text-[#ff5a00] font-black uppercase tracking-widest mb-1 italic">Custo Efetivo Final</p>
                <p className="text-xl font-black text-white leading-none italic">R$ 0,003</p>
             </div>
          </div>
        </header>

        {/* SECTION 1: AUDIÊNCIA */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`${glassCard} p-6`}>
            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Views Totais (YT)</h3>
            <p className="text-3xl font-black text-white">{formatNum(37685527)}</p>
            <p className="text-[9px] text-emerald-400 mt-2 font-black italic">↑ 80,6% ORGÂNICO</p>
          </div>
          <div className={`${glassCard} p-6`}>
            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Views de Playlists</h3>
            <p className="text-3xl font-black text-white">{formatNum(17255336)}</p>
            <p className="text-[9px] text-[#ff5a00] mt-2 font-black uppercase tracking-tighter italic">45,7% PARTICIPAÇÃO</p>
          </div>
          <div onClick={() => setActiveMetric('visualizations')} className={`${glassCard} p-6 cursor-pointer ${activeMetric === 'visualizations' ? 'border-[#ff5a00] bg-[#ff5a00]/5' : ''}`}>
            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Views Pagas (Ads)</h3>
            <p className="text-3xl font-black text-white">{formatNum(9367214)}</p>
            <p className="text-[9px] text-zinc-600 mt-2 font-bold uppercase italic">Fator de Impulso</p>
          </div>
        </div>

        {/* SECTION 2: FINANCEIRO */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div onClick={() => setActiveMetric('cost')} className={`${glassCard} md:col-span-2 p-6 cursor-pointer ${activeMetric === 'cost' ? 'border-[#ff5a00] bg-[#ff5a00]/5' : ''}`}>
            <h3 className="text-[10px] font-black text-[#ff5a00] uppercase tracking-widest mb-1 italic">Investimento Total Campanha</h3>
            <p className="text-3xl md:text-[2.6rem] font-black text-white leading-none whitespace-nowrap">R$ {formatNum(130432.92, false, 2)}</p>
          </div>
          <div onClick={() => setActiveMetric('cpv')} className={`${glassCard} p-6 cursor-pointer flex flex-col justify-center items-center ${activeMetric === 'cpv' ? 'border-[#ff5a00] bg-[#ff5a00]/5' : ''}`}>
            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">CPV Campanha</h3>
            <p className="text-2xl font-black text-emerald-400 italic">R$ 0,02</p>
          </div>
          <div onClick={() => setActiveMetric('cpm')} className={`${glassCard} p-6 cursor-pointer flex flex-col justify-center items-center ${activeMetric === 'cpm' ? 'border-[#ff5a00] bg-[#ff5a00]/5' : ''}`}>
            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">CPM Médio</h3>
            <p className="text-2xl font-black text-white italic opacity-80">R$ 2,04</p>
          </div>
        </div>

        {/* SECTION 3: MAPA + DETALHES */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className={`${glassCard} p-8 overflow-hidden shadow-inner`}>
            <BrazilMap activeState={activeState} onStateClick={(id) => setActiveState(id)} data={statesData} activeMetric={activeMetric} />
          </div>
          <div className="flex flex-col gap-6">
            <div className="bg-[#ff5a00] p-10 rounded-[3rem] shadow-[0_20px_60px_rgba(255,90,0,0.3)] min-h-[220px] flex flex-col justify-center text-white relative overflow-hidden group">
              <div className="absolute top-[-20%] right-[-10%] w-[40%] h-[40%] bg-white/20 blur-[60px] rounded-full" />
              {activeState && statesData[activeState] ? (
                <div className="w-full relative z-10">
                  <div className="flex justify-between items-center mb-6">
                    <span className="font-black uppercase tracking-widest text-lg italic text-black/40">{statesData[activeState].name}</span>
                    <button onClick={() => setActiveState(null)} className="text-black/30 hover:text-black font-black text-[10px] underline uppercase">Fechar</button>
                  </div>
                  <div className="flex items-baseline gap-2 leading-none">
                    {(activeMetric !== 'visualizations' && activeMetric !== 'impressions') && <span className="text-2xl md:text-3xl font-black">R$</span>}
                    <AnimatedValue 
                      value={formatNum(statesData[activeState][activeMetric], false, (activeMetric === 'visualizations' || activeMetric === 'impressions') ? 0 : 2)} 
                      className="text-5xl md:text-7xl font-black tracking-tighter drop-shadow-xl truncate"
                    />
                  </div>
                  <div className="mt-8 pt-6 border-t border-white/20 flex gap-12">
                     <div><p className="text-black/50 text-[10px] font-black uppercase tracking-widest mb-1 italic">Gasto UF</p><p className="text-xl font-black italic">R$ {statesData[activeState].cost}</p></div>
                     <div><p className="text-black/50 text-[10px] font-black uppercase tracking-widest mb-1 italic">CPM UF</p><p className="text-xl font-black italic">R$ {statesData[activeState].cpm}</p></div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center opacity-80 text-center relative z-10">
                  <p className="font-black uppercase text-2xl tracking-tighter italic leading-none">INTELIGÊNCIA REGIONAL</p>
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] mt-3 opacity-60 italic">Selecione no mapa para detalhar</p>
                </div>
              )}
            </div>

            <div className={`${glassCard} p-8 flex-1`}>
              <h2 className="text-[10px] font-black mb-8 text-zinc-500 uppercase tracking-[0.5em] italic text-center">Top Eficiência Regional</h2>
              <div className="space-y-4">
                {topStates.map(([id, state], i) => (
                  <motion.div key={id} whileHover={{ x: 5 }} onClick={() => setActiveState(id)} className={`cursor-pointer flex justify-between items-center p-5 rounded-[1.5rem] transition-all border ${activeState === id ? 'bg-[#ff5a00] border-transparent scale-[1.02] shadow-lg' : 'bg-white/[0.02] border-white/5 hover:border-zinc-700'}`}>
                    <div className="flex items-center gap-5">
                      <span className={`font-black italic text-xl ${activeState === id ? 'text-black/30' : 'text-[#ff5a00]/60'}`}>0{i+1}</span>
                      <span className="font-black uppercase text-[12px] tracking-widest">{state.name}</span>
                    </div>
                    <span className="font-black text-base">{(activeMetric !== 'visualizations' && activeMetric !== 'impressions') && "R$ "}{state[activeMetric]}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 4: INTELIGÊNCIA E SUGESTÕES */}
        <section className="pt-16 space-y-12 border-t border-zinc-900/50">
          <div className="space-y-6">
            <h2 className="text-[11px] font-black uppercase tracking-[0.6em] text-zinc-600 ml-2 italic opacity-60">Análise de Inteligência Estratégica</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {insights.map((insight, idx) => (
                <div key={idx} className={`${glassCard} p-8 flex flex-col gap-4 group`}>
                  <div className="text-3xl filter drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">{insight.icon}</div>
                  <div>
                    <h3 className={`text-[11px] font-black uppercase tracking-widest mb-2 ${insight.color}`}>{insight.title}</h3>
                    <p className="text-[11px] text-zinc-500 font-medium leading-relaxed group-hover:text-zinc-200 transition-colors italic">{insight.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={`${glassCard} p-10 bg-gradient-to-br from-[#ff5a00]/10 to-transparent border-[#ff5a00]/20`}>
            <h2 className="text-[11px] font-black uppercase tracking-[0.6em] text-[#ff5a00] mb-8 italic">Recomendações Próximo Lançamento</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {suggestions.map((sug, idx) => (
                <div key={idx} className="space-y-3 relative pl-6 border-l border-zinc-800 hover:border-[#ff5a00] transition-colors">
                  <span className="absolute left-[-5px] top-0 w-2.5 h-2.5 rounded-full bg-[#ff5a00] shadow-[0_0_10px_#ff5a00]" />
                  <h4 className="text-xs font-black uppercase tracking-widest text-zinc-300 italic">{sug.title}</h4>
                  <p className="text-[11px] text-zinc-500 leading-relaxed font-medium">{sug.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FOOTER EXECUTIVO */}
        <footer className="pt-10 pb-8 text-center space-y-2 opacity-40 hover:opacity-100 transition-opacity duration-500">
           <div className="h-px w-24 bg-gradient-to-r from-transparent via-zinc-500 to-transparent mx-auto mb-6" />
           <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-zinc-400">
              &copy; 2026 • Mari Fernandez • Todos os direitos reservados
           </p>
           <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600">
              Desenvolvido por <span className="text-[#ff5a00] italic">Éricles</span>
           </p>
        </footer>

      </div>
    </div>
  );
}