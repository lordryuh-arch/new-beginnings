import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { 
  Home, 
  Search, 
  PlusSquare, 
  Users, 
  User, 
  Bell, 
  Gamepad2,
  Trophy,
  BookOpen,
  Map,
  MessageSquare,
  Heart,
  Share2,
  Bookmark,
  Sparkles
} from 'lucide-react';

export const Route = createFileRoute('/community/')({
  component: CommunityLayout,
});

function CommunityLayout() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="min-h-screen bg-[#0a0510] text-slate-100 font-sans selection:bg-purple-500/30">
      {/* Background Energy Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/20 blur-[120px] rounded-full" />
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row min-h-screen">
        
        {/* Sidebar Navigation - Desktop */}
        <aside className="hidden md:flex flex-col w-64 border-r border-white/5 p-6 sticky top-0 h-screen">
          <div className="mb-10 px-2">
            <h1 className="text-2xl font-black tracking-tighter bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              SAFIRITY
            </h1>
          </div>

          <nav className="flex-1 space-y-1">
            <NavItem icon={<Home size={22} />} label="Início" active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
            <NavItem icon={<Search size={22} />} label="Explorar" active={activeTab === 'explore'} onClick={() => setActiveTab('explore')} />
            <NavItem icon={<PlusSquare size={22} />} label="Criar" active={activeTab === 'create'} onClick={() => setActiveTab('create')} />
            <NavItem icon={<Users size={22} />} label="Comunidade" active={activeTab === 'community'} onClick={() => setActiveTab('community')} />
            <NavItem icon={<Bell size={22} />} label="Notificações" active={activeTab === 'notifications'} onClick={() => setActiveTab('notifications')} />
            <NavItem icon={<User size={22} />} label="Perfil" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
          </nav>

          <div className="mt-auto pt-6 border-t border-white/5">
            <a 
              href="/idle" 
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 transition-all font-bold shadow-lg shadow-purple-500/20"
            >
              <Gamepad2 size={20} />
              <span>JOGAR AGORA</span>
            </a>
          </div>
        </aside>

        {/* Main Feed */}
        <main className="flex-1 border-r border-white/5 min-w-0">
          <header className="sticky top-0 z-20 backdrop-blur-xl bg-[#0a0510]/80 border-b border-white/5 px-6 py-4 flex justify-between items-center">
            <h2 className="text-lg font-bold">Feed Social</h2>
            <div className="flex items-center gap-4 md:hidden">
               <h1 className="text-xl font-black tracking-tighter bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                S
              </h1>
            </div>
          </header>

          <div className="p-4 space-y-6 pb-24 md:pb-4">
            {/* Example Post: Achievement */}
            <AchievementPost 
              trainer="RedFlame" 
              level={42} 
              time="há 2h"
              content="Finalmente consegui meu Shiny Charizard! ✨🔥"
              achievement="CONQUISTA RARA"
            />

            {/* Example Post: Discovery */}
            <DiscoveryPost 
              trainer="LunaMoon" 
              level={35} 
              time="há 4h"
              content="Dica: Melhor build para Dragonite no mapa 5!"
            />

            {/* Daily Rewards Card */}
            <DailyRewardsCard />
          </div>
        </main>

        {/* Right Sidebar - Discovery/Widgets */}
        <aside className="hidden lg:flex flex-col w-80 p-6 sticky top-0 h-screen space-y-6 overflow-y-auto">
          <div className="bg-white/5 rounded-2xl p-4 border border-white/5 backdrop-blur-sm">
            <h3 className="text-sm font-bold text-slate-400 mb-4 px-1 uppercase tracking-wider">Descobertas do dia</h3>
            <div className="space-y-4">
              <DiscoveryItem title="Estratégia incrível para Gengar!" trainer="DarkMaster" />
              <DiscoveryItem title="Como farmar Ruby rápido no Vulcão" trainer="RubyHunter" />
            </div>
            <button className="w-full mt-4 py-2 text-xs font-bold text-purple-400 hover:text-purple-300 transition-colors">
              Ver todas as descobertas
            </button>
          </div>

          <div className="bg-white/5 rounded-2xl p-4 border border-white/5 backdrop-blur-sm">
            <h3 className="text-sm font-bold text-slate-400 mb-4 px-1 uppercase tracking-wider">Clubes em destaque</h3>
            <div className="space-y-3">
              <ClubItem name="Clube dos Shinys" members="23.8K" color="text-yellow-400" />
              <ClubItem name="Clube dos Breeders" nameDesc="18.5K membros" color="text-green-400" />
              <ClubItem name="Clube dos Artistas" nameDesc="12.4K membros" color="text-pink-400" />
            </div>
            <button className="w-full mt-4 py-2 text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors">
              Explorar todos os clubes
            </button>
          </div>
        </aside>

        {/* Mobile Bottom Nav */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0a0510]/95 backdrop-blur-xl border-t border-white/5 flex justify-around items-center p-3 px-6">
          <MobileNavItem icon={<Home size={24} />} active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
          <MobileNavItem icon={<Search size={24} />} active={activeTab === 'explore'} onClick={() => setActiveTab('explore')} />
          <div className="bg-gradient-to-tr from-purple-600 to-blue-600 p-3 rounded-full shadow-lg shadow-purple-500/40 relative -top-4 border-4 border-[#0a0510]">
            <PlusSquare size={24} className="text-white" />
          </div>
          <MobileNavItem icon={<Bell size={24} />} active={activeTab === 'notifications'} onClick={() => setActiveTab('notifications')} />
          <MobileNavItem icon={<User size={24} />} active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
        </nav>
      </div>
    </div>
  );
}

