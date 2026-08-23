import React from 'react';
import { toPersianDigits, toPersianFixed, toPersianPercent } from '../utils/persianDigits';

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name?: string;
    value?: any;
    color?: string;
    dataKey?: string;
    payload?: any;
  }>;
  label?: string;
  titlePrefix?: string;
  valueSuffix?: string;
}

export const CustomChartTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label,
  titlePrefix = 'رویداد: ',
  valueSuffix = ' از ۵',
}) => {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const getLabelName = (nameOrKey?: string) => {
    if (nameOrKey === 'content' || nameOrKey === 'محتوا') return 'محتوا و مطالب دوره';
    if (nameOrKey === 'instructor' || nameOrKey === 'مدرس') return 'مدرس دوره';
    if (nameOrKey === 'logistics' || nameOrKey === 'محیط') return 'محیط، اجرا و پذیرایی';
    if (nameOrKey === 'score') return 'میانگین رضایت کل';
    return nameOrKey || '';
  };

  return (
    <div 
      className="bg-white border border-slate-200 rounded-xl p-3 shadow-xl text-right text-xs select-none min-w-[170px]"
      style={{ direction: 'rtl', fontFamily: 'Vazirmatn' }}
    >
      {label && (
        <div className="font-bold text-slate-800 pb-1.5 mb-2 border-b border-slate-100 flex items-center justify-between gap-3">
          <span className="text-slate-900 font-bold">{titlePrefix}{toPersianDigits(label)}</span>
        </div>
      )}
      
      <div className="space-y-2">
        {payload.map((item, index) => {
          const formattedVal = typeof item.value === 'number' 
            ? `${toPersianFixed(item.value)}${valueSuffix}` 
            : toPersianDigits(item.value);
          const name = getLabelName(item.name || item.dataKey);

          return (
            <div key={index} className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                {item.color && (
                  <span 
                    className="w-2.5 h-2.5 rounded-full shrink-0" 
                    style={{ backgroundColor: item.color }} 
                  />
                )}
                <span>{name}:</span>
              </span>
              <span className="font-bold text-slate-900 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
                {formattedVal}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const CustomPieTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
}) => {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const dataItem = payload[0];
  const underlyingData = dataItem.payload || {};
  const name = underlyingData.name || dataItem.name;
  const count = underlyingData.count ?? dataItem.value;
  const pct = underlyingData.pct;
  const color = underlyingData.color || dataItem.color || '#3b82f6';

  return (
    <div 
      className="bg-white border border-slate-200 rounded-xl p-3 shadow-xl text-right text-xs select-none min-w-[160px]"
      style={{ direction: 'rtl', fontFamily: 'Vazirmatn' }}
    >
      <div className="flex items-center gap-2 pb-1.5 mb-2 border-b border-slate-100">
        <span 
          className="w-3 h-3 rounded-full shrink-0" 
          style={{ backgroundColor: color }} 
        />
        <span className="font-bold text-slate-800 text-xs">
          لحن {name}
        </span>
      </div>

      <div className="space-y-1 text-slate-600">
        <div className="flex items-center justify-between gap-2">
          <span>تعداد نظرات:</span>
          <span className="font-bold text-slate-900 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
            {toPersianDigits(count)} نظر
          </span>
        </div>
        {pct !== undefined && (
          <div className="flex items-center justify-between gap-2">
            <span>سهم از کل:</span>
            <span className="font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
              {toPersianPercent(pct)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
