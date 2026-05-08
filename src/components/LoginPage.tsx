import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, BookOpen, ChevronRight, Apple, MessageCircle, HelpCircle, Eye, EyeOff, X, CheckCircle2, AlertCircle } from 'lucide-react';

interface LoginPageProps {
  onLogin: (userId: string) => void;
}

export const LoginPage = ({ onLogin }: LoginPageProps) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [showAgreement, setShowAgreement] = useState(false);
  const [agreementTitle, setAgreementTitle] = useState('');
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' | 'info' }>({ show: false, message: '', type: 'info' });

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 2000);
  };

  // 注入测试用户
  React.useEffect(() => {
    const registeredUsers = JSON.parse(localStorage.getItem('redai_users') || '[]');
    const testUser = '18297007821';
    if (!registeredUsers.includes(testUser)) {
      registeredUsers.push(testUser);
      localStorage.setItem('redai_users', JSON.stringify(registeredUsers));
    }
  }, []);

  const openAgreement = (e: React.MouseEvent, title: string) => {
    e.preventDefault();
    e.stopPropagation();
    setAgreementTitle(title);
    setShowAgreement(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      showToast('请阅读并同意协议', 'error');
      return;
    }
    
    if (!phoneNumber || !password) {
      showToast('请输入手机号和密码', 'error');
      return;
    }

    // 验证手机号格式
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!phoneRegex.test(phoneNumber)) {
      showToast('请输入正确的手机号', 'error');
      return;
    }

    const registeredUsers = JSON.parse(localStorage.getItem('redai_users') || '[]');

    if (mode === 'register') {
      if (registeredUsers.includes(phoneNumber)) {
        showToast('该手机号已注册，请直接登录', 'error');
        return;
      }
      
      registeredUsers.push(phoneNumber);
      localStorage.setItem('redai_users', JSON.stringify(registeredUsers));
      
      showToast('注册成功，即将跳转登录', 'success');
      setTimeout(() => setMode('login'), 1500);
    } else {
      if (!registeredUsers.includes(phoneNumber)) {
        showToast('该手机号未注册，请先注册', 'error');
        return;
      }
      
      showToast('登录成功', 'success');
      setTimeout(() => onLogin(phoneNumber), 1000);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-white z-[200] flex flex-col p-6 overflow-y-auto"
    >
      {/* Toast Notification */}
      {toast.show && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`fixed top-10 left-1/2 -translate-x-1/2 z-[400] px-5 py-3 rounded-full shadow-lg flex items-center gap-2
            ${toast.type === 'success' ? 'bg-green-50 text-green-600 border border-green-100' : 
              toast.type === 'error' ? 'bg-red-50 text-red-500 border border-red-100' : 
              'bg-gray-50 text-gray-700 border border-gray-200'}`}
        >
          {toast.type === 'success' && <CheckCircle2 size={18} />}
          {toast.type === 'error' && <AlertCircle size={18} />}
          <span className="font-medium text-sm whitespace-nowrap">{toast.message}</span>
        </motion.div>
      )}

      {/* Top Bar */}
      <div className="flex justify-between items-center mb-12 mt-4">
        <button className="p-1 -ml-1 text-gray-400 hover:text-gray-600">
          <ArrowLeft size={24} />
        </button>
        <button className="text-gray-400 text-sm font-medium">帮助</button>
      </div>

      {/* Logo & Header */}
      <div className="flex flex-col items-center mb-16">
        <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-[#ff4d4d] rounded-[28px] flex items-center justify-center shadow-2xl shadow-red-200/60 border border-white/20 mb-6 transition-transform hover:scale-105">
          <BookOpen size={40} className="text-white" strokeWidth={2.5} />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {mode === 'login' ? '欢迎来到 Red Book' : '创建你的账号'}
        </h1>
        <p className="text-gray-400 text-sm">
          {mode === 'login' ? '登录后发现更多精彩' : '加入我们也发现更多美感'}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-900 font-bold border-r border-gray-100 pr-3 mr-3">
            +86
          </div>
          <input
            type="tel"
            placeholder="请输入手机号"
            className="w-full h-14 bg-gray-50 rounded-2xl pl-20 pr-4 text-gray-900 font-medium focus:bg-white focus:ring-2 focus:ring-red-500 transition-all outline-none"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>

        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder={mode === 'login' ? '请输入密码' : '请设置密码'}
            className="w-full h-14 bg-gray-50 rounded-2xl px-6 text-gray-900 font-medium focus:bg-white focus:ring-2 focus:ring-red-500 transition-all outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button 
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <button
          type="submit"
          className="w-full h-14 bg-red-500 text-white font-bold rounded-full shadow-lg shadow-red-100 active:scale-[0.98] transition-all mt-4"
        >
          {mode === 'login' ? '立即登录' : '立即注册'}
        </button>
      </form>

      {/* Agreement */}
      <div className="flex justify-center mt-4">
        <label className="flex items-center gap-2 cursor-pointer group">
          <div className="relative flex items-center">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            <div className="w-4 h-4 rounded-full border border-gray-300 peer-checked:bg-red-500 peer-checked:border-red-500 transition-all flex-shrink-0" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none">
              <div className="w-1.5 h-1.5 bg-white rounded-full" />
            </div>
          </div>
          <p className="text-[10px] text-gray-400">
            我已阅读并同意{' '}
            <span className="text-gray-600 hover:text-red-500 transition-colors" onClick={(e) => openAgreement(e, '用户协议')}>《用户协议》</span>{' '}
            <span className="text-gray-600 hover:text-red-500 transition-colors" onClick={(e) => openAgreement(e, '隐私政策')}>《隐私政策》</span>{' '}
            <span className="text-gray-600 hover:text-red-500 transition-colors" onClick={(e) => openAgreement(e, '未成年人保护规则')}>《未成年人保护规则》</span>
          </p>
        </label>
      </div>

      <div className="flex justify-center mt-6">
        <button 
          onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
          className="text-gray-500 text-sm font-medium hover:text-red-500 transition-colors"
        >
          {mode === 'login' ? '还没有账号？立即注册' : '已有账号？去登录'}
        </button>
      </div>

      {/* Social Login */}
      <div className="mt-10 space-y-3">
        <button className="w-full h-14 bg-gray-50 rounded-full flex items-center justify-center gap-2 group active:scale-[0.98] transition-all">
          <MessageCircle size={20} className="text-green-500 fill-current" />
          <span className="text-gray-700 font-medium">微信登录</span>
        </button>
        <button className="w-full h-14 bg-gray-50 rounded-full flex items-center justify-center gap-2 group active:scale-[0.98] transition-all">
          <Apple size={20} className="text-gray-900 fill-current" />
          <span className="text-gray-700 font-medium">Apple 登录</span>
        </button>
      </div>

      <button className="mt-8 text-gray-400 text-xs font-medium flex items-center justify-center gap-1 mx-auto">
        其他登录方式 <ChevronRight size={14} />
      </button>

      {/* Agreement Modal */}
      {showAgreement && (
        <div className="fixed inset-0 bg-black/50 z-[300] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl w-full max-w-sm overflow-hidden flex flex-col max-h-[80vh]"
          >
            <div className="flex justify-between items-center p-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900">{agreementTitle}</h3>
              <button onClick={() => setShowAgreement(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-4 overflow-y-auto text-sm text-gray-600 leading-relaxed space-y-4 flex-1">
              <p>这里是 {agreementTitle} 的详细内容。</p>
              <p>1. 欢迎使用我们的服务。在您使用服务之前，请务必仔细阅读并理解本协议的所有条款。</p>
              <p>2. 我们将严格按照相关法律法规保护您的个人信息安全，您可以随时通过设置界面管理您的隐私偏好。</p>
              <p>3. 在提供服务过程中，我们可能需要收集必要的数据来优化您的体验。</p>
              <p>4. 如您有任何疑问、意见或建议，请通过客服渠道与我们联系。我们将尽快为您解答。</p>
              <p>（以上为演示内容文本，可替换为真实文案）</p>
            </div>
            <div className="p-4 border-t border-gray-100">
              <button 
                onClick={() => {
                  setShowAgreement(false);
                  setAgreed(true);
                }}
                className="w-full h-12 bg-red-500 text-white font-bold rounded-full active:scale-95 transition-transform"
              >
                已阅读并同意
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};
