import React from 'react';
import { rawData } from '../data/eventData';
import { 
  Users, 
  MessageSquare, 
  Trophy, 
  AlertCircle, 
  Sparkles, 
  TrendingUp,
  ArrowDown
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';
import { toPersianDigits, toPersianFixed } from '../utils/persianDigits';
import { CustomChartTooltip } from './ChartTooltip';

export const OverviewSection: React.FC = () => {
  const { comparison, events } = rawData;

  const eventChartData = [
    { name: 'رویداد ۱', score: events['1'].overall_mean, n: events['1'].n_participants, id: '1' },
    { name: 'رویداد ۲', score: events['2'].overall_mean, n: events['2'].n_participants, id: '2' },
    { name: 'رویداد ۳', score: events['3'].overall_mean, n: events['3'].n_participants, id: '3' },
    { name: 'رویداد ۴', score: events['4'].overall_mean, n: events['4'].n_participants, id: '4' },
    { name: 'رویداد MAP', score: events['MAP'].overall_mean, n: events['MAP'].n_participants, id: 'MAP' },
  ];

  return (
    <section 
      id="overview" 
      className="space-y-6 scroll-mt-24"
    >
      {/* Intro Presentation Banner */}
      <div className="bg-gradient-to-l from-slate-900 via-indigo-950 to-blue-900 rounded-3xl p-6 sm:p-10 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 text-blue-200 text-xs font-bold mb-3 border border-blue-400/30 backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>داشبورد جامع و گزارش ارزیابی اثربخشی</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold mb-3 leading-tight tracking-tight text-white">
            ارزیابی اثربخشی و تحلیل کیفیت ۵ رویداد آموزشی
          </h1>

          <p className="text-slate-300 text-xs sm:text-base leading-relaxed font-normal max-w-3xl">
            داشبورد تعاملی تک‌صفحه‌ای ارزیابی گویه‌های استاندارد (محتوا، مدرس/منتور، محیط و اجرا)، تحلیل نظرات کیفی و احساسات ۳۲ نظر ثبت‌شده، و مقایسه جامع تطبیقی ۵ رویداد آموزشی (شامل رویداد MAP) بدون تغییر یا گردکردن داده‌ها.
          </p>

          {/* Quick Anchor Jump Pills inside Banner */}
          <div className="flex items-center gap-2 mt-6 flex-wrap no-print">
            <span className="text-xs text-blue-200 font-semibold ml-1">پرش سریع به بخش‌ها:</span>
            <a 
              href="#event-1"
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-xs transition-colors"
            >
              رویداد ۱ (نمره {toPersianFixed(events['1'].overall_mean)})
            </a>
            <a 
              href="#event-2"
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-xs transition-colors"
            >
              رویداد ۲ (نمره {toPersianFixed(events['2'].overall_mean)})
            </a>
            <a 
              href="#event-3"
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-xs transition-colors"
            >
              رویداد ۳ (نمره {toPersianFixed(events['3'].overall_mean)})
            </a>
            <a 
              href="#event-4"
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-xs transition-colors"
            >
              رویداد ۴ (نمره {toPersianFixed(events['4'].overall_mean)})
            </a>
            <a 
              href="#event-MAP"
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-xs transition-colors"
            >
              رویداد MAP (نمره {toPersianFixed(events['MAP'].overall_mean)})
            </a>
            <a 
              href="#comparison"
              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors"
            >
              مقایسه تطبیقی نهایی
            </a>
          </div>
        </div>
      </div>

      {/* 4 Executive KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500 mb-0.5">مجموع شرکت‌کنندگان</div>
            <div className="text-2xl font-bold text-slate-800">
              {toPersianDigits(comparison.total_participants)} <span className="text-sm font-normal text-slate-500">نفر</span>
            </div>
            <div className="text-xs text-slate-400 mt-0.5">در ۵ دوره آموزشی (شامل MAP)</div>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500 mb-0.5">مجموع نظرات کیفی</div>
            <div className="text-2xl font-bold text-slate-800">
              {toPersianDigits(comparison.total_comments)} <span className="text-sm font-normal text-slate-500">نظر</span>
            </div>
            <div className="text-xs text-amber-600 mt-0.5 font-bold">۳۲٪ نرخ مشارکت آزاد</div>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500 mb-0.5">برترین رویداد (رتبه ۱)</div>
            <div className="text-2xl font-bold text-emerald-700">
              {comparison.best_event === 'MAP' ? 'رویداد MAP' : `رویداد ${toPersianDigits(comparison.best_event)}`}
            </div>
            <div className="text-xs text-emerald-600 mt-0.5 font-bold">
              میانگین {toPersianFixed(events[comparison.best_event].overall_mean)} از ۵
            </div>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500 mb-0.5">بیشترین نیاز به بهبود</div>
            <div className="text-2xl font-bold text-rose-700">
              رویداد {toPersianDigits(comparison.worst_event)}
            </div>
            <div className="text-xs text-rose-600 mt-0.5 font-bold">
              میانگین {toPersianFixed(events[comparison.worst_event].overall_mean)} از ۵
            </div>
          </div>
        </div>
      </div>

      {/* Overview Chart & Executive Summary Narrative */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Column (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-800 text-base">مقایسه سریع میانگین کلی رضایت رویدادها</h3>
              <p className="text-xs text-slate-500">نمره بر مبنای مقیاس ۱ تا ۵</p>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
              <span>میانگین کل دوره</span>
            </div>
          </div>

          <div className="h-64 w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={eventChartData} margin={{ top: 15, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: '#475569', fontSize: 12, fontFamily: 'Vazirmatn' }} 
                  axisLine={{ stroke: '#cbd5e1' }}
                />
                <YAxis 
                  domain={[0, 5]} 
                  ticks={[0, 1, 2, 3, 4, 5]}
                  tickFormatter={(val) => toPersianDigits(val)}
                  tick={{ fill: '#475569', fontSize: 12, fontFamily: 'Vazirmatn' }} 
                  axisLine={{ stroke: '#cbd5e1' }}
                />
                <Tooltip
                  content={<CustomChartTooltip titlePrefix="" valueSuffix=" از ۵" />}
                  cursor={{ fill: '#f1f5f9' }}
                />
                <Bar dataKey="score" radius={[6, 6, 0, 0]} maxBarSize={48}>
                  {eventChartData.map((entry) => (
                    <Cell 
                      key={`cell-${entry.id}`} 
                      fill={entry.id === comparison.best_event ? '#55A868' : entry.id === comparison.worst_event ? '#DD8452' : '#4C72B0'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-3 text-xs text-slate-500 text-center flex items-center justify-center gap-4 flex-wrap">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#55A868' }}></span>
              بیشترین رضایت (رویداد MAP: {toPersianFixed(events['MAP'].overall_mean)})
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#4C72B0' }}></span>
              سطح مطلوب (رویداد ۴: {toPersianFixed(events['4'].overall_mean)} | رویداد ۱: {toPersianFixed(events['1'].overall_mean)} | رویداد ۲: {toPersianFixed(events['2'].overall_mean)})
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#DD8452' }}></span>
              فرصت بهبود (رویداد ۳: {toPersianFixed(events['3'].overall_mean)})
            </span>
          </div>
        </div>

        {/* Narrative Box */}
        <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-2 text-blue-400 text-xs font-bold mb-2">
              <TrendingUp className="w-4 h-4" />
              <span>خلاصه ارزیابی و بینش کلیدی</span>
            </div>
            <h3 className="text-lg font-bold mb-3 text-slate-100">
              روایت تحلیلی ۵ رویداد
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed text-justify mb-4">
              {comparison.narrative}
            </p>
          </div>

          <a
            href="#comparison"
            className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors mt-2 text-center"
          >
            <span>مشاهده جدول و ماتریس مقایسه‌ای کامل</span>
            <ArrowDown className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
};
