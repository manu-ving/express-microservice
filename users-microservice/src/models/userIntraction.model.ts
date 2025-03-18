import mongoose, {Document, Schema} from 'mongoose';
import {v4 as uuidv4} from 'uuid';

export interface IUserInteraction extends Document {
    userId: mongoose.Types.ObjectId;
    productId: mongoose.Types.ObjectId;
    interactionType: 'VIEW' | 'CLICK' | 'WISHLIST' | 'PURCHASE' | 'RATING' | 'ABANDONMENT';
    rating?: number;
    duration?: number;
    source: 'WEB' | 'MOBILE' | 'API';
    deviceInfo?: {
        deviceType: string;
        os: string;
        browser?: string;
    };
    location?: {
        ip?: string;
        city?: string;
        country?: string;
    };
    referral?: string;
    sessionId?: string;
    sessionExpiry?: Date;
    metadata?: Record<string, any>;
    timestamp: Date;
}

const SESSION_DURATION_MINUTES = 30;

const UserInteractionSchema: Schema = new Schema({
    userId: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
    productId: { type: mongoose.Types.ObjectId, required: true, ref: 'Product' },
    interactionType: {
        type: String,
        enum: ['VIEW', 'CLICK', 'WISHLIST', 'PURCHASE', 'RATING', 'ABANDONMENT'],
        required: true,
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: function (this: IUserInteraction): boolean {
            return this.interactionType === 'RATING';
        },
    },
    duration: { type: Number },
    source: {
        type: String,
        enum: ['WEB', 'MOBILE', 'API'],
        required: true,
    },
    deviceInfo: {
        deviceType: { type: String },
        os: { type: String },
        browser: { type: String },
    },
    location: {
        ip: { type: String },
        city: { type: String },
        country: { type: String },
    },
    referral: { type: String },
    sessionId: {
        type: String,
        default: uuidv4,
    },
    sessionExpiry: {
        type: Date,
        default: () => new Date(Date.now() + SESSION_DURATION_MINUTES * 60 * 1000),
    },
    metadata: { type: Schema.Types.Mixed },
    timestamp: { type: Date, default: Date.now },
});

UserInteractionSchema.pre<IUserInteraction>('save', function (next) {
    if (!this.sessionId || new Date() > this.sessionExpiry!) {
        this.sessionId = uuidv4();
        this.sessionExpiry = new Date(Date.now() + SESSION_DURATION_MINUTES * 60 * 1000);
    }
    next();
});

export const UserInteraction = mongoose.model<IUserInteraction>('UserInteraction', UserInteractionSchema);
