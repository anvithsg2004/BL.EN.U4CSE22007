/**
 * @param {string} ticker
 * @param {number} minutes
 * @returns {Promise<Object>}
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
 * @param {string} ticker1
 * @param {string} ticker2
 * @param {number} minutes
 * @returns {Promise<Object>}
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
