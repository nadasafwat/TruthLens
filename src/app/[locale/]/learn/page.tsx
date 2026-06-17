'use client';

import React, { useState } from 'react';
import { useTranslation } from '@/i18n/TranslationContext';
import { BookOpen, FileText, Printer, Check, Info, ShieldAlert, Cpu, Download } from 'lucide-react';
import { clsx } from 'clsx';

type TopicType = 'gans' | 'face-swaps' | 'checklist';

export default function LearnPage() {
  const { locale, t } = useTranslation();
  const [activeTopic, setActiveTopic] = useState<TopicType>('gans');

  const topics = [
    {
      id: 'gans' as TopicType,
      label: t('learn.gan_basics'),
      icon: Cpu
    },
    {
      id: 'face-swaps' as TopicType,
      label: t('learn.techniques'),
      icon: ShieldAlert
    },
    {
      id: 'checklist' as TopicType,
      label: t('learn.five_sec_check'),
      icon: FileText
    }
  ];

  const wrapText = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] => {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const testWidth = ctx.measureText(testLine).width;

      if (testWidth > maxWidth && i > 0) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) {
      lines.push(currentLine);
    }
    return lines;
  };

  const handleDownloadPNG = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      const isRtl = locale === 'ar';
      
      // 1. Draw Background
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, 600, 800);
      
      // 2. Draw outer border
      ctx.strokeStyle = '#E2E8F0'; // slate-200
      ctx.lineWidth = 4;
      ctx.strokeRect(15, 15, 570, 770);
      
      // 3. Draw header bar
      ctx.fillStyle = '#0B132B'; // Oxford Blue
      ctx.fillRect(30, 30, 540, 60);
      
      // Logo in header bar
      ctx.fillStyle = '#00D4FF'; // Cyan accent
      ctx.font = 'bold 20px var(--font-cairo), Cairo, sans-serif';
      ctx.textAlign = isRtl ? 'right' : 'left';
      const logoX = isRtl ? 540 : 60;
      ctx.fillText(t('common.title').toUpperCase(), logoX, 68);
      
      // Badge in header bar: "UNESCO MIL Resource"
      ctx.fillStyle = '#2DD881'; // Green
      ctx.font = 'bold 11px var(--font-cairo), Cairo, sans-serif';
      ctx.textAlign = isRtl ? 'left' : 'right';
      const badgeX = isRtl ? 60 : 540;
      ctx.fillText('UNESCO MIL RESOURCE', badgeX, 65);
      
      // 4. Draw Title
      ctx.fillStyle = '#1E293B'; // slate-800
      ctx.font = 'bold 24px var(--font-cairo), Cairo, sans-serif';
      ctx.textAlign = isRtl ? 'right' : 'left';
      const titleX = isRtl ? 540 : 60;
      ctx.fillText(t('learn.five_sec_check'), titleX, 140);
      
      // 5. Draw Description (needs wrapping)
      ctx.fillStyle = '#64748B'; // slate-500
      ctx.font = '500 13px var(--font-cairo), Cairo, sans-serif';
      const descText = t('learn.checklist_desc');
      const descMaxWidth = 480;
      
      // Wrap description text
      const descLines = wrapText(ctx, descText, descMaxWidth);
      descLines.forEach((line, index) => {
        ctx.fillText(line, titleX, 175 + index * 20);
      });
      
      // 6. Draw Checklist items
      const items = [
        t('learn.checklist_item1'),
        t('learn.checklist_item2'),
        t('learn.checklist_item3'),
        t('learn.checklist_item4'),
        t('learn.checklist_item5')
      ];
      
      let currentY = 250;
      items.forEach((itemText) => {
        const circleCenterX = isRtl ? 540 - 20 : 60 + 20;
        const textStartX = isRtl ? 540 - 55 : 60 + 55;
        const textMaxWidth = 420;
        
        // Draw green circle checkmark
        ctx.strokeStyle = 'rgba(45, 216, 129, 0.4)';
        ctx.fillStyle = 'rgba(45, 216, 129, 0.15)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(circleCenterX, currentY + 6, 12, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        
        // Draw Checkmark check lines
        ctx.strokeStyle = '#2DD881';
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        if (isRtl) {
          ctx.moveTo(circleCenterX + 4, currentY + 3);
          ctx.lineTo(circleCenterX - 1, currentY + 8);
          ctx.lineTo(circleCenterX - 5, currentY + 4);
        } else {
          ctx.moveTo(circleCenterX - 4, currentY + 6);
          ctx.lineTo(circleCenterX - 1, currentY + 9);
          ctx.lineTo(circleCenterX + 4, currentY + 3);
        }
        ctx.stroke();
        
        // Draw item text (wrapped)
        ctx.fillStyle = '#334155'; // slate-700
        ctx.font = '500 13px var(--font-cairo), Cairo, sans-serif';
        const lines = wrapText(ctx, itemText, textMaxWidth);
        lines.forEach((line, lineIdx) => {
          ctx.fillText(line, textStartX, currentY + 11 + lineIdx * 20);
        });
        
        // Update Y for next item based on lines count
        currentY += Math.max(55, lines.length * 20 + 20);
      });
      
      // Footer text
      ctx.fillStyle = '#94A3B8'; // slate-400
      ctx.font = 'bold 10px var(--font-cairo), Cairo, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('TRUTHLENS • DEVELOPED FOR UNESCO MEDIA LITERACY HUB 2026', 300, 760);
      
      // Trigger download
      const url = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = `truthlens_checklist_${locale}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col gap-6 py-4 md:py-6 print:p-0">
      
      {/* Title (Hidden in print) */}
      <div className="flex flex-col gap-2 print:hidden">
        <h1 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl">
          {t('learn.title')}
        </h1>
        <p className="text-sm text-white/60 max-w-xl leading-relaxed">
          {t('learn.desc')}
        </p>
      </div>

      {/* Primary Layout Grid */}
      <div className="grid gap-6 md:grid-cols-12 items-start print:grid-cols-1">
        
        {/* Left column Topic Menu (Col span 4) - Hidden in print */}
        <div className="flex flex-col gap-3 md:col-span-4 print:hidden">
          {topics.map((tItem) => {
            const isSelected = activeTopic === tItem.id;
            const Icon = tItem.icon;

            return (
              <button
                key={tItem.id}
                onClick={() => setActiveTopic(tItem.id)}
                className={clsx(
                  "flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-semibold transition-all duration-200 text-left select-none border border-transparent rtl:text-right w-full",
                  isSelected
                    ? "bg-[#00D4FF]/10 text-[#00D4FF] border-[#00D4FF]/30 font-bold"
                    : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span className="truncate">{tItem.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right column detailed explainer canvas (Col span 8) */}
        <div className="md:col-span-8 print:col-span-1 print:p-0">
          
          {/* Topic 1: GANs */}
          {activeTopic === 'gans' && (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 flex flex-col gap-4 animate-fade-in print:hidden">
              <div className="flex items-center gap-2 text-[#00D4FF]">
                <Cpu className="h-6 w-6" />
                <h2 className="text-xl font-bold text-white">
                  {t('learn.gan_basics')}
                </h2>
              </div>
              <p className="font-sans text-sm leading-relaxed text-white/70">
                {t('learn.gan_desc')}
              </p>
              <div className="rounded-xl bg-white/5 border border-white/5 p-4 flex gap-3 text-xs leading-relaxed text-white/60">
                <Info className="h-4.5 w-4.5 text-[#00D4FF] shrink-0 mt-0.5" />
                <p>
                  Because Generator algorithms can learn textures and lights directly from dataset pictures, the resulting faces look almost identical to organic human pictures. However, they struggle to model fine, non-repetitive micro-motions like blinking and micro-reflections.
                </p>
              </div>
            </div>
          )}

          {/* Topic 2: Face-Swaps */}
          {activeTopic === 'face-swaps' && (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 flex flex-col gap-4 animate-fade-in print:hidden">
              <div className="flex items-center gap-2 text-[#00D4FF]">
                <ShieldAlert className="h-6 w-6" />
                <h2 className="text-xl font-bold text-white">
                  {t('learn.techniques')}
                </h2>
              </div>
              <p className="font-sans text-sm leading-relaxed text-white/70">
                {t('learn.techniques_desc')}
              </p>
              <div className="rounded-xl bg-white/5 border border-white/5 p-4 flex gap-3 text-xs leading-relaxed text-white/60">
                <Info className="h-4.5 w-4.5 text-[#00D4FF] shrink-0 mt-0.5" />
                <p>
                  Typical face swaps apply visual blending models at boundary seams. When the actor turns their head or brings their hands near their face, the model seam line often flickers, warps, or introduces slight blurring around the ears.
                </p>
              </div>
            </div>
          )}

          {/* Topic 3: Checklist - This card handles print stylesheets */}
          {activeTopic === 'checklist' && (
            <div className="flex flex-col gap-4 animate-fade-in print:p-0">
              
              {/* Checklist visual card (Oxford blue border on white background for high contrast print) */}
              <div
                id="checklist-card"
                className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 flex flex-col gap-6 text-[#0B132B] shadow-xl max-w-xl mx-auto w-full print:border-none print:shadow-none print:p-0 print:mx-0 print:w-full"
              >
                
                {/* Badge/Header logo in card */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0B132B] p-1.5 text-white">
                      <BookOpen className="h-5 w-5 text-[#00D4FF]" />
                    </div>
                    <span className="text-sm font-black tracking-wider uppercase">
                      {t('common.title')}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#2DD881] bg-[#2DD881]/15 px-2.5 py-1 rounded-md">
                    UNESCO MIL Resource
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  <h2 className="text-xl font-black text-slate-800 leading-tight">
                    {t('learn.five_sec_check')}
                  </h2>
                  <p className="font-sans text-xs text-slate-500 font-medium">
                    {t('learn.checklist_desc')}
                  </p>
                </div>

                {/* Checklist Bullet Grid */}
                <div className="flex flex-col gap-3 mt-1">
                  {[
                    t('learn.checklist_item1'),
                    t('learn.checklist_item2'),
                    t('learn.checklist_item3'),
                    t('learn.checklist_item4'),
                    t('learn.checklist_item5')
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-xs leading-relaxed text-slate-700 font-medium">
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#2DD881]/15 border border-[#2DD881]/40 text-[#2DD881] mt-0.5">
                        <Check className="h-3.5 w-3.5" />
                      </div>
                      <p>{item}</p>
                    </div>
                  ))}
                </div>

              </div>

              {/* Action Triggers (Hidden in print) */}
              <div className="flex flex-wrap gap-4 justify-center mt-2 print:hidden">
                <button
                  onClick={handleDownloadPNG}
                  className="flex items-center gap-2 rounded-lg bg-[#00D4FF] text-[#0B132B] font-bold px-5 py-3 text-sm hover:scale-[1.02] hover:shadow-lg hover:shadow-[#00D4FF]/15 transition-all duration-200 select-none"
                >
                  <Download className="h-4.5 w-4.5" />
                  <span>{t('learn.download_card')}</span>
                </button>

                <button
                  onClick={handlePrint}
                  className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold text-white hover:bg-white/10 transition-colors select-none"
                >
                  <Printer className="h-4.5 w-4.5" />
                  <span>{locale === 'ar' ? 'طباعة البطاقة' : 'Print Reference Card'}</span>
                </button>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}
