import React, { useState } from 'react';
import { Search, TrendingUp, AlertCircle, CheckCircle2, Info, BookOpen, ShieldAlert, Activity, DollarSign, BarChart3, HelpCircle, ArrowRight } from 'lucide-react';
import { analyzeStock, StockAnalysis } from './services/gemini';
import { motion } from 'motion/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data for the chart to make it look like a real app
const mockChartData = [
  { name: 'Jan', price: 120 },
  { name: 'Feb', price: 132 },
  { name: 'Mar', price: 125 },
  { name: 'Apr', price: 140 },
  { name: 'May', price: 138 },
  { name: 'Jun', price: 150 },
  { name: 'Jul', price: 145 },
  { name: 'Aug', price: 160 },
];

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<StockAnalysis | null>(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'scorecard' | 'checklist' | 'support'>('overview');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError('');
    setAnalysis(null);
    setActiveTab('overview');

    try {
      const result = await analyzeStock(searchQuery);
      setAnalysis(result);
    } catch (err) {
      console.error(err);
      setError('Could not analyze this stock. Please try another one.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black font-sans text-white selection:bg-white/30">
      {/* Header */}
      <header className="border-b border-white/10 sticky top-0 z-10 bg-black/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-serif tracking-widest uppercase">SimpliStock</span>
          </div>
          <div className="text-xs font-sans tracking-[0.2em] text-white/50 uppercase hidden sm:block">
            Investing, Refined.
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12 sm:py-20">
        {/* Search Section */}
        <div className="max-w-3xl mx-auto mb-20 text-center">
          <h1 className="text-5xl sm:text-7xl font-serif font-light mb-6 tracking-tight leading-[0.9]">
            Understand any stock.
          </h1>
          <p className="text-white/50 text-lg sm:text-xl font-light mb-12 max-w-xl mx-auto">
            No jargon. No confusing charts. Just clear answers to help you decide.
          </p>
          
          <form onSubmit={handleSearch} className="relative max-w-xl mx-auto">
            <input
              type="text"
              className="block w-full bg-transparent border-b border-white/30 py-4 pl-4 pr-32 text-2xl font-light text-white placeholder:text-white/20 focus:border-white focus:outline-none transition-colors rounded-none"
              placeholder="Enter a company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="submit"
              disabled={loading || !searchQuery.trim()}
              className="absolute right-0 bottom-4 text-xs tracking-[0.15em] uppercase font-medium text-white/70 hover:text-white disabled:opacity-30 transition-colors flex items-center gap-2"
            >
              {loading ? 'Analyzing...' : 'Analyze'} <ArrowRight className="w-4 h-4" />
            </button>
          </form>
          {error && (
            <div className="mt-8 p-4 border border-red-500/30 bg-red-500/10 text-red-200 flex items-start gap-3 justify-center max-w-xl mx-auto">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p className="font-light">{error}</p>
            </div>
          )}
        </div>

        {/* Results Section */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="w-16 h-16 border border-white/20 border-t-white rounded-full animate-spin mb-8"></div>
            <p className="text-white/50 font-light tracking-widest uppercase text-sm animate-pulse">Synthesizing Data...</p>
          </div>
        )}

        {analysis && !loading && (
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="border border-white/10 bg-white/[0.02]"
          >
            {/* Stock Header */}
            <div className="p-8 sm:p-12 border-b border-white/10">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8 mb-12">
                <div>
                  <p className="text-xs tracking-[0.2em] text-white/50 uppercase mb-4">Analysis Complete</p>
                  <h2 className="text-6xl sm:text-8xl font-serif font-light capitalize leading-none">{searchQuery}</h2>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-xs tracking-[0.2em] text-white/50 uppercase mb-2">Current Price (Mock)</p>
                  <p className="text-4xl font-light">₹160.00</p>
                  <p className="text-emerald-400 font-light text-sm mt-2">
                    +2.4% today
                  </p>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex overflow-x-auto hide-scrollbar gap-4 pb-4 border-b border-white/10">
                <TabButton 
                  active={activeTab === 'overview'} 
                  onClick={() => setActiveTab('overview')}
                  label="01. Overview"
                />
                <TabButton 
                  active={activeTab === 'scorecard'} 
                  onClick={() => setActiveTab('scorecard')}
                  label="02. Scorecard"
                />
                <TabButton 
                  active={activeTab === 'checklist'} 
                  onClick={() => setActiveTab('checklist')}
                  label="03. Buy Now?"
                />
                <TabButton 
                  active={activeTab === 'support'} 
                  onClick={() => setActiveTab('support')}
                  label="04. Support"
                />
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-8 sm:p-12 min-h-[400px]">
              {activeTab === 'overview' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-12">
                  <div className="max-w-3xl">
                    <h3 className="text-xs tracking-[0.2em] text-white/50 uppercase mb-6">Company Summary</h3>
                    <p className="text-2xl sm:text-3xl font-light leading-relaxed text-white/90">
                      {analysis.companySummary}
                    </p>
                  </div>
                  
                  <div className="pt-12 border-t border-white/10">
                    <h4 className="text-xs tracking-[0.2em] text-white/50 uppercase mb-8">Recent Price Trend (Mock Data)</h4>
                    <div className="h-80 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={mockChartData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} />
                          <YAxis domain={['dataMin - 10', 'dataMax + 10']} axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '0' }}
                            itemStyle={{ color: '#fff' }}
                          />
                          <Line type="monotone" dataKey="price" stroke="#fff" strokeWidth={2} dot={{ r: 4, fill: '#000', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6, fill: '#fff' }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'scorecard' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="grid gap-8 sm:grid-cols-3">
                  <ScoreCard 
                    title="Financial Health" 
                    content={analysis.scorecard.financialHealth}
                  />
                  <ScoreCard 
                    title="Growth" 
                    content={analysis.scorecard.growth}
                  />
                  <ScoreCard 
                    title="Valuation" 
                    content={analysis.scorecard.valuation}
                  />
                </motion.div>
              )}

              {activeTab === 'checklist' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="max-w-3xl">
                  <h3 className="text-xs tracking-[0.2em] text-white/50 uppercase mb-10">Quick 3-Point Checklist</h3>
                  <div className="space-y-8">
                    <ChecklistItem title="Price Context" content={analysis.buyNowChecklist.priceContext} />
                    <ChecklistItem title="Expert Opinion" content={analysis.buyNowChecklist.expertOpinion} />
                    <ChecklistItem title="Historical Pattern" content={analysis.buyNowChecklist.historicalPattern} />
                  </div>
                </motion.div>
              )}

              {activeTab === 'support' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="grid gap-8 sm:grid-cols-2">
                  <div className="p-8 border border-white/10 bg-white/[0.02]">
                    <h3 className="text-xs tracking-[0.2em] text-white/50 uppercase mb-6">What to Watch</h3>
                    <p className="text-xl font-light leading-relaxed">
                      {analysis.postBuySupport.whatToWatch}
                    </p>
                  </div>
                  <div className="p-8 border border-white/10 bg-white/[0.02]">
                    <h3 className="text-xs tracking-[0.2em] text-white/50 uppercase mb-6">When to Reconsider</h3>
                    <p className="text-xl font-light leading-relaxed">
                      {analysis.postBuySupport.exitLogic}
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
            
            {/* News Feed Section */}
            {analysis.news && analysis.news.length > 0 && (
              <div className="border-t border-white/10 p-8 sm:p-12 bg-white/[0.01]">
                <h3 className="text-xs tracking-[0.2em] text-white/50 uppercase mb-10">Recent News & Context</h3>
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                  {analysis.news.map((item, idx) => (
                    <div key={idx} className="group cursor-pointer">
                      <p className="text-xs tracking-widest text-white/40 uppercase mb-3">{item.date}</p>
                      <h4 className="text-lg font-serif mb-3 group-hover:text-white/70 transition-colors line-clamp-2">{item.title}</h4>
                      <p className="text-sm font-light text-white/60 leading-relaxed line-clamp-3">{item.summary}</p>
                      <div className="mt-4 h-px w-12 bg-white/20 group-hover:w-full transition-all duration-500"></div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </main>
    </div>
  );
}

function TabButton({ active, onClick, label }: { active: boolean, onClick: () => void, label: string }) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-3 text-xs tracking-[0.2em] uppercase whitespace-nowrap transition-all duration-300 ${
        active 
          ? 'text-white border-b border-white' 
          : 'text-white/40 border-b border-transparent hover:text-white/70'
      }`}
    >
      {label}
    </button>
  );
}

function ScoreCard({ title, content }: { title: string, content: string }) {
  return (
    <div className="p-8 border border-white/10 bg-white/[0.02] flex flex-col h-full">
      <h4 className="text-xs tracking-[0.2em] text-white/50 uppercase mb-6">{title}</h4>
      <p className="text-xl font-light leading-relaxed flex-grow">{content}</p>
    </div>
  );
}

function ChecklistItem({ title, content }: { title: string, content: string }) {
  return (
    <div className="flex gap-6 pb-8 border-b border-white/10 last:border-0 last:pb-0">
      <div className="mt-1 shrink-0">
        <div className="w-6 h-6 rounded-full border border-white/30 flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
        </div>
      </div>
      <div>
        <h4 className="text-xs tracking-[0.2em] text-white/50 uppercase mb-3">{title}</h4>
        <p className="text-xl font-light leading-relaxed">{content}</p>
      </div>
    </div>
  );
}
