import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from './Tooltip';

const StatsChart = ({ data, height = 160, className = '' }) => {
    const maxValue = Math.max(...data.map(item => item.value));
    
    return (
        <div className={`w-full ${className}`} style={{ height: `${height}px` }}>
            <div className="flex items-end justify-between h-full gap-2">
                {data.map((item, index) => {
                    const percentage = (item.value / maxValue) * 100 || 0;
                    // Color coding: green for max, yellow for mid, red for low
                    let barColor = 'bg-green-400 dark:bg-green-600';
                    if (percentage < 33) barColor = 'bg-red-400 dark:bg-red-600';
                    else if (percentage < 66) barColor = 'bg-yellow-400 dark:bg-yellow-600';
                    return (
                        <Tooltip 
                            key={index}
                            content={`${item.label}: ${item.value}`}
                            position="top"
                        >
                            <div className="flex-1 flex flex-col items-center gap-2">
                                <div 
                                    className={`w-full rounded-t transition-all duration-500 ease-out hover:scale-105 cursor-pointer chart-bar ${barColor}`}
                                    style={{ height: `${percentage}%` }}
                                    role="graphics-symbol"
                                    aria-label={`${item.label}: ${item.value}`}
                                />
                                <span className="text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">
                                    {item.label}
                                </span>
                            </div>
                        </Tooltip>
                    );
                })}
            </div>
        </div>
    );
};

StatsChart.propTypes = {
    data: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            value: PropTypes.number.isRequired
        })
    ).isRequired,
    height: PropTypes.number,
    className: PropTypes.string
};

export default StatsChart;