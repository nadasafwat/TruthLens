'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from '@/i18n/TranslationContext';
import { Eye, CheckCircle, Lightbulb, ArrowRight, ShieldCheck } from 'lucide-react';

export default function LandingPage() {
  const { locale, t } = useTranslation();

  const steps = [
    {
      title: t('landing.step1_title'),
      desc: t('landing.step1_desc'),
      icon: Eye,
      color: 'from-[#00D4FF]/20 to-[#00D4FF]/5',
      iconColor: 'text-[#00D4FF]',
      delayClass: 'animation-delay-300'
    },
    {
      title: t('landing.step2_title'),
      desc: t('landing.step2_desc'),
      icon: CheckCircle,
      color: 'from-[#2DD881]/20 to-[#2DD881]/5',
      iconColor: 'text-[#2DD881]',
      delayClass: 'animation-delay-375'
    },
    {
      title: t('landing.step3_title'),
      desc: t('landing.step3_desc'),
      icon: Lightbulb,
      color: 'from-[#00D4FF]/20 to-[#2DD881]/5',
      iconColor: 'text-[#2DD881]',
      delayClass: 'animation-delay-450'
    }
  ];

  return (
    <div className="flex flex-col gap-12 py-4 md:py-8 animate-fade-in-up">
      
      {/* Hero Section */}
      <section className="grid items-center gap-8 md:grid-cols-12 md:py-4">
        
        {/* Marketing Copy */}
        <div className="flex flex-col gap-6 md:col-span-7">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#2DD881]/30 bg-[#2DD881]/10 px-3 py-1.5 text-xs font-semibold text-[#2DD881] w-fit animate-fade-in-up animation-delay-75">
            <ShieldCheck className="h-4 w-4" />
            <span>UNESCO Youth Hackathon 2026</span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-white animate-fade-in-up animation-delay-150">
            {t('landing.hero_title')}
          </h1>

          <p className="text-lg text-white/70 leading-relaxed font-sans max-w-xl animate-fade-in-up animation-delay-225">
            {t('landing.hero_desc')}
          </p>

          <div className="flex flex-wrap gap-4 mt-2 animate-fade-in-up animation-delay-300">
            <Link
              href={`/${locale}/setup`}
              className="group flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#00D4FF] to-[#2DD881] px-6 py-3.5 text-base font-bold text-[#0B132B] shadow-lg shadow-brand-cyan/20 transition-all hover:shadow-brand-cyan/45 hover:scale-[1.03] select-none"
            >
              <span>{t('landing.cta_start')}</span>
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:rtl:-translate-x-1 rtl:rotate-180" />
            </Link>
          </div>
        </div>

        {/* Hero SVG/CSS Graphical Element */}
        <div className="flex justify-center md:col-span-5">
          <div className="relative flex h-72 w-72 items-center justify-center sm:h-80 sm:w-80 animate-fade-in-up animation-delay-375">
            {/* Glowing Backdrop Orbs */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#00D4FF] to-[#2DD881] opacity-20 blur-3xl" />
            
            {/* Geometric Concentric Rings simulating "The Verified Lens" */}
            <svg
              viewBox="0 0 200 200"
              className="relative h-full w-full drop-shadow-2xl"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Outer Ring */}
              <circle cx="100" cy="100" r="80" stroke="rgba(255,255,255,0.05)" strokeWidth="1.5" fill="none" />
              
              {/* Spinning Accent Ring */}
              <circle
                cx="100"
                cy="100"
                r="70"
                stroke="url(#lensGrad)"
                strokeWidth="3"
                fill="none"
                strokeDasharray="100 80"
                className="animate-spin-slow"
                style={{ transformOrigin: '100px 100px' }}
              />

              {/* Verified Badge Icon in the center */}
              <g
                className="animate-pulse-scale"
                style={{ transformOrigin: '100px 100px' }}
              >
                <circle cx="100" cy="100" r="50" fill="#ffffff" stroke="url(#lensGrad)" strokeWidth="2" />
                <image
                  href="/logo-mark.jpg"
                  x="52"
                  y="52"
                  height="96"
                  width="96"
                  clipPath="url(#circleClip)"
                />
              </g>

              {/* Definitions for Gradient and ClipPath */}
              <defs>
                <linearGradient id="lensGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00D4FF" />
                  <stop offset="100%" stopColor="#2DD881" />
                </linearGradient>
                <clipPath id="circleClip">
                  <circle cx="100" cy="100" r="45" />
                </clipPath>
              </defs>
            </svg>
          </div>
        </div>

      </section>

      {/* How It Works Section */}
      <section className="flex flex-col gap-8 border-t border-white/10 pt-12">
        <div className="text-center md:text-start animate-fade-in-up animation-delay-225">
          <h2 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
            {t('landing.how_it_works')}
          </h2>
        </div>

        {/* Steps Grid */}
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {steps.map((step, idx) => {
            const Icon = step.icon;

            return (
              <div
                key={idx}
                className={`group relative flex flex-col gap-4 rounded-2xl border border-white/5 bg-white/5 p-6 hover:bg-white/10 hover:border-white/15 transition-all duration-300 animate-fade-in-up ${step.delayClass}`}
              >
                {/* Step Background Gradient Blob */}
                <div className={`absolute top-0 right-0 h-16 w-16 rounded-bl-full bg-gradient-to-bl ${step.color} opacity-40`} />
                
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 ${step.iconColor} border border-white/10`}>
                  <Icon className="h-6 w-6" />
                </div>
                
                <div className="flex flex-col gap-2">
                  <h3 className="text-lg font-bold text-white group-hover:text-[#00D4FF] transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-white/60">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

