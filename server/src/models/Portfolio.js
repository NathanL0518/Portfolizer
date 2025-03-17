import mongoose from 'mongoose';

const portfolioSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' }, // Reference to the User
    name: { type: String, required: true }, // Portfolio name
    stocks: [{ 
        stockSymbol: { type: String, required: true }, // e.g., AAPL, TSLA
        quantity: { type: Number, required: true } // Number of shares
    }],
    createdAt: { type: Date, default: Date.now }
});

const Portfolio = mongoose.model('Portfolio', portfolioSchema);
export default Portfolio;