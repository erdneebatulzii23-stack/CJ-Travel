import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Home() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Header scroll эффект
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleProfileClick = () => {
    const token = localStorage.getItem('token');
    if (token) {
      window.location.href = 'profile.html';
    } else {
      window.location.href = 'login.html';
    }
  };

  return (
    <div className="bg-[#f6f7f8] dark:bg-[#101922] text-[#0d141b] dark:text-slate-50 min-h-screen flex flex-col font-['Plus_Jakarta_Sans']">
      <Head>
        <title>CJ Travel - Home</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {/* Google Fonts болон Icons-ийг энд дуудна */}
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </Head>

      {/* Header */}
      <header className={`sticky top-0 z-50 transition-all ${scrolled ? 'bg-white/90 dark:bg-slate-900/90 shadow-md border-transparent' : 'bg-[#f6f7f8]/80 dark:bg-[#101922]/80 border-slate-200 dark:border-slate-800'} backdrop-blur-md border-b`}>
        <div className="flex items-center p-4 justify-between max-w-xl mx-auto w-full">
          <Link href="/" className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#2b8cee] text-3xl">explore</span>
            <h1 className="text-[#0d141b] dark:text-white text-xl font-bold leading-tight tracking-tight">CJ Travel</h1>
          </Link>
          <div className="flex gap-3">
            <Link href="/notifications.html" className="flex items-center justify-center size-10 rounded-full bg-slate-200 dark:bg-slate-800">
              <span className="material-symbols-outlined text-xl">notifications</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pb-32 max-w-xl mx-auto w-full">
        {/* Search Bar */}
        <div className="px-4 py-4">
          <div className="flex w-full h-14 items-stretch rounded-xl shadow-sm bg-white dark:bg-slate-800 overflow-hidden">
            <div className="text-[#4c739a] flex items-center justify-center pl-4">
              <span className="material-symbols-outlined">search</span>
            </div>
            <input 
              className="w-full border-none bg-transparent focus:ring-0 text-[#0d141b] dark:text-white px-4 text-base font-medium placeholder:text-[#4c739a]" 
              placeholder="Search guides or destinations"
              onKeyDown={(e) => e.key === 'Enter' && console.log('Searching for:', e.target.value)}
            />
          </div>
        </div>

        {/* Guides Section */}
        <div className="mt-2">
          <div className="flex items-center justify-between px-4 pb-3 pt-4">
            <h2 className="text-[#0d141b] dark:text-white text-[22px] font-bold">Top Rated Guides</h2>
            <Link href="/guides.html" className="text-[#2b8cee] text-sm font-semibold">See All</Link>
          </div>
          <div className="grid grid-cols-2 gap-3 px-4">
            {/* Guide Card 1 */}
            <div className="bg-cover bg-center flex flex-col justify-end p-4 aspect-[3/4] rounded-xl relative overflow-hidden cursor-pointer" 
                 style={{backgroundImage: 'linear-gradient(0deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0) 50%), url("https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop")'}}>
              <div className="absolute top-2 right-2 bg-white/20 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1">
                <span className="material-symbols-outlined text-yellow-400 text-sm fill-current">star</span>
                <span className="text-white text-xs font-bold">4.9</span>
              </div>
              <p className="text-white text-base font-bold">Alex Rivera</p>
            </div>
            {/* Guide Card 2 */}
            <div className="bg-cover bg-center flex flex-col justify-end p-4 aspect-[3/4] rounded-xl relative overflow-hidden cursor-pointer" 
                 style={{backgroundImage: 'linear-gradient(0deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0) 50%), url("https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop")'}}>
              <div className="absolute top-2 right-2 bg-white/20 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1">
                <span className="material-symbols-outlined text-yellow-400 text-sm fill-current">star</span>
                <span className="text-white text-xs font-bold">4.8</span>
              </div>
              <p className="text-white text-base font-bold">Sarah Chen</p>
            </div>
          </div>
        </div>

        {/* Destination Section */}
        <div className="mt-6">
          <div className="flex items-center justify-between px-4 pb-3 pt-4">
            <h2 className="text-[#0d141b] dark:text-white text-[22px] font-bold">Natural Destinations</h2>
            <button className="text-[#2b8cee] text-sm font-semibold">View Maps</button>
          </div>
          <div className="flex flex-col gap-4 px-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm">
              <div className="h-48 w-full bg-cover bg-center" style={{backgroundImage: 'url("https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=800&auto=format&fit=crop")'}}></div>
              <div className="p-4">
                <h3 className="font-bold text-lg">Bali, Indonesia</h3>
                <p className="text-sm text-slate-500">Southeast Asia</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Navigation */}
      <footer className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-t border-gray-200 dark:border-slate-800">
        <div className="max-w-md mx-auto flex justify-around items-center h-20 px-2 pb-5">
          <Link href="/" className="flex flex-col items-center gap-1 text-[#2b8cee]">
            <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>home</span>
            <span className="text-[10px] font-semibold">Home</span>
          </Link>
          <Link href="/guides.html" className="flex flex-col items-center gap-1 text-[#4c739a] dark:text-slate-400">
            <span className="material-symbols-outlined">person_search</span>
            <span className="text-[10px] font-semibold">Guides</span>
          </Link>
          <Link href="/resort.html" className="flex flex-col items-center gap-1 text-[#4c739a] dark:text-slate-400">
            <span className="material-symbols-outlined">holiday_village</span>
            <span className="text-[10px] font-semibold">Resorts</span>
          </Link>
          <button onClick={handleProfileClick} className="flex flex-col items-center gap-1 text-[#4c739a] dark:text-slate-400 hover:text-[#2b8cee]">
            <span className="material-symbols-outlined">account_circle</span>
            <span className="text-[10px] font-semibold">My Profile</span>
          </button>
        </div>
      </footer>
    </div>
  );
}
