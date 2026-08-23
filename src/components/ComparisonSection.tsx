import React from 'react';
import { rawData, COLOR_PALETTE } from '../data/eventData';
import { 
  GitCompare, 
  Trophy, 
  TrendingUp, 
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { toPersianDigits, toPersianFixed, toPersianPercent } from '../utils/persianDigits';
import { CustomChartTooltip, CustomPieTooltip } from './ChartTooltip';

export const ComparisonSection: React.FC = () => {
  const { comparison, events } = rawData;

  // Grouped Bar Chart Data (Content, Instructor, Logistics for each event)
  const groupedChartData = comparison.per_event_summary.map((item) => ({
    name: item.event === 'MAP' ? 'رویداد MAP' : `رویداد ${toPersianDigits(item.event)}`,
    content: item.content_mean,
    instructor: item.instructor_mean,
    logistics: item.logistics_mean,
    overall: item.overall_mean,
  }));

  // Aggregate Sentiment Donut Data
  const aggregateSentimentData = [
    {
      name: 'مثبت',
      count: comparison.aggregate_sentiment_counts['مثبت'] || 0,
      pct: Math.round(((comparison.aggregate_sentiment_counts['مثبت'] || 0) / comparison.total_comments) * 100),
      color: COLOR_PALETTE.sentiment['مثبت'],
    },
    {
      name: 'ترکیبی',
      count: comparison.aggregate_sentiment_counts['ترکیبی'] || 0,
      pct: Math.round(((comparison.aggregate_sentiment_counts['ترکیبی'] || 0) / comparison.total_comments) * 100),
      color: COLOR_PALETTE.sentiment['ترکیبی'],
    },
    {
      name: 'منفی',
      count: comparison.aggregate_sentiment_counts['منفی'] || 0,
      pct: Math.round(((comparison.aggregate_sentiment_counts['منفی'] || 0) / comparison.total_comments) * 100),
      color: COLOR_PALETTE.sentiment['منفی'],
    },
  ];

  // Aggregate Themes
  const aggregateThemes = Object.entries(comparison.aggregate_theme_counts).map(([theme, count]) => ({
    theme,
    count: Number(count),
    pct: Math.round((Number(count) / comparison.total_comments) * 100),
  })).sort((a, b) => b.count - a.count);

  return (
    <section 
      id="comparison" 
      className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6 scroll-mt-24"
    >
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-indigo-100 text-indigo-800 text-xs font-bold mb-1">
            <GitCompare className="w-3.5 h-3.5" />
            <span>مقایسه جامع و تطبیقی</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
            تحلیل مقایسه‌ای و جمع‌بندی نهایی رویدادهای آموزشی
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            ارزیابی متقاطع عملکرد محتوا، اساتید و لجستیک در سراسر دوره‌های آموزشی
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-emerald-600" />
            <span>برترین دوره: {comparison.best_event === 'MAP' ? 'رویداد MAP' : `رویداد ${toPersianDigits(comparison.best_event)}`} ({toPersianFixed(events[comparison.best_event]?.overall_mean || 0)})</span>
          </div>
        </div>
      </div>

      {/* Comparison Grouped Bar Chart */}
      <div className="bg-slate-50/70 rounded-xl p-5 border border-slate-200">
        <div className="mb-4">
          <h3 className="font-bold text-slate-800 text-sm sm:text-base">
            مقایسه میانگین سه محور اصلی در تمامی رویدادها
          </h3>
          <p className="text-xs text-slate-500">
            تفکیک نمرات محتوا ({COLOR_PALETTE.content})، مدرس/منتور ({COLOR_PALETTE.instructor}) و محیط/لجستیک ({COLOR_PALETTE.logistics})
          </p>
        </div>

        <div className="h-80 w-full" dir="ltr">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={groupedChartData}
              margin={{ top: 20, right: 25, left: -10, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis 
                dataKey="name" 
                tick={{ fill: '#334155', fontSize: 12, fontFamily: 'Vazirmatn' }} 
                axisLine={{ stroke: '#cbd5e1' }}
              />
              <YAxis 
                domain={[0, 5]} 
                ticks={[0, 1, 2, 3, 4, 5]}
                tickFormatter={(val) => toPersianDigits(val)}
                tick={{ fill: '#64748b', fontSize: 12, fontFamily: 'Vazirmatn' }} 
                axisLine={{ stroke: '#cbd5e1' }}
              />
              <Tooltip
                content={<CustomChartTooltip titlePrefix="" valueSuffix=" از ۵" />}
                cursor={{ fill: '#f1f5f9' }}
              />
              <Legend 
                formatter={(value) => {
                  if (value === 'content') return 'محتوا و مطالب دوره';
                  if (value === 'instructor') return 'مدرس / منتور دوره';
                  if (value === 'logistics') return 'محیط، اجرا و پذیرایی';
                  return value;
                }}
                wrapperStyle={{ fontFamily: 'Vazirmatn', fontSize: '12px', paddingTop: '10px' }}
              />
              <Bar dataKey="content" fill={COLOR_PALETTE.content} radius={[4, 4, 0, 0]} maxBarSize={28} />
              <Bar dataKey="instructor" fill={COLOR_PALETTE.instructor} radius={[4, 4, 0, 0]} maxBarSize={28} />
              <Bar dataKey="logistics" fill={COLOR_PALETTE.logistics} radius={[4, 4, 0, 0]} maxBarSize={28} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Comparative Data Matrix Table */}
      <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
          <h3 className="font-bold text-xs sm:text-sm text-slate-800">
            ماتریس داده‌های مقایسه‌ای رویدادهای آموزشی
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-100/70 text-slate-700 font-bold">
                <th className="py-3 px-4">رویداد</th>
                <th className="py-3 px-4 text-center">شرکت‌کنندگان</th>
                <th className="py-3 px-4 text-center" style={{ color: COLOR_PALETTE.content }}>
                  محتوا و مطالب
                </th>
                <th className="py-3 px-4 text-center" style={{ color: COLOR_PALETTE.instructor }}>
                  مدرس / منتور
                </th>
                <th className="py-3 px-4 text-center" style={{ color: COLOR_PALETTE.logistics }}>
                  محیط و پذیرایی
                </th>
                <th className="py-3 px-4 text-center font-bold text-slate-900">میانگین کل</th>
                <th className="py-3 px-4 text-center">تعداد نظرات</th>
                <th className="py-3 px-4 text-center">وضعیت کیفی</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {comparison.per_event_summary.map((row) => {
                const isBest = comparison.best_event === row.event;
                const isWorst = comparison.worst_event === row.event;

                return (
                  <tr 
                    key={row.event}
                    className={`hover:bg-slate-50 transition-colors ${
                      isBest ? 'bg-emerald-50/30' : isWorst ? 'bg-rose-50/20' : ''
                    }`}
                  >
                    <td className="py-3 px-4 font-bold text-slate-800">
                      <div className="flex items-center gap-2">
                        <span>{row.event === 'MAP' ? 'رویداد MAP' : `رویداد ${toPersianDigits(row.event)}`}</span>
                        {isBest && (
                          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800">
                            رتبه اول
                          </span>
                        )}
                        {isWorst && (
                          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-100 text-rose-800">
                            فرصت بهبود
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-center font-bold text-slate-600">
                      {toPersianDigits(row.n)} نفر
                    </td>

                    <td className="py-3 px-4 text-center font-bold" style={{ color: COLOR_PALETTE.content }}>
                      {toPersianFixed(row.content_mean)}
                    </td>

                    <td className="py-3 px-4 text-center font-bold" style={{ color: COLOR_PALETTE.instructor }}>
                      {toPersianFixed(row.instructor_mean)}
                    </td>

                    <td className="py-3 px-4 text-center font-bold" style={{ color: COLOR_PALETTE.logistics }}>
                      {toPersianFixed(row.logistics_mean)}
                    </td>

                    <td className="py-3 px-4 text-center font-black text-slate-900 text-sm">
                      {toPersianFixed(row.overall_mean)}
                    </td>

                    <td className="py-3 px-4 text-center font-bold text-slate-600">
                      {toPersianDigits(row.n_comments)} نظر
                    </td>

                    <td className="py-3 px-4 text-center">
                      <a 
                        href={`#event-${row.event}`}
                        className="inline-flex items-center px-2.5 py-1 rounded bg-slate-100 hover:bg-blue-100 text-blue-800 text-xs font-semibold transition-colors"
                      >
                        مشاهده جزئیات
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Aggregate Sentiment & Topics Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Total Sentiment Donut */}
        <div className="bg-slate-50/80 rounded-xl p-5 border border-slate-200 flex flex-col justify-between">
          <h4 className="font-bold text-xs sm:text-sm text-slate-800 mb-2">
            توزیع تجمیعی لحن نظرات ({toPersianDigits(comparison.total_comments)} نظر در کل دوره‌ها)
          </h4>

          <div className="h-44 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={aggregateSentimentData}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={65}
                  paddingAngle={4}
                >
                  {aggregateSentimentData.map((entry) => (
                    <Cell key={`cell-${entry.name}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-200 text-xs">
            {aggregateSentimentData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-medium text-slate-700">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  نظرات {item.name}:
                </span>
                <span className="font-bold text-slate-900">
                  {toPersianDigits(item.count)} نظر ({toPersianPercent(item.pct)})
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Aggregate Frequent Themes */}
        <div className="lg:col-span-2 bg-slate-50/80 rounded-xl p-5 border border-slate-200 flex flex-col justify-between">
          <h4 className="font-bold text-xs sm:text-sm text-slate-800 mb-3">
            مهم‌ترین موضوعات تجمیعی مطرح‌شده توسط شرکت‌کنندگان
          </h4>

          <div className="space-y-2.5">
            {aggregateThemes.map((item) => (
              <div key={item.theme} className="bg-white p-3 rounded-lg border border-slate-200">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-slate-800">{item.theme}</span>
                  <span className="text-slate-600 font-bold">
                    {toPersianDigits(item.count)} مرتبه ({toPersianPercent(item.pct)})
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-blue-600"
                    style={{ width: `${Math.min(100, item.pct)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="text-[11px] text-slate-500 mt-2 text-left">
            * تحلیل احساسات و موضوعات بدون دخل و تصرف از متون نظرات {toPersianDigits(comparison.total_comments)} شرکت‌کننده استخراج شده است.
          </div>
        </div>
      </div>

      {/* Narrative Synthesis Box */}
      <div className="bg-gradient-to-l from-slate-900 to-indigo-950 text-white rounded-xl p-6 sm:p-7 shadow-sm">
        <div className="flex items-center gap-2 text-blue-400 text-xs font-bold mb-2">
          <TrendingUp className="w-4 h-4" />
          <span>جمع‌بندی مدیریتی و روایت جامع</span>
        </div>
        <h3 className="text-lg font-bold text-slate-100 mb-3">
          تحلیل و ارزیابی نهایی دوره‌ها
        </h3>
        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed text-justify font-normal">
          {comparison.narrative}
        </p>
      </div>
    </section>
  );
};
