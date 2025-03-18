import { Document, Schema, model } from 'mongoose';

export interface ISwipeImage extends Document {
    imageUrl: string;
    categories: string[]; // Categories where this image should appear
    isAd: boolean;        // Flag to indicate if the image is an advertisement
    isVisible: boolean;   // Flag to control visibility
    createdAt: Date;
    updatedAt: Date;
}

const SwipeImageSchema = new Schema<ISwipeImage>(
    {
        imageUrl: { type: String, required: true },
        categories: { type: [String], required: true }, // E.g., ["fashion", "electronics"]
        isAd: { type: Boolean, default: false },
        isVisible: { type: Boolean, default: true },     // Easily control visibility
    },
    {
        timestamps: true, // Automatically manage createdAt and updatedAt
    }
);

export const SwipeImage = model<ISwipeImage>('SwipeImage', SwipeImageSchema);
