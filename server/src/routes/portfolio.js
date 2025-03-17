import express from 'express';
import Portfolio from '../models/Portfolio.js';
import { authenticateToken } from '../middleware/authenticateToken.js';

const router = express.Router();

// Create a new portfolio
router.post('/portfolio/create', authenticateToken, async (req, res) => {
    try {
        const { name } = req.body;
        const userId = req.user.id; // Get user ID from the authenticated token

        // Create the new portfolio
        const portfolio = new Portfolio({
            userId,
            name,
            stocks: [] // Initialize with an empty array of stocks
        });

        // Save the portfolio
        await portfolio.save();

        res.status(201).json({
            message: 'Portfolio created successfully',
            portfolio
        });
    } catch (error) {
        console.error('Error creating portfolio:', error);
        res.status(500).json({ message: 'Error creating portfolio' });
    }
});

// Get user's portfolios
router.get('/portfolio', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id; // Get user ID from the authenticated token
        const portfolios = await Portfolio.find({ userId });

        res.status(200).json(portfolios);
    } catch (error) {
        console.error('Error fetching portfolios:', error);
        res.status(500).json({ message: 'Error fetching portfolios' });
    }
});

// Other routes (update, delete, add stocks) can be added similarly

export default router;