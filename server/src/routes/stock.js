import express from 'express';
import yahooFinance from 'yahoo-finance2';

const router = express.Router();

// Get stock information
router.get('/price/:symbol', async (req, res) => {
    const { symbol } = req.params;
    console.log("Fetching stock price for symbol:", symbol);
    
    try {
        const price = await yahooFinance.quote(symbol).then((result) => result.regularMarketPrice);
        console.log("Fetched stock price:", price);
        res.status(200).json(price);
    } catch (error) {
        console.error('Error fetching stock price:', error);
        res.status(500).json({ message: 'Failed to fetch stock price' });
    }
});

// Get historical stock data
router.get('/history/:symbol', async (req, res) => {
    const { symbol } = req.params;
    const { period1, period2, interval } = req.query; // Optional query parameters
    console.log(symbol, period1, period2, interval);

    try {
        const queryOptions = {
            period1, // Start date (e.g., '2023-01-01')
            period2, // End date (e.g., '2023-12-31')
            interval // Interval (e.g., '1d' for daily)
        };

        const result = await yahooFinance.historical(symbol, queryOptions);
        console.log(result);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error fetching historical data:', error);
        res.status(500).json({ message: 'Error fetching historical data' });
    }
});

export default router;
