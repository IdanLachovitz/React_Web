import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Eye, EyeOff, CheckCircle2, Circle } from 'lucide-react';

export default function AuthModal({ onClose }) {
  const { login, showToast } = useAuth();
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const rules = {
    length: password.length >= 8,
    special: /[0-9]|[^a-zA-Z0-9]/.test(password),
    small: /[a-z]/.test(password),
    capital: /[A-Z]/.test(password)
  };
  const allRulesMet = Object.values(rules).every(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!username && !password) return setError("Please enter both a username and a password.");
    if (!username) return setError("Please enter your username.");
    if (!password) return setError("Please enter your password.");
    if (username.length < 3) return setError("Username must be at least 3 characters long.");
    if (username.length > 15) return setError("Username cannot be longer than 15 characters.");
    if (password.length < 8) return setError("Password must be at least 8 characters long.");
    if (password.length > 20) return setError("Password cannot be longer than 20 characters.");

    if (authMode === 'register' && !allRulesMet) {
      return setError("Please meet all password requirements before registering.");
    }

    try {
      const res = await fetch(`/${authMode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      let data;
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const textError = await res.text();
        throw new Error("Server Error: " + textError);
      }

      if (res.ok) {
        if (authMode === 'login') {
          login(data.username, data.access_token);
          showToast(`Logged in successfully as ${data.username}`);
          onClose();
        } else {
          showToast("Registered! Please login.");
          setAuthMode('login');
          setPassword('');
        }
      } else {
        setError(data.detail || "Authentication failed.");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-[110]">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-sm mx-auto mt-20 mb-5 glass-modal border border-white/10 rounded-2xl overflow-hidden p-4">
        <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-black text-white italic tracking-tighter">{authMode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={20}/></button>
        </div>
        <hr className="border-white/10 mb-6" />
        
        {error && <div className="mb-4 text-red-500 text-sm font-bold bg-red-500/10 p-2 rounded-lg">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Username</label>
                <input 
                  type="text" 
                  maxLength={15} 
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full bg-white/5 border-white/10 rounded-xl text-white focus:border-purple-600 focus:ring-0" 
                />
                {authMode === 'register' && <p className="text-[10px] text-gray-500 mt-1">Username must be 3-15 characters</p>}
            </div>
            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Password</label>
                <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      maxLength={20}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full bg-white/5 border-white/10 rounded-xl text-white focus:border-purple-600 focus:ring-0 pr-12" 
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white">
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
                {authMode === 'register' && (
                  <>
                    <p className="text-[10px] text-gray-500 mt-1">Password must be 8-20 characters</p>
                    <ul className="grid grid-cols-1 gap-2 pl-1 mt-4">
                        <li className={`flex items-center gap-3 text-[10px] font-bold transition-all duration-300 ${rules.length ? 'text-purple-500' : 'text-gray-500'}`}>
                            {rules.length ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                            <span className="tracking-wide uppercase opacity-80">At least 8 characters</span>
                        </li>
                        <li className={`flex items-center gap-3 text-[10px] font-bold transition-all duration-300 ${rules.special ? 'text-purple-500' : 'text-gray-500'}`}>
                            {rules.special ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                            <span className="tracking-wide uppercase opacity-80">Special character or digit</span>
                        </li>
                        <li className={`flex items-center gap-3 text-[10px] font-bold transition-all duration-300 ${rules.small ? 'text-purple-500' : 'text-gray-500'}`}>
                            {rules.small ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                            <span className="tracking-wide uppercase opacity-80">1 small letter</span>
                        </li>
                        <li className={`flex items-center gap-3 text-[10px] font-bold transition-all duration-300 ${rules.capital ? 'text-purple-500' : 'text-gray-500'}`}>
                            {rules.capital ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                            <span className="tracking-wide uppercase opacity-80">1 capital letter</span>
                        </li>
                    </ul>
                  </>
                )}
            </div>
            <button type="submit" className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-all mt-4">
              {authMode === 'login' ? 'Sign In' : 'Register'}
            </button>
            <p className="text-center text-sm text-gray-400 mt-4 cursor-pointer" onClick={() => setAuthMode(m => m === 'login' ? 'register' : 'login')}>
              {authMode === 'login' ? "Don't have an account?" : "Already have an account?"}
            </p>
        </form>
      </div>
    </div>
  );
}
