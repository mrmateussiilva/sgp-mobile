import { useEffect, useState } from 'react'
import { LayoutDashboard } from 'lucide-react'

export const SplashScreen = () => {
    const [isVisible, setIsVisible] = useState(true)
    const [isFading, setIsFading] = useState(false)

    useEffect(() => {
        // Começa a sumir após 2 segundos
        const timer = setTimeout(() => {
            setIsFading(true)
            // Remove do DOM após a animação de fade (500ms)
            setTimeout(() => setIsVisible(false), 500)
        }, 2000)

        return () => clearTimeout(timer)
    }, [])

    if (!isVisible) return null

    return (
        <div
            className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050505] transition-opacity duration-500 ease-in-out ${isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
                }`}
        >
            <div className="relative">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-primary/20 blur-[60px] rounded-full scale-150 animate-pulse"></div>

                {/* Logo Icon */}
                <div className="relative bg-primary w-24 h-24 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-primary/40 animate-in zoom-in duration-700">
                    <LayoutDashboard className="w-12 h-12 text-primary-foreground" />
                </div>
            </div>

            <div className="mt-12 text-center space-y-4 animate-in slide-in-from-bottom-4 duration-1000">
                <div className="space-y-1">
                    <h1 className="text-2xl font-black text-white tracking-tighter uppercase">
                        S.G.P <span className="text-primary">V4</span>
                    </h1>
                    <p className="text-[10px] font-black text-primary tracking-[0.3em] uppercase opacity-80">
                        Make Builder
                    </p>
                </div>

                <div className="pt-8">
                    <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden mx-auto">
                        <div className="h-full bg-primary w-1/2 rounded-full animate-[loading_1.5s_ease-in-out_infinite]"></div>
                    </div>
                </div>

                <p className="pt-4 text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                    Finderbit.com.br
                </p>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
        @keyframes loading {
          0% { transform: translateX(-100%); width: 30%; }
          50% { transform: translateX(100%); width: 60%; }
          100% { transform: translateX(300%); width: 30%; }
        }
      `}} />
        </div>
    )
}
