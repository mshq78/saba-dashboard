import React, { useState, useEffect } from 'react';
import { rawData } from './data/eventData';
import { Header } from './components/Header';
import { OverviewSection } from './components/OverviewSection';
import { EventSection } from './components/EventSection';
import { ComparisonSection } from './components/ComparisonSection';
import { ChevronLeft, ChevronRight, Presentation } from 'lucide-react';
import { toPersianDigits } from './utils/persianDigits';

export default function App() {
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [isPresentationMode, setIsPresentationMode] = useState<boolean>(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);

  const sectionIds = ['overview', 'event-1', 'event-2', 'event-3', 'event-4', 'event-MAP', 'comparison'];
  const { events, comparison } = rawData;

  // Automatically scroll to the top of the page whenever the slide changes in presentation mode
  useEffect(() => {
    if (isPresentationMode) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentSlideIndex, isPresentationMode]);

  // Scroll listener to update active section in header in single page view
  useEffect(() => {
    if (isPresentationMode) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSection(sectionIds[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isPresentationMode]);

  // Keyboard navigation for presentation mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPresentationMode) return;

      if (e.key === 'ArrowLeft' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        setCurrentSlideIndex((prev) => {
          const next = Math.min(prev + 1, sectionIds.length - 1);
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return next;
        });
      } else if (e.key === 'ArrowRight' || e.key === 'PageUp') {
        e.preventDefault();
        setCurrentSlideIndex((prev) => {
          const next = Math.max(prev - 1, 0);
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return next;
        });
      } else if (e.key === 'Escape') {
        setIsPresentationMode(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPresentationMode, sectionIds.length]);

  const handleNextSlide = () => {
    setCurrentSlideIndex((prev) => Math.min(prev + 1, sectionIds.length - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevSlide = () => {
    setCurrentSlideIndex((prev) => Math.max(prev - 1, 0));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderSlideContent = () => {
    switch (currentSlideIndex) {
      case 0:
        return <OverviewSection />;
      case 1:
        return (
          <EventSection
            eventId="1"
            event={events['1']}
          />
        );
      case 2:
        return (
          <EventSection
            eventId="2"
            event={events['2']}
          />
        );
      case 3:
        return (
          <EventSection
            eventId="3"
            event={events['3']}
            isLowest={comparison.worst_event === '3'}
          />
        );
      case 4:
        return (
          <EventSection
            eventId="4"
            event={events['4']}
          />
        );
      case 5:
        return (
          <EventSection
            eventId="MAP"
            event={events['MAP']}
            isBest={comparison.best_event === 'MAP'}
          />
        );
      case 6:
        return <ComparisonSection />;
      default:
        return <OverviewSection />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col antialiased text-slate-800" dir="rtl">
      {/* Presentation Top Navbar */}
      <Header
        activeSection={activeSection}
        isPresentationMode={isPresentationMode}
        onTogglePresentationMode={() => {
          setIsPresentationMode(!isPresentationMode);
          if (!isPresentationMode) {
            // Find which section is currently active and start slide there
            const idx = sectionIds.indexOf(activeSection);
            setCurrentSlideIndex(idx >= 0 ? idx : 0);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
        onNextSlide={handleNextSlide}
        onPrevSlide={handlePrevSlide}
        currentSlideIndex={currentSlideIndex}
        totalSlides={sectionIds.length}
      />

      {/* Main Single Page Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {isPresentationMode ? (
          /* SLIDE PRESENTATION MODE */
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-blue-900 text-white px-5 py-3 rounded-2xl shadow-sm">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-bold">
                <Presentation className="w-4 h-4 text-blue-300" />
                <span>حالت ارائه زنده (اسلاید {toPersianDigits(currentSlideIndex + 1)} از {toPersianDigits(sectionIds.length)})</span>
                <span className="text-slate-300 text-xs hidden sm:inline">• از کلیدهای جهت‌نما یا دکمه‌های زیر برای جابجایی استفاده کنید</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevSlide}
                  disabled={currentSlideIndex === 0}
                  className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                  <span>اسلاید قبلی</span>
                </button>
                <button
                  onClick={handleNextSlide}
                  disabled={currentSlideIndex === sectionIds.length - 1}
                  className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-30 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span>اسلاید بعدی</span>
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="animate-fadeIn">
              {renderSlideContent()}
            </div>
          </div>
        ) : (
          /* ALL-IN-ONE CONTINUOUS SINGLE PAGE (DEFAULT) */
          <div className="space-y-10">
            {/* Section 1: Overview */}
            <OverviewSection />

            {/* Section 2 & 3: Event 1 (Quantitative & Qualitative) */}
            <EventSection
              eventId="1"
              event={events['1']}
            />

            {/* Section 4 & 5: Event 2 (Quantitative & Qualitative) */}
            <EventSection
              eventId="2"
              event={events['2']}
            />

            {/* Section 6 & 7: Event 3 (Quantitative & Qualitative) */}
            <EventSection
              eventId="3"
              event={events['3']}
              isLowest={comparison.worst_event === '3'}
            />

            {/* Section 8 & 9: Event 4 (Quantitative & Qualitative) */}
            <EventSection
              eventId="4"
              event={events['4']}
            />

            {/* Section 10 & 11: Event MAP (Quantitative & Qualitative) */}
            <EventSection
              eventId="MAP"
              event={events['MAP']}
              isBest={comparison.best_event === 'MAP'}
            />

            {/* Section 12: Final Comparison & Synthesis */}
            <ComparisonSection />
          </div>
        )}
      </main>

      {/* Global Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 px-6 text-center text-xs text-slate-500 mt-12 no-print">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>داشبورد تعاملی ارزیابی اثربخشی دوره‌های آموزشی و رویداد MAP (طراحی تک‌صفحه‌ای مناسب ارائه)</span>
          <span className="text-slate-400">داده‌های دقیق و بدون تغییر • ۵ رویداد آموزشی • فونت فارسی وزیر</span>
        </div>
      </footer>
    </div>
  );
}
