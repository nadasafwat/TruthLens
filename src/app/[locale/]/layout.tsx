import type { Metadata } from 'next';
import { Inter, Lato, Cairo } from 'next/font/google';
import '@/app/globals.css';
import RootProvider from '@/components/layout/RootProvider';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import MobileNav from '@/components/layout/MobileNav';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const lato = Lato({ weight: ['400', '700'], subsets: ['latin'], variable: '--font-lato', display: 'swap' });
const cairo = Cairo({ subsets: ['arabic'], variable: '--font-cairo', display: 'swap' });

export const metadata: Metadata = {
  title: 'TruthLens — See Beyond the Screen',
  description: 'An interactive, gamified platform training the next generation to identify AI-generated media and deepfakes.',
};

export default function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const isRtl = locale === 'ar';
  const direction = isRtl ? 'rtl' : 'ltr';
  const fontClass = isRtl ? cairo.variable : `${inter.variable} ${lato.variable}`;

  return (
    <html lang={locale} dir={direction} className={fontClass}>
      <body className="bg-[#0B132B] text-white font-sans antialiased min-h-screen flex flex-col selection:bg-[#00D4FF]/30 selection:text-[#00D4FF]">
        <RootProvider locale={locale as 'en' | 'ar'}>
          
          {/* Header element */}
          <Header />
          
          {/* Primary Viewport Grid */}
          <div className="flex flex-1 flex-row relative">
            <Sidebar />
            
            <main className="flex-1 flex flex-col h-[calc(100vh-65px)] overflow-y-auto px-4 py-6 md:px-8 pb-24 md:pb-6">
              <div className="mx-auto w-full max-w-5xl flex-1 flex flex-col">
                {children}
              </div>
            </main>
          </div>
          
          {/* Mobile bottom nav bar */}
          <MobileNav />
          
        </RootProvider>
      </body>
    </html>
  );
}
