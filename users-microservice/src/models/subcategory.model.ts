import mongoose, { Document, Schema } from 'mongoose';

// SubCategory Interface
export interface ISubCategory extends Document {
    name: string;
    slug: string;
    description?: string;
    image?: string;
    category: mongoose.Types.ObjectId;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// SubCategory Schema
const SubCategorySchema: Schema = new Schema<ISubCategory>({
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, trim: true },
    image: { type: String, trim: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

export const SubCategory = mongoose.model<ISubCategory>('SubCategory', SubCategorySchema);
