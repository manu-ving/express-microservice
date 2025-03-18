import mongoose, { Document, Schema } from 'mongoose';

// Variant Interface
interface IVariant {
    name: string;
    price: number;
    stock: number;
    sku: string;
    images?: string[];
}

// Rating Distribution Interface
interface IRatingDistribution {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
}

// Stock History Interface
interface IStockHistory {
    date: Date;
    change: number;
    reason: string;
}

// Dimensions Interface
interface IDimensions {
    length: number;
    width: number;
    height: number;
}

// User Roles
export type isMainlyFocused = "MEN" | "WOMEN" | "BOTH" | "BOY" | "GIRL" | "BABY" | "ALL";

// Product Interface
export interface IProduct extends Document {
    name: string;
    description?: string;
    price: number;
    discount?: number;
    focusedCustomer: isMainlyFocused;
    currency: string;
    stock: number;
    incomingStock?: number;
    reservedStock?: number;
    restockDate?: Date;
    sku: string;
    category: mongoose.Types.ObjectId;
    brand?: string;
    tags?: string[];
    images: string[];
    videos?: string[];
    variants?: IVariant[];
    isFeatured?: boolean;
    isAvailable?: boolean;
    views: number;
    clicks: number;
    wishlistCount: number;
    totalSales: number;
    totalRevenue: number;
    averageRating?: number;
    ratingDistribution: IRatingDistribution;
    totalReviews?: number;
    lowStockThreshold?: number;
    stockHistory?: IStockHistory[];
    platformCommissionPercentage?: number;
    sellingPrice: number;
    sellerId: mongoose.Types.ObjectId;
    sellerName?: string;
    isVerifiedSeller?: boolean;
    commissionType?: 'percentage' | 'fixed';
    discountStartDate?: Date;
    discountEndDate?: Date;
    specialOfferPrice?: number;
    priceHistory?: { price: number; date: Date }[];
    seoTitle?: string;
    seoDescription?: string;
    slug: string;
    launchDate?: Date;
    expiryDate?: Date;
    isDiscontinued?: boolean;
    conversionRate?: number;
    abandonmentRate?: number;
    lastPurchasedAt?: Date;
    likesCount?: number;
    sharesCount?: number;
    lastViewedAt?: Date;
    hsnCode?: string;
    gstPercentage?: number;
    isTaxable?: boolean;
    weight?: number;
    dimensions?: IDimensions;
    shippingClass?: string;
    isFreeShipping?: boolean;
    customAttributes?: Record<string, string>;
    languages?: string[];
    localizedDescriptions?: Record<string, string>;
    createdAt?: Date;
    updatedAt?: Date;
}

const DEFAULT_COMMISSION_PERCENTAGE = 10;

const productSchema = new Schema<IProduct>({
    name: {type: String, required: true, trim: true},
    description: {type: String, trim: true},
    price: {type: Number, required: true},
    discount: {type: Number, default: 0},
    focusedCustomer: {
        type: String,
        enum: ["MEN", "WOMEN", "BOTH", "BOY", "GIRL", "BABY", "ALL"],
        default: "ALL",
    },
    currency: {type: String, default: 'INR'},
    stock: {type: Number, required: true, min: 0},
    incomingStock: Number,
    reservedStock: Number,
    restockDate: Date,
    sku: {type: String, unique: true, required: true},
    category: {type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true},
    brand: String,
    tags: [String],
    images: [String],
    videos: [String],
    variants: [{
        name: String,
        price: Number,
        stock: Number,
        sku: String,
        images: [String],
    }],
    isFeatured: {type: Boolean, default: false},
    isAvailable: {type: Boolean, default: true},
    views: {type: Number, default: 0},
    clicks: {type: Number, default: 0},
    wishlistCount: {type: Number, default: 0},
    totalSales: {type: Number, default: 0},
    totalRevenue: {type: Number, default: 0},
    averageRating: {type: Number, min: 0, max: 5},
    ratingDistribution: {
        1: {type: Number, default: 0},
        2: {type: Number, default: 0},
        3: {type: Number, default: 0},
        4: {type: Number, default: 0},
        5: {type: Number, default: 0},
    },
    totalReviews: Number,
    lowStockThreshold: {type: Number, default: 5},
    stockHistory: [{date: Date, change: Number, reason: String}],
    platformCommissionPercentage: {type: Number, default: DEFAULT_COMMISSION_PERCENTAGE},
    sellingPrice: {type: Number, required: true},
    sellerId: {type: mongoose.Schema.Types.ObjectId, ref: 'Seller'},
    sellerName: String,
    isVerifiedSeller: Boolean,
    commissionType: {type: String, enum: ['percentage', 'fixed'], default: 'percentage'},
    discountStartDate: Date,
    discountEndDate: Date,
    specialOfferPrice: Number,
    priceHistory: [{price: Number, date: Date}],
    seoTitle: String,
    seoDescription: String,
    slug: {type: String, unique: true},
    launchDate: Date,
    expiryDate: Date,
    isDiscontinued: Boolean,
    conversionRate: Number,
    abandonmentRate: Number,
    lastPurchasedAt: Date,
    likesCount: {type: Number, default: 0},
    sharesCount: {type: Number, default: 0},
    lastViewedAt: Date,
    hsnCode: String,
    gstPercentage: Number,
    isTaxable: Boolean,
    weight: Number,
    dimensions: {
        length: Number,
        width: Number,
        height: Number,
    },
    shippingClass: String,
    isFreeShipping: Boolean,
    customAttributes: Schema.Types.Mixed,
    languages: [String],
    localizedDescriptions: Schema.Types.Mixed,
}, {timestamps: true});

productSchema.pre<IProduct>('save', function (next) {
    const commission = this.platformCommissionPercentage || DEFAULT_COMMISSION_PERCENTAGE;
    this.sellingPrice = this.price - (this.price * commission) / 100;
    next();
});

export const Product = mongoose.model<IProduct>('Product', productSchema);
