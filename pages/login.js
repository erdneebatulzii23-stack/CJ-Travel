import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Login() {
  const router = useRouter();
  
  // State-үүд (Хэрэглэгчийн оруулж буй өгөгдлийг хадгалах)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('traveler'); // Default нь traveler
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Уншиж байх үед товчийг идэвхгүй болгох

  // Нэвтрэх функц (API-тай холбогдоно)
  const handleLogin = async (e) => {
    e.preventDefault(); // Хуудсыг refresh хийлгэхгүй
    setIsLoading(true);

    try {
      // 1. Backend API руу мэдээллээ илгээнэ
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            email, 
            password,
            role 
        }),
      });

      const data = await res.json();

      // 2. Амжилттай болвол
      if (res.ok) {
        // Token болон User мэдээллийг хадгална
        localStorage.setItem('token', data.token);
        if (data.user) {
            localStorage.setItem('user', JSON.stringify(data.user));
        }
        
        // Нүүр хуудас руу шилжинэ
        router.push('/'); 
      } else {
        // Алдаа гарвал
        alert(data.message || 'Нэвтрэхэд алдаа гарлаа. Та мэдээллээ шалгана уу.');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Сервертэй холбогдож чадсангүй. Та интернэтээ шалгана уу.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#f6f7f8] dark:bg-[#101922] font-['Plus_Jakarta_Sans'] min-h-screen">
      <Head>
        <title>CJ Travel - Login</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </Head>

      <div className="flex flex-col min-h-screen w-full overflow-x-hidden">
        {/* Header */}
        <div className="sticky top-0 z-50 flex items-center bg-[#f6f7f8] dark:bg-[#101922] p-4 border-b border-transparent">
          <h2 className="text-[#0d141b] dark:text-white text-lg font-bold w-full text-center">CJ Travel</h2>
        </div>

        <div className="flex flex-col flex-1 px-4 max-w-[480px] mx-auto w-full">
          <div className="pt-8 pb-6 text-center">
            <h1 className="text-[#0d141b] dark:text-white text-[32px] font-bold">Welcome Back</h1>
            <p className="text-[#4c739a] dark:text-gray-400">Log in to your account</p>
          </div>

          {/* Role Selection (Таны html дээрх radio button-ыг React хэлбэр рүү шилжүүлэв) */}
          <div className="p-1 bg-gray-200/50 dark:bg-gray-800 rounded-xl flex items-center mb-8">
            {['traveler', 'guide', 'provider'].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`flex-1 py-2.5 text-center text-sm font-bold rounded-lg transition-all capitalize cursor-pointer ${
                  role === r 
                  ? 'bg-white dark:bg-gray-600 text-[#2b8cee] shadow-sm' 
                  : 'text-[#4c739a]'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="flex flex-col">
              <p className="text-[#0d141b] dark:text-white font-medium pb-2">Email or Username</p>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border-[#cfdbe7] dark:border-gray-700 bg-white dark:bg-[#1a2632] h-14 p-4 focus:ring-1 focus:ring-[#2b8cee] focus:outline-none text-[#0d141b] dark:text-white"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="flex flex-col">
              <p className="text-[#0d141b] dark:text-white font-medium pb-2">Password</p>
              <div className="flex w-full items-stretch rounded-lg overflow-hidden border border-[#cfdbe7] dark:border-gray-700 bg-white dark:bg-[#1a2632]">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="flex-1 bg-transparent h-14 p-4 focus:outline-none border-none text-[#0d141b] dark:text-white"
                  placeholder="Enter password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="px-4 text-[#4c739a] flex items-center focus:outline-none"
                >
                  <span className="material-symbols-outlined select-none">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <Link href="#" className="text-[#2b8cee] text-sm font-semibold hover:underline">
                Forgot Password?
              </Link>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full h-14 text-white font-bold text-lg rounded-xl shadow-md transition-all ${
                    isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#2b8cee] hover:bg-[#2b8cee]/90'
                }`}
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </button>
            </div>
          </form>

          {/* Social Login Section */}
          <div className="flex items-center gap-4 py-8">
            <div className="h-[1px] flex-1 bg-[#cfdbe7] dark:bg-gray-700"></div>
            <p className="text-[#4c739a] text-sm">Or continue with</p>
            <div className="h-[1px] flex-1 bg-[#cfdbe7] dark:bg-gray-700"></div>
          </div>

          <div className="flex flex-col gap-3">
            <button className="flex items-center justify-center gap-3 w-full h-14 border border-[#cfdbe7] dark:border-gray-700 rounded-xl bg-white dark:bg-[#1a2632] font-semibold text-[#0d141b] dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <img alt="G" className="w-6 h-6" src="https://www.svgrepo.com/show/475656/google-color.svg" />
              <span>Google</span>
            </button>
          </div>

          {/* Footer Links */}
          <div className="py-10 flex flex-col items-center gap-4">
            <p className="text-[#4c739a]">
              Don't have an account? <Link href="/role-selection.html" className="text-[#2b8cee] font-bold hover:underline">Sign Up</Link>
            </p>
            <Link href="/" className="flex items-center gap-1 text-[#4c739a] hover:text-[#2b8cee] transition-colors">
              <span className="material-symbols-outlined text-lg">arrow_back</span>
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
