'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from '@/i18n/TranslationContext';
import { Home, ShieldAlert, BookOpen, User } from 'lucide-react';
import { clsx } from 'clsx';

export default function MobileNav() {
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
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-[#0B132B] px-4 py-2 md:hidden">
      <div className="flex justify-around items-center">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex flex-col items-center justify-center gap-1 w-16 py-1 text-[10px] font-medium transition-all duration-200",
                isActive ? "text-[#00D4FF]" : "text-white/50 hover:text-white"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="truncate max-w-full">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
