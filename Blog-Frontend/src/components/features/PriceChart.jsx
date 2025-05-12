import React from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { format, parseISO } from 'date-fns';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

/**
 * Price chart component for visualizing stock prices
 * @param {Object} props - Component props
 * @param {Array} props.data - Price history data
 * @param {string} props.ticker - Stock ticker symbol
 */
const PriceChart = ({ data, ticker }) => {
    if (!data || data.length === 0) return null;

    // Sort data by timestamp (ascending)
    const sortedData = [...data].sort((a, b) =>
        new Date(a.lastUpdatedAt) - new Date(b.lastUpdatedAt)
    );

    // Prepare data for chart
    const chartData = {
        labels: sortedData.map(item =>
            format(parseISO(item.lastUpdatedAt), 'HH:mm:ss')
        ),
        datasets: [
            {
                label: `${ticker} Price`,
                data: sortedData.map(item => item.price),
                fill: false,
                backgroundColor: 'rgba(59, 130, 246, 0.2)',
                borderColor: 'rgba(59, 130, 246, 1)',
                borderWidth: 2,
                pointRadius: 3,
                pointBackgroundColor: 'rgba(59, 130, 246, 1)',
                pointBorderColor: '#fff',
                pointHoverRadius: 5,
                pointHoverBackgroundColor: 'rgba(59, 130, 246, 1)',
                pointHoverBorderColor: '#fff',
                tension: 0.2,
            },
        ],
    };

    // Chart options
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    font: {
                        family: 'Inter, system-ui, sans-serif',
                        size: 12,
                    },
                },
            },
            tooltip: {
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                titleColor: '#111827',
                bodyColor: '#374151',
                titleFont: {
                    family: 'Inter, system-ui, sans-serif',
                    size: 14,
                    weight: 'bold',
                },
                bodyFont: {
                    family: 'Inter, system-ui, sans-serif',
                    size: 12,
                },
                padding: 10,
                borderColor: 'rgba(229, 231, 235, 1)',
                borderWidth: 1,
                displayColors: false,
                callbacks: {
                    title: (tooltipItems) => {
                        const index = tooltipItems[0].dataIndex;
                        return format(parseISO(sortedData[index].lastUpdatedAt), 'MMM d, yyyy HH:mm:ss');
                    },
                    label: (context) => {
                        return `Price: $${context.raw.toFixed(2)}`;
                    },
                },
            },
        },
        scales: {
            x: {
                grid: {
                    color: 'rgba(229, 231, 235, 0.5)',
                },
                ticks: {
                    font: {
                        family: 'Inter, system-ui, sans-serif',
                        size: 10,
                    },
                    maxRotation: 45,
                    minRotation: 45,
                },
            },
            y: {
                grid: {
                    color: 'rgba(229, 231, 235, 0.5)',
                },
                ticks: {
                    font: {
                        family: 'Inter, system-ui, sans-serif',
                        size: 10,
                    },
                    callback: (value) => `$${value.toFixed(2)}`,
                },
            },
        },
        animation: {
            duration: 1000,
            easing: 'easeOutQuart',
        },
    };

    return (
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Price History Chart
            </h3>
            <div className="w-full h-64">
                <Line data={chartData} options={options} />
            </div>
        </div>
    );
};

export default PriceChart;