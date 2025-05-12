import React, { useState, useEffect } from 'react';
import { fetchStockData } from '../../api/stockApi';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Table from '../ui/Table';
import Alert from '../ui/Alert';
import LoadingSpinner from '../ui/LoadingSpinner';
import PriceChart from './PriceChart';

const POPULAR_TICKERS = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'META'];

const SingleTickerView = () => {
    const [ticker, setTicker] = useState('');
    const [minutes, setMinutes] = useState(60);
    const [stockData, setStockData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

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

        if (!ticker) {
            setError('Please enter a ticker symbol');
            return;
        }

        if (!minutes || minutes < 1) {
            setError('Please enter a valid time window');
            return;
        }

        setError('');
        setLoading(true);

        try {
            const data = await fetchStockData(ticker.toUpperCase(), minutes);
            setStockData(data);
            setError('');
        } catch (err) {
            setError(err.message || 'Failed to fetch stock data. Please try again.');
            setStockData(null);
        } finally {
            setLoading(false);
        }
    };

    const handleQuickSelect = (selectedTicker) => {
        setTicker(selectedTicker);
        if (minutes) {
            setError('');
            setLoading(true);

            fetchStockData(selectedTicker, minutes)
                .then(data => {
                    setStockData(data);
                    setError('');
                })
                .catch(err => {
                    setError(err.message || 'Failed to fetch stock data');
                    setStockData(null);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    };

    return (
        <div className="card animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Single Ticker Analysis</h2>

            <div className="mb-6">
                <div className="flex flex-wrap gap-2 mb-4">
                    <p className="text-sm text-gray-600 mr-2">Popular tickers:</p>
                    {POPULAR_TICKERS.map(popularTicker => (
                        <button
                            key={popularTicker}
                            onClick={() => handleQuickSelect(popularTicker)}
                            className={`px-2 py-1 text-xs rounded ${ticker === popularTicker
                                ? 'bg-primary-100 text-primary-800 font-medium'
                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                }`}
                        >
                            {popularTicker}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                        <Input
                            label="Ticker Symbol"
                            id="ticker"
                            placeholder="e.g., NVDA"
                            value={ticker}
                            onChange={(e) => setTicker(e.target.value.toUpperCase())}
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
                    Get Stock Data
                </Button>
            </div>

            {error && <Alert type="error" message={error} />}

            {loading && (
                <div className="flex justify-center items-center py-12">
                    <LoadingSpinner size="lg" />
                </div>
            )}

            {stockData && !loading && (
                <div className="space-y-6 animate-fade-in">
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex flex-wrap items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">{ticker}</h3>
                                <p className="text-sm text-gray-600">
                                    Data for the last {minutes} {minutes === 1 ? 'minute' : 'minutes'}
                                </p>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-bold text-gray-900">
                                    ${stockData.averageStockPrice.toFixed(2)}
                                </div>
                                <p className="text-sm text-gray-600">Average Price</p>
                            </div>
                        </div>
                    </div>

                    {stockData.priceHistory && stockData.priceHistory.length > 0 && (
                        <>
                            <PriceChart
                                data={stockData.priceHistory}
                                ticker={ticker}
                            />

                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-3">Price History</h3>
                                <Table
                                    data={stockData.priceHistory}
                                    columns={columns}
                                    emptyMessage="No price history available"
                                />
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default SingleTickerView;