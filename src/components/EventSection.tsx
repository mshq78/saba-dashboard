import React, { useState } from 'react';
import { EventData, QuestionGroup } from '../types';
import { COLOR_PALETTE, GROUP_LABELS } from '../data/eventData';
import { 
  Users, 
  Calendar, 
  Star, 
  MessageSquare, 
  Quote, 
  Lightbulb, 
  Smile, 
  Meh, 
  Frown, 
  Award,
  AlertTriangle,
} from 'lucide-react';
import { 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { toPersianDigits, toPersianFixed, toPersianPercent } from '../utils/persianDigits';
import { CustomPieTooltip } from './ChartTooltip';

interface EventSectionProps {
  eventId: string;
  event: EventData;
  isBest?: boolean;
  isLowest?: boolean;
}

export const EventSection: React.FC<EventSectionProps> = ({
  eventId,
  event,
  isBest,
  isLowest,
}) => {
  const [activeTab, setActiveTab] = useState<'both' | 'quantitative' | 'qualitative'>('both');
  const [selectedGroup, setSelectedGroup] = useState<'all' | QuestionGroup>('all');

  const { qualitative } = event;
  const instructorLabel = event.instructor_group_label || 'مدرس دوره';
  const getGroupLabel = (group: QuestionGroup) => group === 'instructor' ? instructorLabel : GROUP_LABELS[group];
  const qCount = event.questions.length;
  const eventDisplayName = eventId === 'MAP' ? 'MAP' : toPersianDigits(eventId);
  const participationPct = qualitative.pct_of_participants ?? qualitative.response_rate_pct ?? 0;

  // 3 Axis Data
  const axisData = [
    { 
      name: 'محتوا و مطالب دوره', 
      group: 'content',
      score: event.group_means.content, 
      color: COLOR_PALETTE.content 
    },
    { 
      name: instructorLabel, 
      group: 'instructor',
      score: event.group_means.instructor, 
      color: COLOR_PALETTE.instructor 
    },
    { 
      name: 'محیط، اجرا و پذیرایی', 
      group: 'logistics',
      score: event.group_means.logistics, 
      color: COLOR_PALETTE.logistics 
    },
  ];

  // Questions filtered
  const filteredQuestions = selectedGroup === 'all'
    ? event.questions
    : event.questions.filter((q) => q.group === selectedGroup);

  // Highest and lowest questions
  const sortedQuestions = [...event.questions].sort((a, b) => b.mean - a.mean);
  const highestQ = sortedQuestions[0];
  const lowestQ = sortedQuestions[sortedQuestions.length - 1];

  // Sentiment donut
  const sentimentData = [
    {
      name: 'مثبت',
      count: qualitative.sentiment_counts['مثبت'] || 0,
      pct: qualitative.sentiment_pct['مثبت'] || 0,
      color: COLOR_PALETTE.sentiment['مثبت'],
    },
    {
      name: 'ترکیبی',
      count: qualitative.sentiment_counts['ترکیبی'] || 0,
      pct: qualitative.sentiment_pct['ترکیبی'] || 0,
      color: COLOR_PALETTE.sentiment['ترکیبی'],
    },
    {
      name: 'منفی',
      count: qualitative.sentiment_counts['منفی'] || 0,
      pct: qualitative.sentiment_pct['منفی'] || 0,
      color: COLOR_PALETTE.sentiment['منفی'],
    },
  ].filter((item) => item.count > 0);

  // Top themes
  const themeEntries = Object.entries(qualitative.theme_counts).map(([theme, count]) => ({
    theme,
    count: Number(count),
    pct: qualitative.theme_pct_of_comments[theme] || 0,
  })).sort((a, b) => b.count - a.count);

  const getSentimentTagBadge = (tag: string) => {
    switch (tag) {
      case 'مثبت':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <Smile className="w-3.5 h-3.5" />
            مثبت
          </span>
        );
      case 'ترکیبی':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <Meh className="w-3.5 h-3.5" />
            ترکیبی
          </span>
        );
      case 'منفی':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
            <Frown className="w-3.5 h-3.5" />
            منفی
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <section 
      id={`event-${eventId}`} 
      className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6 scroll-mt-24 transition-all"
    >
      {/* Event Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="px-3 py-1 rounded-lg bg-blue-100 text-blue-800 text-xs font-extrabold tracking-wide">
              {eventId === 'MAP' ? 'رویداد MAP' : `رویداد آموزشی ${toPersianDigits(eventId)}`}
            </span>
            {isBest && (
              <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1 border border-emerald-200">
                <Award className="w-3.5 h-3.5" />
                رتبه اول کیفیت کل
              </span>
            )}
            {isLowest && (
              <span className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-800 text-xs font-bold flex items-center gap-1 border border-amber-200">
                <AlertTriangle className="w-3.5 h-3.5" />
                بیشترین نیاز به بهبود
              </span>
            )}
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
            ارزیابی جامع نتایج کمّی و کیفی رویداد {eventDisplayName}
          </h2>

          <div className="flex items-center gap-4 text-xs text-slate-500 mt-2 flex-wrap">
            <span className="inline-flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-md">
              <Users className="w-3.5 h-3.5 text-slate-500" />
              تعداد شرکت‌کنندگان: <strong className="text-slate-800 font-bold">{toPersianDigits(event.n_participants)} نفر</strong>
            </span>
            <span className="inline-flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-md">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              تاریخ اجرا: <span className="text-slate-700">{toPersianDigits(event.date_start_jalali)} تا {toPersianDigits(event.date_end_jalali)}</span>
            </span>
            <span className="inline-flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-md">
              <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
              نظرات کیفی: <strong className="text-slate-800 font-bold">{toPersianDigits(qualitative.n_comments)} نظر</strong> ({toPersianPercent(participationPct)} مشارکت)
            </span>
          </div>
        </div>

        {/* Overall Score Badge & View Tabs */}
        <div className="flex items-center gap-4 flex-wrap self-start lg:self-center">
          <div className="bg-slate-900 text-white px-5 py-3 rounded-xl flex items-center gap-3">
            <Star className="w-6 h-6 text-amber-400 fill-amber-400 shrink-0" />
            <div>
              <div className="text-[10px] text-slate-400 font-medium">میانگین کل رضایت</div>
              <div className="text-2xl font-black leading-none mt-0.5">
                {toPersianFixed(event.overall_mean)} <span className="text-xs font-normal text-slate-400">/ ۵.۰۰</span>
              </div>
            </div>
          </div>

          {/* Presentation Tabs */}
          <div className="inline-flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold no-print">
            <button
              id={`tab-both-${eventId}`}
              onClick={() => setActiveTab('both')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'both' ? 'bg-white text-blue-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              نمای کامل
            </button>
            <button
              id={`tab-quant-${eventId}`}
              onClick={() => setActiveTab('quantitative')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'quantitative' ? 'bg-white text-blue-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              بخش کمّی ({toPersianDigits(qCount)} گویه)
            </button>
            <button
              id={`tab-qual-${eventId}`}
              onClick={() => setActiveTab('qualitative')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'qualitative' ? 'bg-white text-blue-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              بخش کیفی (نظرات)
            </button>
          </div>
        </div>
      </div>

      {/* 3 Main Axis Highlight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {axisData.map((axis) => (
          <div 
            key={axis.group}
            className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700">{axis.name}</span>
              <span 
                className="text-lg font-black"
                style={{ color: axis.color }}
              >
                {toPersianFixed(axis.score)} <span className="text-xs font-normal text-slate-400">/ ۵</span>
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${(axis.score / 5) * 100}%`,
                  backgroundColor: axis.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* QUANTITATIVE SECTION */}
      {(activeTab === 'both' || activeTab === 'quantitative') && (
        <div className="space-y-6 pt-2">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                ۱
              </div>
              <h3 className="font-bold text-base sm:text-lg text-slate-800">
                نتایج کمّی: تحلیل {toPersianDigits(qCount)} گویه استاندارد ارزیابی
              </h3>
            </div>

            {/* Quick Filters for groups */}
            <div className="flex items-center gap-1.5 text-xs font-medium no-print flex-wrap">
              <span className="text-slate-500 ml-1">فیلتر محور:</span>
              {(['all', 'content', 'instructor', 'logistics'] as const).map((grp) => (
                <button
                  key={grp}
                  id={`filter-${eventId}-${grp}`}
                  onClick={() => setSelectedGroup(grp)}
                  className={`px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                    selectedGroup === grp
                      ? 'bg-blue-600 text-white border-blue-600 font-bold'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {grp === 'all' ? `همه (${toPersianDigits(qCount)} گویه)` : getGroupLabel(grp)}
                </button>
              ))}
            </div>
          </div>

          {/* Highest vs Lowest Key Insight Pills */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-emerald-50/90 border border-emerald-200 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                <Star className="w-4 h-4 fill-emerald-600 text-emerald-600" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-emerald-800">بالاترین امتیاز گویه‌ها</div>
                <div className="text-xs text-slate-700 font-medium mt-0.5">{highestQ.label}</div>
                <div className="text-xs font-bold text-emerald-700 mt-1">
                  نمره: {toPersianFixed(highestQ.mean)} از ۵ • ({getGroupLabel(highestQ.group)})
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-rose-50/90 border border-rose-200 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 mt-0.5">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-rose-800">پایین‌ترین امتیاز گویه‌ها (فرصت بهبود)</div>
                <div className="text-xs text-slate-700 font-medium mt-0.5">{lowestQ.label}</div>
                <div className="text-xs font-bold text-rose-700 mt-1">
                  نمره: {toPersianFixed(lowestQ.mean)} از ۵ • ({getGroupLabel(lowestQ.group)})
                </div>
              </div>
            </div>
          </div>

          {/* Questions Table / Visual Presentation */}
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
            <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
              <span className="font-bold text-xs sm:text-sm text-slate-700">
                جدول تفصیلی نمرات {toPersianDigits(qCount)} گویه ارزیابی دوره
              </span>
              <span className="text-xs text-slate-500">
                نمایش {toPersianDigits(filteredQuestions.length)} از {toPersianDigits(qCount)} گویه
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-100/70 text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3 w-12 text-center">ردیف</th>
                    <th className="py-2.5 px-3">عنوان شاخص ارزیابی</th>
                    <th className="py-2.5 px-3 w-40">محور ارزیابی</th>
                    <th className="py-2.5 px-3 w-24 text-center">میانگین</th>
                    <th className="py-2.5 px-3 w-48 text-center hidden md:table-cell">نمودار پیشرفت</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {filteredQuestions.map((q, idx) => {
                    const groupColor = COLOR_PALETTE[q.group];
                    const pct = (q.mean / 5) * 100;
                    return (
                      <tr key={q.col} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-2.5 px-3 font-bold text-slate-400 text-center">
                          {toPersianDigits(idx + 1)}
                        </td>
                        <td className="py-2.5 px-3 font-medium text-slate-800">
                          {q.label}
                        </td>
                        <td className="py-2.5 px-3">
                          <span 
                            className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold border"
                            style={{
                              backgroundColor: `${groupColor}15`,
                              borderColor: `${groupColor}40`,
                              color: groupColor
                            }}
                          >
                            {getGroupLabel(q.group)}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-center font-bold text-slate-900">
                          {toPersianFixed(q.mean)}
                        </td>
                        <td className="py-2.5 px-3 hidden md:table-cell">
                          <div className="flex items-center gap-2">
                            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                              <div
                                className="h-full rounded-full"
                                style={{
                                  width: `${pct}%`,
                                  backgroundColor: groupColor
                                }}
                              />
                            </div>
                            <span className="text-[10px] text-slate-400 w-8 text-left font-bold">
                              {toPersianPercent(pct)}
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* QUALITATIVE SECTION */}
      {(activeTab === 'both' || activeTab === 'qualitative') && (
        <div className="space-y-6 pt-4 border-t border-slate-200">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm">
              ۲
            </div>
            <h3 className="font-bold text-base sm:text-lg text-slate-800">
              نتایج کیفی: تحلیل احساسات، موضوعات پرتکرار و پیشنهادها ({toPersianDigits(qualitative.n_comments)} نظر ثبت‌شده)
            </h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sentiment Analysis Donut Card */}
            <div className="bg-slate-50/80 rounded-xl p-5 border border-slate-200 flex flex-col justify-between">
              <h4 className="font-bold text-xs sm:text-sm text-slate-800 mb-3 flex items-center gap-2">
                <span>توزیع لحن و احساسات نظرات</span>
              </h4>

              <div className="h-44 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sentimentData}
                      dataKey="count"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={65}
                      paddingAngle={4}
                    >
                      {sentimentData.map((entry) => (
                        <Cell key={`cell-${entry.name}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomPieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-200 text-xs">
                {sentimentData.map((item) => (
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

            {/* Frequent Themes Card */}
            <div className="lg:col-span-2 bg-slate-50/80 rounded-xl p-5 border border-slate-200 flex flex-col justify-between">
              <h4 className="font-bold text-xs sm:text-sm text-slate-800 mb-3">
                پرتکرارترین موضوعات مطرح‌شده در نظرات آزاد
              </h4>

              <div className="space-y-3">
                {themeEntries.map((item) => (
                  <div key={item.theme} className="bg-white p-3 rounded-lg border border-slate-200/80">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-bold text-slate-800">{item.theme}</span>
                      <span className="text-slate-600 font-bold">
                        {toPersianDigits(item.count)} مورد ({toPersianPercent(item.pct)} نظرات)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-amber-500"
                        style={{ width: `${Math.min(100, item.pct)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-[11px] text-slate-500 mt-3 text-left">
                * درصدها بر اساس کل نظرات ارائه‌شده محاسبه شده‌اند.
              </div>
            </div>
          </div>

          {/* Verbatim Comments List */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-slate-800 flex items-center gap-2">
              <Quote className="w-4 h-4 text-slate-400" />
              <span>نقل‌قول‌های مستقیم و نمونه نظرات ثبت‌شده شرکت‌کنندگان ({toPersianDigits(qualitative.sample_quotes.length)} نمونه برجسته)</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {qualitative.sample_quotes.map((quote, idx) => (
                <div 
                  key={idx}
                  className="bg-slate-50/90 border border-slate-200 rounded-xl p-4 flex flex-col justify-between hover:border-slate-300 transition-colors"
                >
                  <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-normal mb-3">
                    "{quote.text}"
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                    <span className="text-[11px] text-slate-500 font-bold">
                      نمونه نظر {toPersianDigits(idx + 1)}
                    </span>
                    {getSentimentTagBadge(quote.tag)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actionable Recommendations */}
          <div className="bg-gradient-to-l from-blue-900 to-indigo-950 text-white rounded-xl p-5 sm:p-6 shadow-sm">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold mb-3">
              <Lightbulb className="w-4 h-4" />
              <span>پیشنهادهای عملیاتی و راهکارهای اصلاحی برای رویداد {eventDisplayName}</span>
            </div>

            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-200 leading-relaxed">
              {event.recommendations.map((rec, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {toPersianDigits(idx + 1)}
                  </span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
};
