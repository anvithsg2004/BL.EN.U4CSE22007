import React, { useState } from 'react';
import { fetchCorrelationData } from '../../api/stockApi';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Table from '../ui/Table';
import Alert from '../ui/Alert';
import LoadingSpinner from '../ui/LoadingSpinner';
import PriceChart from './PriceChart';

const POPULAR_PAIRS = [
    { ticker1: 'AAPL', ticker2: 'MSFT' },
    { ticker1: 'NVDA', ticker2: 'AMD' },
    { ticker1: 'GOOGL', ticker2: 'META' },
    { ticker1: 'AMZN', ticker2: 'PYPL' },
];

const CorrelationView = () => {
    const [ticker1, setTicker1] = useState('');
    const [ticker2, setTicker2] = useState('');
    const [minutes, setMinutes] = useState(60);
    const [correlationData, setCorrelationData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('');

    const columns = [
        { header: 'Ticker', accessor: 'ticker', sortable: true },
        {
            header: 'Price ($)',
            accessor: 'price',
            sortable: true,
            type: 'number',
            decimals: 2,
            className: 'text-right font-medium'
        },
        {
            header: 'Last Updated',
            accessor: 'lastUpdatedAt',
            sortable: true,
            type: 'date',
            format: 'MMM d, yyyy h:mm:ss a'
        },
        {
            header: 'Expires At',
            accessor: 'expiresAt',
            sortable: true,
            type: 'date',
            format: 'MMM d, yyyy h:mm:ss a'
        }
    ];

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();

        if (!ticker1 || !ticker2) {
            setError('Please enter both ticker symbols');
            return;
        }

        if (ticker1 === ticker2) {
            setError('Please enter different ticker symbols');
            return;
        }

        if (!minutes || minutes < 1) {
            setError('Please enter a valid time window');
            return;
        }

        setError('');
        setLoading(true);

        try {
            const data = await fetchCorrelationData(
                ticker1.toUpperCase(),
                ticker2.toUpperCase(),
                minutes
            );
            setCorrelationData(data);
            setActiveTab(ticker1.toUpperCase());
            setError('');
        } catch (err) {
            setError(err.message || 'Failed to fetch correlation data');
            setCorrelationData(null);
        } finally {
            setLoading(false);
        }
    };

    const handleQuickSelect = (pair) => {
        setTicker1(pair.ticker1);
        setTicker2(pair.ticker2);

        if (minutes) {
            setError('');
            setLoading(true);

            fetchCorrelationData(pair.ticker1, pair.ticker2, minutes)
                .then(data => {
                    setCorrelationData(data);
                    setActiveTab(pair.ticker1);
                    setError('');
                })
                .catch(err => {
                    setError(err.message || 'Failed to fetch correlation data');
                    setCorrelationData(null);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    };

    const interpretCorrelation = (correlation) => {
        if (correlation >= 0.7) return 'Strong positive correlation';
        if (correlation >= 0.4) return 'Moderate positive correlation';
        if (correlation >= 0.1) return 'Weak positive correlation';
        if (correlation > -0.1) return 'No correlation';
        if (correlation > -0.4) return 'Weak negative correlation';
        if (correlation > -0.7) return 'Moderate negative correlation';
        return 'Strong negative correlation';
    };

    const getCorrelationColor = (correlation) => {
        if (correlation >= 0.7) return 'text-success-700';
        if (correlation >= 0.4) return 'text-success-600';
        if (correlation >= 0.1) return 'text-success-500';
        if (correlation > -0.1) return 'text-gray-600';
        if (correlation > -0.4) return 'text-error-500';
        if (correlation > -0.7) return 'text-error-600';
        return 'text-error-700';
    };

    return (
        <div className="card animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Stock Correlation Analysis</h2>

            <div className="mb-6">
                <div className="flex flex-wrap gap-2 mb-4">
                    <p className="text-sm text-gray-600 mr-2">Popular pairs:</p>
                    {POPULAR_PAIRS.map((pair, index) => (
                        <button
                            key={index}
                            onClick={() => handleQuickSelect(pair)}
                            className={`px-2 py-1 text-xs rounded ${ticker1 === pair.ticker1 && ticker2 === pair.ticker2
                                ? 'bg-primary-100 text-primary-800 font-medium'
                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                }`}
                        >
                            {pair.ticker1} / {pair.ticker2}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <Input
                            label="First Ticker"
                            id="ticker1"
                            placeholder="e.g., NVDA"
                            value={ticker1}
                            onChange={(e) => setTicker1(e.target.value.toUpperCase())}
                        />
                    </div>
                    <div>
                        <Input
                            label="Second Ticker"
                            id="ticker2"
                            placeholder="e.g., PYPL"
                            value={ticker2}
                            onChange={(e) => setTicker2(e.target.value.toUpperCase())}
                        />
                    </div>
                    <div>
                        <Input
                            label="Time Window (minutes)"
                            id="minutes"
                            type="number"
                            placeholder="e.g., 60"
                            value={minutes}
                            onChange={(e) => setMinutes(parseInt(e.target.value) || '')}
                            min="1"
                        />
                    </div>
                </div>

                <Button
                    onClick={handleSubmit}
                    isLoading={loading}
                    className="mt-2"
                >
                    Analyze Correlation
                </Button>
            </div>

            {error && <Alert type="error" message={error} />}

            {loading && (
                <div className="flex justify-center items-center py-12">
                    <LoadingSpinner size="lg" />
                </div>
            )}

            {correlationData && !loading && (
                <div className="space-y-6 animate-fade-in">
                    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                        <div className="mb-4 text-center">
                            <h3 className="text-xl font-bold text-gray-800 mb-2">
                                Correlation: {ticker1} vs {ticker2}
                            </h3>
                            <div className={`text-4xl font-bold ${getCorrelationColor(correlationData.correlation)}`}>
                                {correlationData.correlation.toFixed(3)}
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                                {interpretCorrelation(correlationData.correlation)}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            {Object.keys(correlationData.stocks).map(ticker => {
                                const stockData = correlationData.stocks[ticker];
                                return (
                                    <div key={ticker} className="bg-white rounded-md p-4 shadow-sm">
                                        <h4 className="text-lg font-semibold text-gray-800">{ticker}</h4>
                                        <div className="text-2xl font-bold text-gray-900 mt-1">
                                            ${stockData.averagePrice.toFixed(2)}
                                        </div>
                                        <p className="text-sm text-gray-600">Average Price</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div>
                        <div className="border-b border-gray-200">
                            <nav className="-mb-px flex space-x-4">
                                {Object.keys(correlationData.stocks).map((ticker) => (
                                    <button
                                        key={ticker}
                                        onClick={() => setActiveTab(ticker)}
                                        className={`py-2 px-3 text-sm font-medium ${activeTab === ticker
                                            ? 'border-b-2 border-primary-600 text-primary-700'
                                            : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            }`}
                                    >
                                        {ticker}
                                    </button>
                                ))}
                            </nav>
                        </div>

                        {Object.keys(correlationData.stocks).map((ticker) => {
                            const stockData = correlationData.stocks[ticker];
                            return activeTab === ticker ? (
                                <div key={ticker} className="mt-4 animate-fade-in">
                                    <PriceChart
                                        data={stockData.priceHistory}
                                        ticker={ticker}
                                    />

                                    <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">
                                        {ticker} Price History
                                    </h3>
                                    <Table
                                        data={stockData.priceHistory}
                                        columns={columns}
                                        emptyMessage={`No price history available for ${ticker}`}
                                    />
                                </div>
                            ) : null;
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CorrelationView;