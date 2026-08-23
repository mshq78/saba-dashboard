import React, { useState } from 'react';
import { 
  BarChart3, 
  Presentation, 
  Printer, 
  Maximize2, 
  Minimize2, 
  ChevronLeft, 
  ChevronRight,
} from 'lucide-react';
import { toPersianDigits } from '../utils/persianDigits';

interface HeaderProps {
  activeSection: string;
  isPresentationMode: boolean;
  onTogglePresentationMode: () => void;
  onNextSlide?: () => void;
  onPrevSlide?: () => void;
  currentSlideIndex?: number;
  totalSlides?: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeSection,
  isPresentationMode,
  onTogglePresentationMode,
  onNextSlide,
  onPrevSlide,
  currentSlideIndex = 0,
  totalSlides = 7,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const sections = [
    { id: 'overview', label: 'نمای کلی' },
    { id: 'event-1', label: 'رویداد ۱' },
    { id: 'event-2', label: 'رویداد ۲' },
    { id: 'event-3', label: 'رویداد ۳' },
    { id: 'event-4', label: 'رویداد ۴' },
    { id: 'event-MAP', label: 'رویداد MAP' },
    { id: 'comparison', label: 'مقایسه تطبیقی' },
  ];

  const handleFullscreenToggle = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Logo / Title Area */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs font-bold text-sm">
                <BarChart3 className="w-4 h-4" />
              </div>
              <div>
                <h1 className="text-sm sm:text-base font-extrabold text-slate-800 tracking-tight leading-none">
                  داشبورد ارزیابی اثربخشی ۵ رویداد آموزشی
                </h1>
                <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                  گزارش تحلیلی یکپارچه، کمّی و کیفی (شامل رویداد MAP)
                </div>
              </div>
            </div>

            {/* Mobile presentation toggle */}
            <div className="flex md:hidden items-center gap-1.5">
              <button
                onClick={onTogglePresentationMode}
                className={`p-2 rounded-lg text-xs font-bold border ${
                  isPresentationMode ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-100 text-slate-700 border-slate-200'
                }`}
                title="حالت ارائه"
              >
                <Presentation className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Center: Anchor Navigation Pills */}
          {!isPresentationMode ? (
            <nav className="flex items-center overflow-x-auto py-1 no-scrollbar gap-1 text-xs font-semibold">
              {sections.map((sec) => {
                const isActive = activeSection === sec.id;
                return (
                  <a
                    key={sec.id}
                    id={`nav-${sec.id}`}
                    href={`#${sec.id}`}
                    className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-xs font-bold'
                        : 'text-slate-600 hover:text-blue-600 hover:bg-slate-100'
                    }`}
                  >
                    {sec.label}
                  </a>
                );
              })}
            </nav>
          ) : (
            <div className="flex items-center gap-2 text-xs font-bold bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200">
              <span className="text-blue-800">
                اسلاید {toPersianDigits(currentSlideIndex + 1)} از {toPersianDigits(totalSlides)} :
              </span>
              <span className="text-blue-950 font-black">
                {sections[currentSlideIndex]?.label || 'اسلاید'}
              </span>

              <div className="flex items-center gap-1 mr-2">
                <button
                  onClick={onPrevSlide}
                  disabled={currentSlideIndex === 0}
                  className="p-1 rounded bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 border border-slate-200 cursor-pointer"
                  title="اسلاید قبلی"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={onNextSlide}
                  disabled={currentSlideIndex === totalSlides - 1}
                  className="p-1 rounded bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 border border-slate-200 cursor-pointer"
                  title="اسلاید بعدی"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Right: Presentation & Utility Tools */}
          <div className="hidden md:flex items-center gap-2">
            {/* Mode Switcher */}
            <button
              id="toggle-presentation-mode-btn"
              onClick={onTogglePresentationMode}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border cursor-pointer ${
                isPresentationMode
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
              }`}
              title="تغییر به حالت ارائه اسلایدی یا نمای پیوسته"
            >
              <Presentation className="w-3.5 h-3.5" />
              <span>{isPresentationMode ? 'خروج از حالت ارائه' : 'حالت ارائه (اسلاید)'}</span>
            </button>

            {/* Print button */}
            <button
              id="print-btn"
              onClick={handlePrint}
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200 cursor-pointer"
              title="چاپ یا ذخیره PDF"
            >
              <Printer className="w-4 h-4" />
            </button>

            {/* Fullscreen button */}
            <button
              id="fullscreen-btn"
              onClick={handleFullscreenToggle}
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200 cursor-pointer"
              title="تمام‌صفحه"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
