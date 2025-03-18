import mongoose, { Document, Schema } from 'mongoose';

// Category Interface
export interface ICategory extends Document {
    name: string;
    slug: string;
    description?: string;
    image?: string;
    isActive: boolean;
    subCategories: mongoose.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

const CategorySchema: Schema = new Schema<ICategory>({
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, trim: true },
    image: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
    subCategories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SubCategory' }],
}, { timestamps: true });

export const Category = mongoose.model<ICategory>('Category', CategorySchema);
