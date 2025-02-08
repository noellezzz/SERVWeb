import React from 'react'

const getScoreColor = (score, thresholds = { high: 90, medium: 80 }) => {
    if (score > thresholds.high) return 'text-green-600';
    if (score > thresholds.medium) return 'text-yellow-600';
    return 'text-red-600';
};

export function SentimentList({
    title = "",
    data = [],
    labelKey = "label",
    scoreKey = "score",
    className = "",
    thresholds = { high: 90, medium: 80 },
    showPercentage = true
}) {
    return (
        <div className={`p-4 ${className}`}>
            {title && (
                <h2 className="font-semibold mb-4 text-gray-600">{title}</h2>
            )}
            <ul className='space-y-2'>
                {data.map((item, index) => (
                    <li
                        key={index}
                        className='flex justify-between items-center p-2 border rounded-lg bg-gray-50 shadow-sm hover:bg-gray-100 transition-colors'
                    >
                        <span className='font-medium'>{item[labelKey]}</span>
                        <span className={`font-bold ${getScoreColor(item[scoreKey], thresholds)}`}>
                            {item[scoreKey]}{showPercentage && '%'}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    )
}
