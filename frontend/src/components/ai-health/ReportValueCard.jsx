import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, HelpCircle } from 'lucide-react';

const ReportValueCard = ({
  testName,
  value,
  unit,
  referenceRange,
  status = 'normal',
  explanation,
  className = ''
}) => {
  const getStatusConfig = (st) => {
    switch (st) {
      case 'normal':
        return {
          badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          border: 'border-emerald-100/80 hover:border-emerald-300',
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />,
          label: 'Within reference range',
          valColor: 'text-gray-900'
        };
      case 'attention':
        return {
          badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
          border: 'border-amber-200/80 hover:border-amber-300 bg-amber-50/20',
          icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />,
          label: 'Needs attention',
          valColor: 'text-amber-900 font-bold'
        };
      case 'abnormal':
        return {
          badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
          border: 'border-rose-200/80 hover:border-rose-300 bg-rose-50/20',
          icon: <AlertCircle className="w-3.5 h-3.5 text-rose-600" />,
          label: 'Outside reference range',
          valColor: 'text-rose-900 font-bold'
        };
      default:
        return {
          badgeBg: 'bg-gray-100 text-gray-700 border-gray-200',
          border: 'border-gray-200 hover:border-gray-300',
          icon: <HelpCircle className="w-3.5 h-3.5 text-gray-500" />,
          label: 'Reference not specified',
          valColor: 'text-gray-900'
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <div className={`bg-white border rounded-2xl p-4 sm:p-5 shadow-sm transition-all duration-200 hover:shadow-md flex flex-col justify-between ${config.border} ${className}`}>
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <h4 className="font-semibold text-gray-900 text-sm sm:text-base leading-snug">
            {testName}
          </h4>
          <span className={`inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full border font-medium flex-shrink-0 ${config.badgeBg}`}>
            {config.icon}
            <span>{config.label}</span>
          </span>
        </div>

        <div className="flex items-baseline gap-1.5 my-2">
          <span className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${config.valColor}`}>
            {value}
          </span>
          {unit && <span className="text-xs sm:text-sm font-medium text-gray-500">{unit}</span>}
        </div>

        {referenceRange && (
          <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-2">
            <span className="font-medium text-gray-400">Reference:</span>
            <span className="font-semibold text-gray-700 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-150">
              {referenceRange}
            </span>
          </div>
        )}
      </div>

      {explanation && (
        <p className="text-xs text-gray-600 mt-2 pt-2 border-t border-gray-100 leading-relaxed">
          {explanation}
        </p>
      )}
    </div>
  );
};

export default ReportValueCard;
