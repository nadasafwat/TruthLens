'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from '@/i18n/TranslationContext';
import { Home, ShieldAlert, BookOpen, User } from 'lucide-react';
import { clsx } from 'clsx';

export default function Sidebar() {
  const { locale, t } = useTranslation();
  const pathname = usePathname();

  const navItems = [
    {
      label: t('common.menu.home'),
      href: `/${locale}`,
      icon: Home
    },
    {
      label: t('common.menu.train'),
      href: `/${locale}/setup`,
      icon: ShieldAlert
    },
    {
      label: t('common.menu.learn'),
      href: `/${locale}/learn`,
      icon: BookOpen
    },
    {
      label: t('common.menu.profile'),
      href: `/${locale}/profile`,
      icon: User
    }
  ];

  return (
    <aside className="hidden h-[calc(100vh-65px)] w-64 border-r border-white/10 bg-[#0B132B] py-6 px-4 md:block rtl:border-l rtl:border-r-0">
      <div className="flex flex-col gap-6">
        
        {/* Navigation Menu */}
        <nav className="flex flex-col gap-1.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 select-none",
                  isActive
                    ? "bg-[#00D4FF]/10 text-[#00D4FF] border border-[#00D4FF]/30 font-semibold"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Dynamic decorative info panel */}
        <div className="rounded-xl border border-white/5 bg-white/5 p-4 mt-8">
          <p className="text-xs font-semibold text-[#2DD881] mb-1">
            UNESCO MIL 2026
          </p>
          <p className="text-[11px] text-white/50 leading-relaxed">
            Protecting digital spaces through critical media evaluation and AI education.
          </p>
        </div>

      </div>
    </aside>
  );
}
