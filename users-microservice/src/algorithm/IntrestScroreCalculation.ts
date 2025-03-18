import mongoose from 'mongoose';
import { Product } from '../models/Product.model';
import { UserInteraction } from '../models/userIntraction.model'; // Assuming a separate model for user interactions

// Define weights
const WEIGHTS = {
    VIEW: 1,
    CLICK: 2,
    WISHLIST: 5,
    PURCHASE: 10,
    RATING_MULTIPLIER: 2,
    ABANDONMENT_PENALTY: -3,
};

// Compute interest score
const computeInterestScore = (product: any) => {
    const { views, clicks, wishlistCount, totalSales, averageRating, abandonmentRate } = product;

    return (
        views * WEIGHTS.VIEW +
        clicks * WEIGHTS.CLICK +
        wishlistCount * WEIGHTS.WISHLIST +
        totalSales * WEIGHTS.PURCHASE +
        (averageRating ? averageRating * WEIGHTS.RATING_MULTIPLIER : 0) +
        (abandonmentRate ? abandonmentRate * WEIGHTS.ABANDONMENT_PENALTY : 0)
    );
};

// Get user's top interests
const getUserTopInterests = async (userId: mongoose.Types.ObjectId) => {
    const interactions = await UserInteraction.find({ userId }).sort({ lastInteractedAt: -1 }).limit(50);

    const productIds = interactions.map((interaction) => interaction.productId);
    const products = await Product.find({ _id: { $in: productIds } });

    const interestScores = products.map(product => ({
        product,
        score: computeInterestScore(product),
    }));

    interestScores.sort((a, b) => b.score - a.score);

    const topCategories = new Map();
    const topBrands = new Map();

    interestScores.forEach(({ product }) => {
        if (product.category) {
            topCategories.set(product.category.toString(), (topCategories.get(product.category.toString()) || 0) + 1);
        }
        if (product.brand) {
            topBrands.set(product.brand, (topBrands.get(product.brand) || 0) + 1);
        }
    });

    return {
        topCategories: Array.from(topCategories.keys()).slice(0, 3),
        topBrands: Array.from(topBrands.keys()).slice(0, 3),
        interactedProductIds: productIds,
    };
};

// Recommend products
export const recommendProducts = async (userId: mongoose.Types.ObjectId) => {
    const { topCategories, topBrands, interactedProductIds } = await getUserTopInterests(userId);

    return Product.find({
        $or: [
            { category: { $in: topCategories } },
            { brand: { $in: topBrands } },
        ],
        _id: { $nin: interactedProductIds },
    })
        .sort({ views: -1, totalSales: -1 })
        .limit(10);
};

