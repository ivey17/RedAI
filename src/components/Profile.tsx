import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings, Share2, Plus, Zap, ChevronRight, Menu, X, MessageSquare, Sparkles, BookOpen, Bot, MousePointerClick, Sliders, ListFilter, ChevronDown } from 'lucide-react';
import { Album } from '../types';
import { MOCK_ALBUMS } from '../constants';

export const Profile = ({ onOpenAI, onAlbumClick, onOpenDeepDecision, onAlbumLongPress }: { 
  onOpenAI: () => void, 
  onAlbumClick: (album: Album, isSelectionMode: boolean) => void, 
  onOpenDeepDecision: () => void,
  onAlbumLongPress: (album: Album) => void
}) => {
  const [activeInternalTab, setActiveInternalTab] = React.useState('RedAI');
  const [selectedPlan, setSelectedPlan] = React.useState<any>(null);
  
  const [preferences, setPreferences] = React.useState([
    '预算偏好：精致穷', '风格偏好：极简主义',
    '美食倾向：地道川菜', '护肤成分：视黄醇控'
  ]);
  const [isEditingPreferences, setIsEditingPreferences] = React.useState(false);
  const [preferenceInput, setPreferenceInput] = React.useState('');
  const [isAnalyzingPreferences, setIsAnalyzingPreferences] = React.useState(false);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);
  const isLongPress = React.useRef(false);

  const startPress = (album: Album) => {
    isLongPress.current = false;
    timerRef.current = setTimeout(() => {
      onAlbumLongPress(album);
      isLongPress.current = true;
    }, 500);
  };

  const endPress = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const handleAlbumClickWithLongPress = (album: Album) => {
    if (isLongPress.current) return;
    onAlbumClick(album, false);
  };

  const collections = [
    { title: '我的北欧家具灵感', count: 24, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDOVjlTjvQvOZ8JMLLkxJ8DSBFWoxzJBALqIzz2NjSS-u6Tkv8x2C-niynqquPewWoSE9eRFg0frsMBaffaJZMANYRsMjKXrn-bsxQs_bHqPlNftt_1W3b1d47BpmSA9IQw7sH0AoTJvO3KZ2f-EXyXK06vlzigdQiRlBiURh8G6NNHDaXOeFavvrQoW0LZAemuaDSsG52LRLp-ACfh0LByRP1cMxF-cAKbjYE26VcYixZkCtoTOAgyuMaHBB3a3yUBbjema8qdrWI' },
    { title: '2024 春夏穿搭趋势', count: 12, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB8oZG3BvhDGe-GByT1k18f-dprW4AGFyw5shNqPIdV5k8LucpaqcSAQCrvmnlwEPVS1z2BytfLY1GncZKZCrOCXQYclZVUq-FNXIji4e02u1ZmPRDX7YKPwkgR5_RCnS48y-tb1124DQ7o4G1t7FOWUcBZVPJH8TMQj_MlAteVEod2U-9DzS10Pt2ZWO8Q34cHpbG5Y-WbCgZkcIJJVQfPsso-uustWgnku5DdGyEdW_cQE8T_vBqv5opQW-7vUTuF816vd6wLhZ0' },
    { title: '健康减脂餐食谱', count: 56, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDTz7tpI_WClSL0Ab4h00qNoCvGW63iYj07_JBSfGGNS_BX-ikjuuVHZSsCvemf4JWFNUVZ8By82hyBXWe-I237Swms7o-6a8FkP-s0gcPoqO6N0jXfrJIKxkZgmqaHu7KkjBdOpBTCN_9Yp2AhqN67pp1BURme0fFlCcUe_khBn_F95owimG3BfunEIFwriYOOD3erlUhvvs1UYvpj1FgE-2lQYn33O7ggnN51-yerwkjDbLDFeCQG_7bt1-fZICWdnh_dqVIZwSA' },
  ];

  const plans = [
    { title: '巴黎5日深度游行程方案', desc: '根据你的博物馆偏好和美食倾向定制，包含5个小众打卡点。', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB4lq1PxF-iAI_f2zznQOqKwLWLQSMsFqvCfqudmoGI_y6cLbfw3A7_kbpzyTDthLX5sog1Iv_oB3qWvbHNpO9GBRmyUxcfKQuN6mPfQsYO7gnj7lt4v4t01sqEKvhv_XA7BtlJ_IElQb74kzIjYEI-c8TGO4VseOig1w77XEyTF7L9_3DzVjE6NhhNoKzGrzh-KKzIbjD2IINqZOwGSSpI8Xhau0BZDji9E2YNz07bh_x8oOQwQMRYSAqHMd8aBiNGymxzpwWeGFI' },
  ];

  return (
    <main className="pb-24 pt-4 px-4 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <Menu size={24} className="text-gray-700" />
        <div className="flex gap-6">
          <Share2 size={22} className="text-gray-700" />
          <Settings size={22} className="text-gray-700" />
        </div>
      </div>

      <div className="flex justify-between items-start">
        <div className="relative group">
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCWix5SmjFaPegMGPxwp0m7DdTo2_pz8beNeH4zUFoJyqaLyO7L-lkQGiJOoIAPnqmYHrYmm-e0HT6qLx3BYZFn1vsMc1uvTX-x6YrhlpJ8zBu9L7pKVLQFxTzZkEvAXsrJP8Q1k-TzS9rq7Wy9iO9PsptPiwOl8yKbCegNiK2qV75gzFXKBBSuvV1qyBkAbmpATdot1vAE3ZOXfDRxXvds4C5SR1I04WlHle2TUPagA-MhrI8anPqnAWjHubq8xy9MQIwt1QbhZWE" 
            className="w-20 h-20 rounded-full border-4 border-white shadow-md object-cover" 
            alt="me" 
          />
          <div className="absolute bottom-0 right-0 bg-red-500 rounded-full p-1 border-2 border-white">
            <Plus size={12} className="text-white" />
          </div>
        </div>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Discovery Enthusiast</h1>
        <p className="text-sm text-gray-500 font-medium">小红书号：102938475</p>
        <div className="mt-2 text-sm text-gray-700">探索生活灵感，RedAI 帮你做更好的决策。</div>
      </div>

      <div className="flex gap-8 border-b border-gray-100 pb-4">
        <div className="text-center">
          <p className="font-bold text-lg">12</p>
          <p className="text-xs text-gray-400">笔记</p>
        </div>
        <div className="text-center">
          <p className="font-bold text-lg">86</p>
          <p className="text-xs text-gray-400">收藏</p>
        </div>
        <div className="text-center">
          <p className="font-bold text-lg">124</p>
          <p className="text-xs text-gray-400">赞过</p>
        </div>
      </div>

      {/* Tabs */}
        <div className="flex gap-6 overflow-x-auto no-scrollbar">
          {['笔记', '收藏', '赞过', 'RedAI'].map((tab) => (
            <button 
              key={tab} 
              onClick={() => setActiveInternalTab(tab)}
              className={`whitespace-nowrap px-1 pb-2 font-bold transition-colors flex items-center gap-1 ${activeInternalTab === tab ? 'text-red-500 border-b-2 border-red-500' : 'text-gray-500'}`}
            >
              {tab === 'RedAI' && <Zap size={14} className="fill-current" />}
              {tab}
            </button>
          ))}
        </div>

      {/* Tab Contents */}
      <AnimatePresence mode="wait">
        {activeInternalTab === 'RedAI' && (
          <motion.section 
            key="RedAI"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="space-y-6"
          >
            {/* Banner */}
            <div 
              onClick={onOpenDeepDecision}
              className="bg-gradient-to-r from-red-600 to-rose-500 p-6 rounded-2xl shadow-lg relative overflow-hidden group cursor-pointer active:scale-[0.98] transition-transform"
            >
              <div className="relative z-10">
                <h2 className="text-white font-bold text-xl mb-1">开启 RedAI 深度决策</h2>
                <p className="text-red-50/80 text-xs">基于全网笔记为您生成最专业的方案</p>
              </div>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 p-3 rounded-full backdrop-blur-md">
                <Sparkles className="text-white fill-current" size={24} />
              </div>
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-colors" />
            </div>

            {/* AI Solutions */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-red-100 rounded flex items-center justify-center">
                    <Zap className="text-red-500 fill-current" size={14} />
                  </div>
                  <h3 className="font-bold text-gray-800">我的 RedAI 决策方案</h3>
                </div>
                <span className="text-xs text-gray-400 flex items-center gap-0.5 cursor-pointer" onClick={onOpenAI}>
                  查看全部 <ChevronRight size={14} />
                </span>
              </div>
              
              <div className="space-y-3">
                {[
                  { 
                    id: 'paris',
                    title: '巴黎5日深度游行程方案', 
                    desc: '根据你的博物馆偏好和美食倾向定制，包含5个小众打卡点。', 
                    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB4lq1PxF-iAI_f2zznQOqKwLWLQSMsFqvCfqudmoGI_y6cLbfw3A7_kbpzyTDthLX5sog1Iv_oB3qWvbHNpO9GBRmyUxcfKQuN6mPfQsYO7gnj7lt4v4t01sqEKvhv_XA7BtlJ_IElQb74kzIjYEI-c8TGO4VseOig1w77XEyTF7L9_3DzVjE6NhhNoKzGrzh-KKzIbjD2IINqZOwGSSpI8Xhau0BZDji9E2YNz07bh_x8oOQwQMRYSAqHMd8aBiNGymxzpwWeGFI',
                    detail: {
                      tags: ['要求出片', '极致省钱'],
                      content: (
                        <div className="space-y-4 font-sans">
                          <p className="text-sm text-gray-700 leading-relaxed">
                            RedAI 分析了全网超过 <strong>500+</strong> 篇巴黎旅游笔记，根据您「想要出片」同时「也想要省钱」的需求，为您规划了以下高性价比路线：
                          </p>
                          <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                            <h4 className="font-bold text-red-600 mb-2">📸 出片 & 💰 省钱核心策略</h4>
                            <ul className="text-xs text-red-800 space-y-1.5 list-disc list-inside">
                              <li>避开高价网红餐厅，精选3家本地人常去的平价Bistro。</li>
                              <li>卢浮宫安排在免票日（或使用博物馆通票），并附赠最佳机位地图。</li>
                              <li>塞纳河畔野餐代替游船晚餐，省下 €100+ 且更具法式风情。</li>
                            </ul>
                          </div>
                          <div className="space-y-3">
                            <div className="bg-white p-3 border border-gray-100 rounded-lg shadow-sm">
                              <div className="font-bold text-sm text-gray-800">Day 1：经典地标的“免费”出片法</div>
                              <p className="text-xs text-gray-500 mt-1">埃菲尔铁塔（战神广场野餐视角） → 凯旋门（远景合影不登顶） → 蒙田大道（街拍）</p>
                            </div>
                            <div className="bg-white p-3 border border-gray-100 rounded-lg shadow-sm">
                              <div className="font-bold text-sm text-gray-800">Day 2：艺术与文艺的穷游体验</div>
                              <p className="text-xs text-gray-500 mt-1">卢浮宫（使用通票） → 杜乐丽花园（免费出片圣地） → 塞纳河畔旧书摊</p>
                            </div>
                            <div className="bg-white p-3 border border-gray-100 rounded-lg shadow-sm">
                              <div className="font-bold text-sm text-gray-800">Day 3-5：小众探索与跳蚤市场</div>
                              <p className="text-xs text-gray-500 mt-1">蒙马特高地（爱墙打卡） → 圣图安跳蚤市场（淘复古小物件） → 玛黑区平价美食</p>
                            </div>
                          </div>
                        </div>
                      )
                    }
                  },
                  { 
                    id: 'digital',
                    title: '2024夏季数码焕新购物清单', 
                    desc: '对比了120篇评测笔记，为你筛选出性价比最高的多款单品。', 
                    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBIyROshgqrxbCPqx0xnBYKPqr2EuA-2NebmH8HatiVbRtxtb7h7WYvH2G-ByK95YR1FgNyOI9PtIEzcUQ4zRo0MFtYZDyds-j1ixhDrRI6Ffdy4usRIqkqVUIU4ktCvNIMM3_zuE1iSMOzq3OEQ3Zu1-QEsylaRztm1U8sDv6njK-y9XLi4Cih-u2CxmlmEWYQc5EFBSuL7NP3gGSjEuQGEzAzawQMDyHgZqoKIGLC0wi1zMFMPklph2tT5yvcF_6WyJVm5ND3jAw',
                    detail: {
                      tags: ['游戏需求', '办公需求'],
                      content: (
                        <div className="space-y-4 font-sans">
                          <p className="text-sm text-gray-700 leading-relaxed">
                            RedAI 对比了全网 <strong>120篇</strong> 深度评测笔记，综合您的「游戏性能」与「轻薄办公」双重需求，为您推荐以下两款全能型笔记本：
                          </p>
                          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                            <table className="w-full text-xs text-left">
                              <thead className="bg-gray-50 text-gray-600">
                                <tr>
                                  <th className="p-2 font-bold border-b border-r border-gray-100">型号</th>
                                  <th className="p-2 font-bold border-b border-r border-gray-100">ROG 幻14 Air</th>
                                  <th className="p-2 font-bold border-b">联想 拯救者 Y9000X</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-100">
                                <tr>
                                  <td className="p-2 font-medium text-gray-800 border-r border-gray-100">显卡 (游戏)</td>
                                  <td className="p-2 text-gray-600 border-r border-gray-100">RTX 4060 (通吃主流3A)</td>
                                  <td className="p-2 text-gray-600">RTX 4070 (极致画质)</td>
                                </tr>
                                <tr>
                                  <td className="p-2 font-medium text-gray-800 border-r border-gray-100">重量 (办公)</td>
                                  <td className="p-2 text-green-600 font-bold border-r border-gray-100">1.5kg (极度轻薄)</td>
                                  <td className="p-2 text-orange-500">2.1kg (略重)</td>
                                </tr>
                                <tr>
                                  <td className="p-2 font-medium text-gray-800 border-r border-gray-100">屏幕</td>
                                  <td className="p-2 text-gray-600 border-r border-gray-100">3K OLED 120Hz</td>
                                  <td className="p-2 text-gray-600">3.2K IPS 165Hz</td>
                                </tr>
                                <tr>
                                  <td className="p-2 font-medium text-gray-800 border-r border-gray-100">总结</td>
                                  <td className="p-2 text-gray-800 font-medium border-r border-gray-100">适合移动办公多兼顾游戏</td>
                                  <td className="p-2 text-gray-800 font-medium">适合固定场所硬核玩家</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div className="bg-cyan-50 p-3 rounded-lg flex gap-2 items-start border border-cyan-100">
                            <Zap size={16} className="text-cyan-600 shrink-0 mt-0.5" />
                            <p className="text-xs text-cyan-800 leading-relaxed">建议：如果您经常需要带电脑通勤开会，强烈推荐 <strong>ROG 幻14 Air</strong>；如果主要放在工位或宿舍，<strong>Y9000X</strong> 的性能释放更好。</p>
                          </div>
                        </div>
                      )
                    }
                  }
                ].map((plan, i) => (
                  <div 
                    key={i} 
                    className="flex gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm cursor-pointer active:scale-[0.98] transition-transform"
                    onClick={() => setSelectedPlan(plan)}
                  >
                    <img src={plan.img} className="w-20 h-20 rounded-xl object-cover shrink-0 border border-gray-50" alt="plan" />
                    <div className="flex flex-col justify-center min-w-0">
                      <h4 className="font-bold text-sm text-gray-900 truncate">{plan.title}</h4>
                      <p className="text-[11px] text-gray-500 line-clamp-2 mt-1.5 leading-normal">{plan.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Preferences Tags */}
            <div className="bg-white p-5 rounded-3xl border border-gray-50 shadow-sm space-y-4">
               <div className="flex justify-between items-center">
                  <h3 className="font-bold text-gray-800">我的偏好标签</h3>
                  <button onClick={() => setIsEditingPreferences(true)} className="text-gray-400 p-1 hover:bg-gray-50 rounded">
                    <Settings size={14} />
                  </button>
               </div>
               <div className="flex flex-wrap gap-2">
                 {preferences.map((tag) => (
                   <span key={tag} className="bg-red-50 text-red-600 px-3 py-1.5 rounded-full text-[11px] font-medium flex items-center gap-1.5 border border-red-100/50">
                     {tag} 
                     <button onClick={() => setPreferences(preferences.filter(t => t !== tag))}>
                       <X size={12} className="opacity-40 hover:opacity-100" />
                     </button>
                   </span>
                 ))}
                 <button onClick={() => setIsEditingPreferences(true)} className="bg-red-50 text-red-600 px-3 py-1.5 rounded-full text-[11px] font-bold border border-red-100 flex items-center gap-1">
                   <Plus size={12} /> 修改偏好
                 </button>
               </div>
            </div>
            
          </motion.section>
        )}

        {activeInternalTab === '收藏' && (
          <motion.section 
            key="Collections"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="space-y-4"
          >
            <div className="bg-red-50 p-3 rounded-xl flex items-center gap-3">
              <div className="bg-red-500 p-1 rounded-full"><Zap size={14} className="text-white fill-current" /></div>
              <p className="text-[10px] font-bold text-red-600">RedAI 将基于专辑内容为您生成深度风格趋势报告</p>
            </div>
            <div className="divide-y divide-gray-50">
              {MOCK_ALBUMS.map((col, i) => (
                <div 
                  key={i} 
                  className="flex justify-between items-center py-4 cursor-pointer active:bg-gray-50 transition-colors select-none" 
                  onMouseDown={() => startPress(col)}
                  onMouseUp={endPress}
                  onMouseLeave={endPress}
                  onTouchStart={() => startPress(col)}
                  onTouchEnd={endPress}
                  onClick={() => handleAlbumClickWithLongPress(col)}
                >
                  <div className="flex gap-4 items-center">
                    <img src={col.imageUrl} className="w-14 h-14 rounded-xl object-cover border border-gray-100" alt="col" />
                    <div>
                      <h4 className="font-bold text-sm tracking-tight">{col.title}</h4>
                      <p className="text-[10px] text-gray-400 mt-1">{col.count} 篇笔记</p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-gray-300" />
                </div>
              ))}
              <div className="flex gap-4 items-center py-4 cursor-pointer">
                 <div className="w-14 h-14 bg-gray-50 rounded-xl border border-dashed border-gray-300 flex items-center justify-center">
                    <Plus size={24} className="text-gray-300" />
                 </div>
                 <div>
                    <h4 className="font-bold text-sm text-red-500">新建收藏专辑</h4>
                    <p className="text-[10px] text-gray-400 mt-1">整理更多灵感内容</p>
                 </div>
              </div>
            </div>
          </motion.section>
        )}

        {(activeInternalTab === '笔记' || activeInternalTab === '赞过') && (
          <motion.div 
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center p-20 text-gray-300"
          >
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-2">
              <Plus size={32} />
            </div>
            <p className="text-xs">暂无内容</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Plan Detail Modal */}
      <AnimatePresence>
        {selectedPlan && (
          <motion.div 
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[120] bg-[#fff8f7] flex flex-col no-scrollbar overflow-y-auto pb-20 font-sans"
          >
            <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-10 flex justify-between items-center w-full px-4 h-14">
              <div className="flex items-center gap-3">
                <button onClick={() => setSelectedPlan(null)} className="p-1 hover:bg-gray-50 rounded-full">
                  <X size={20} className="text-red-500" />
                </button>
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-200/50">
                     <BookOpen size={18} className="text-white" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h1 className="font-bold text-sm text-red-600">RedAI 内容决策引擎</h1>
                    <p className="text-[10px] text-gray-400">基于 {selectedPlan.id === 'paris' ? '500+' : '120'} 篇帖子深度生成</p>
                  </div>
                </div>
              </div>
            </header>
            
            <main className="flex-1 overflow-y-auto pb-24 no-scrollbar">
              {/* Reference Posts Mock */}
              <section className="p-4 overflow-x-auto flex gap-3 no-scrollbar bg-white/50 border-b border-gray-50">
                {[1, 2, 3].map((_, idx) => (
                  <div key={idx} className="relative flex-shrink-0 w-24 group">
                    <div className="w-full aspect-[3/4] rounded-xl overflow-hidden shadow-sm border border-gray-100 bg-gray-100">
                      <img className="w-full h-full object-cover opacity-80" src={selectedPlan.img} alt="reference" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                      <div className="absolute bottom-2 left-2 right-2">
                        <p className="text-[8px] text-white font-bold line-clamp-2 leading-tight">相关参考笔记 {idx + 1}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </section>

              {/* Guided Selection Area showing as filled conditions */}
              <section className="px-3 space-y-2 mt-4">
                <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-50 flex flex-col gap-2">
                  <div className="flex justify-between items-center text-red-500">
                    <div className="flex items-center gap-2">
                       <MousePointerClick size={16} />
                       <span className="text-sm font-medium">决策目标</span>
                    </div>
                    <span className="text-xs font-bold bg-red-50 px-2 py-1 rounded">{selectedPlan.id === 'paris' ? '巴黎5日游' : '购买笔记本'}</span>
                  </div>
                </div>
                <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-50 flex flex-col gap-2">
                  <div className="flex justify-between items-center text-orange-500">
                    <div className="flex items-center gap-2">
                       <Sliders size={16} />
                       <span className="text-sm font-medium">关注条件</span>
                    </div>
                    <div className="flex gap-1">
                      {selectedPlan.detail.tags.map((tag: string) => (
                         <span key={tag} className="text-xs font-bold bg-orange-50 px-2 py-1 rounded">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-50 flex flex-col gap-2">
                  <div className="flex justify-between items-center text-cyan-600">
                    <div className="flex items-center gap-2">
                       <ListFilter size={16} />
                       <span className="text-sm font-medium">输出格式</span>
                    </div>
                    <span className="text-xs font-bold bg-cyan-50 px-2 py-1 rounded">{selectedPlan.id === 'paris' ? '行程路线安排' : '单品对比表格'}</span>
                  </div>
                </div>
              </section>

              {/* Chat / Result Area */}
              <section className="px-3 py-6 space-y-6">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0 text-white shadow-md">
                    <Bot size={18} />
                  </div>
                  <div className="flex-1">
                    <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-gray-100">
                      <div className="mb-3 border-b border-gray-50 pb-3 flex justify-between items-center">
                        <h2 className="font-bold text-sm text-gray-800">{selectedPlan.title}</h2>
                        <span className="text-[9px] text-gray-400 border border-gray-100 px-1.5 py-0.5 rounded">深度生成</span>
                      </div>
                      {selectedPlan.detail.content}
                    </div>
                  </div>
                </div>
              </section>
            </main>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Preferences Modal */}
      <AnimatePresence>
        {isEditingPreferences && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed inset-0 z-[120] bg-white flex flex-col no-scrollbar overflow-y-auto"
          >
            <div className="sticky top-0 bg-white px-4 py-3 flex items-center justify-between border-b border-gray-100 z-10">
              <button onClick={() => setIsEditingPreferences(false)} className="p-2 hover:bg-gray-50 rounded-full">
                <X size={20} className="text-gray-600" />
              </button>
              <h2 className="font-bold text-sm text-gray-800">修改偏好</h2>
              <div className="w-8" />
            </div>

            <div className="p-4 space-y-6">
              <div>
                <h3 className="font-bold text-sm text-gray-800 mb-3 flex items-center gap-2">
                  <Bot size={16} className="text-red-500" /> 告诉 AI 你的喜好
                </h3>
                <div className="relative">
                  <textarea 
                    value={preferenceInput}
                    onChange={(e) => setPreferenceInput(e.target.value)}
                    placeholder="例如：我喜欢喝咖啡，平时喜欢周末去露营，对数码产品比较感兴趣..."
                    className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-red-100 h-32 resize-none placeholder:text-gray-400"
                  />
                  <button 
                    onClick={async () => {
                      if (!preferenceInput.trim()) return;
                      setIsAnalyzingPreferences(true);
                      try {
                        const { api } = await import('../api');
                        const result = await api.extractPreferences(preferenceInput);
                        if (result.success && result.tags.length > 0) {
                          // Filter out duplicates
                          setPreferences(prev => {
                            const newTags = result.tags.filter((tag: string) => !prev.includes(tag));
                            return [...prev, ...newTags];
                          });
                          setPreferenceInput('');
                          // If there's a suggestion even with success, maybe show it?
                        } else {
                          // Show suggestion/error
                          alert(result.suggestion || result.message || "没能提取到标签，请试着描述更详细一点？");
                        }
                      } catch (err) {
                        console.error(err);
                        alert("提取失败，请稍后再试");
                      } finally {
                        setIsAnalyzingPreferences(false);
                      }
                    }}
                    disabled={isAnalyzingPreferences || !preferenceInput.trim()}
                    className="absolute bottom-3 right-3 bg-red-500 text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-md active:scale-95 transition-all disabled:opacity-50"
                  >
                    {isAnalyzingPreferences ? (
                      <span className="flex items-center gap-1">
                        <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </span>
                    ) : (
                      <>
                        <Sparkles size={14} /> AI 提取分类
                      </>
                    )}
                  </button>
                </div>
                <p className="text-[10px] text-gray-400 mt-2 px-1">
                   AI 将自动识别你的输入并将其分类为结构化的偏好标签。
                   <br/>
                   <span className="text-red-400/80 italic">提示：描述越详细（如具体品牌、风格、预算），提取越精准。</span>
                </p>
              </div>

              <div>
                <h3 className="font-bold text-sm text-gray-800 mb-3">当前偏好标签</h3>
                <div className="flex flex-wrap gap-2">
                  {preferences.map((tag) => (
                    <span key={tag} className="bg-red-50 text-red-600 px-3 py-1.5 rounded-full text-[11px] font-medium flex items-center gap-1.5 border border-red-100/50 transition-all">
                      {tag} 
                      <button onClick={() => setPreferences(preferences.filter(t => t !== tag))} className="hover:bg-red-100 rounded-full p-0.5">
                        <X size={12} className="opacity-60" />
                      </button>
                    </span>
                  ))}
                  {preferences.length === 0 && (
                    <span className="text-xs text-gray-400">暂无偏好标签</span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
};
