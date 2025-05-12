/**
 * Fetches stock data for a single ticker
 * @param {string} ticker - Stock ticker symbol
 * @param {number} minutes - Time window in minutes
 * @returns {Promise<Object>} - Stock data including average price and history
 */
export const fetchStockData = async (ticker, minutes) => {
    if (!ticker || !minutes) {
        throw new Error('Ticker and minutes are required');
    }

    try {
        const response = await fetch(
            `http://localhost:8080/stocks/${ticker}?minutes=${minutes}&aggregation=average`
        );

        if (!response.ok) {
            throw new Error(`Failed to fetch stock data: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching stock data:', error);
        throw error;
    }
};

/**
 * Fetches correlation data between two stocks
 * @param {string} ticker1 - First stock ticker symbol
 * @param {string} ticker2 - Second stock ticker symbol
 * @param {number} minutes - Time window in minutes
 * @returns {Promise<Object>} - Correlation data and stock information
 */
export const fetchCorrelationData = async (ticker1, ticker2, minutes) => {
    if (!ticker1 || !ticker2 || !minutes) {
        throw new Error('Both tickers and minutes are required');
    }

    try {
        const response = await fetch(
            `http://localhost:8080/stockcorrelation?minutes=${minutes}&ticker=${ticker1}&ticker=${ticker2}`
        );

        if (!response.ok) {
            throw new Error(`Failed to fetch correlation data: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching correlation data:', error);
        throw error;
    }
};