// Helper Components
function NavItem({ icon, label, active, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all font-medium ${
        active 
          ? 'bg-white/10 text-white shadow-inner border border-white/5' 
          : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
      }`}
    >
      <span className={active ? 'text-purple-400' : ''}>{icon}</span>
      <span>{label}</span>
    </button>
  );
}

function MobileNavItem({ icon, active, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={`p-2 transition-all ${active ? 'text-purple-400 scale-110' : 'text-slate-500'}`}
    >
      {icon}
    </button>
  );
}

function AchievementPost({ trainer, level, time, content, achievement }: any) {
  return (
    <div className="bg-white/5 rounded-3xl p-6 border border-white/10 backdrop-blur-sm relative overflow-hidden group">
      {/* Achievement Banner */}
      <div className="absolute top-0 right-0 px-4 py-1 bg-yellow-500/20 text-yellow-500 text-[10px] font-black tracking-widest uppercase border-b border-l border-yellow-500/20 rounded-bl-xl">
        {achievement}
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 p-0.5 shadow-lg shadow-purple-500/20">
          <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-xs font-bold border border-white/10">
            {trainer[0]}
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">{trainer}</span>
            <span className="text-[10px] px-1.5 py-0.5 bg-white/10 rounded-md text-slate-400 uppercase tracking-tighter">Nível {level}</span>
          </div>
          <span className="text-xs text-slate-500">{time}</span>
        </div>
      </div>

      <p className="text-slate-200 mb-6 text-lg font-medium leading-relaxed">
        {content}
      </p>

      {/* Large Featured Image (Placeholder) */}
      <div className="aspect-square w-full rounded-2xl bg-gradient-to-br from-purple-600/20 to-blue-600/20 border border-white/10 mb-6 flex items-center justify-center relative group-hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] transition-all">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.2),transparent_70%)]" />
        <div className="text-slate-400 flex flex-col items-center gap-3">
          <Sparkles size={48} className="text-purple-400 animate-pulse" />
          <span className="text-sm font-bold uppercase tracking-widest text-white/50">Card Lendário</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-white/5">
        <div className="flex items-center gap-6">
          <button className="flex items-center gap-2 text-slate-400 hover:text-purple-400 transition-colors">
            <Heart size={20} />
            <span className="text-sm font-bold">1,250</span>
          </button>
          <button className="flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors">
            <MessageSquare size={20} />
            <span className="text-sm font-bold">320</span>
          </button>
          <button className="flex items-center gap-2 text-slate-400 hover:text-green-400 transition-colors">
            <Share2 size={20} />
            <span className="text-sm font-bold">98</span>
          </button>
        </div>
        <button className="text-slate-400 hover:text-white transition-colors">
          <Bookmark size={20} />
        </button>
      </div>
    </div>
  );
}

function DiscoveryPost({ trainer, level, time, content }: any) {
  return (
    <div className="bg-white/5 rounded-3xl p-6 border border-white/10 backdrop-blur-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-slate-800 p-0.5 border border-white/10">
          <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-xs font-bold">
            {trainer[0]}
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">{trainer}</span>
            <span className="text-[10px] px-1.5 py-0.5 bg-white/10 rounded-md text-slate-400 uppercase tracking-tighter">Nível {level}</span>
          </div>
          <span className="text-xs text-slate-500">{time}</span>
        </div>
      </div>

      <p className="text-slate-300 mb-6 text-base leading-relaxed">
        {content}
      </p>

      {/* Small Strategy Card */}
      <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5 hover:border-white/10 transition-colors cursor-pointer group">
        <div className="w-16 h-16 rounded-xl bg-slate-800 flex items-center justify-center overflow-hidden border border-white/10">
          <div className="w-full h-full bg-gradient-to-tr from-green-500/20 to-blue-500/20 flex items-center justify-center">
            <Map size={24} className="text-white/40 group-hover:scale-110 transition-transform" />
          </div>
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-bold text-white mb-1">Guia de Exploração Profissional</h4>
          <p className="text-xs text-slate-500">Aprenda a otimizar cada passo na Rota 5.</p>
        </div>
        <div className="p-2 bg-white/5 rounded-full text-slate-400 group-hover:text-white transition-colors">
          <PlusSquare size={20} />
        </div>
      </div>

      <div className="flex items-center gap-6 mt-6">
        <button className="flex items-center gap-2 text-slate-400 hover:text-purple-400 transition-colors">
          <Heart size={18} />
          <span className="text-xs font-bold">45</span>
        </button>
        <button className="flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors">
          <MessageSquare size={18} />
          <span className="text-xs font-bold">12</span>
        </button>
      </div>
    </div>
  );
}

function DailyRewardsCard() {
  return (
    <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 rounded-3xl p-6 border border-purple-500/20 backdrop-blur-md relative overflow-hidden">
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-purple-500/10 blur-3xl rounded-full" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <Trophy size={20} className="text-yellow-400" />
          <h3 className="text-lg font-black tracking-tight text-white uppercase italic">POKÉDROPS</h3>
        </div>
        <p className="text-purple-200/70 text-sm mb-6 max-w-[200px]">Caixas surpresa diárias com itens exclusivos para a comunidade!</p>
        
        <button className="bg-white text-slate-900 px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all shadow-xl shadow-purple-500/10">
          Resgatar Recompensa
        </button>
      </div>
    </div>
  );
}

function DiscoveryItem({ title, trainer }: any) {
  return (
    <div className="flex flex-col gap-1 cursor-pointer group">
      <h4 className="text-sm font-medium text-slate-200 group-hover:text-purple-400 transition-colors line-clamp-2 leading-tight">
        {title}
      </h4>
      <span className="text-[10px] text-slate-500 uppercase tracking-tighter">por {trainer}</span>
    </div>
  );
}

function ClubItem({ name, members, nameDesc, color }: any) {
  return (
    <div className="flex items-center gap-3 p-1 cursor-pointer group">
      <div className={`w-2 h-2 rounded-full ${color.replace('text-', 'bg-')}`} />
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-bold text-slate-200 truncate group-hover:text-white transition-colors">
          {name}
        </h4>
        <p className="text-[10px] text-slate-500 truncate uppercase tracking-tighter">
          {members ? `${members} membros` : nameDesc}
        </p>
      </div>
    </div>
  );
}
