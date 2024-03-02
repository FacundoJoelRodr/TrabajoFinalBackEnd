import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const productsOwner = new mongoose.Schema({
  email: { type: String, ref: 'User' },
});

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    code: { type: String, required: true, unique: true },
    stock: { type: Number, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    owner: { type: [productsOwner], default: 'ADMIN' },
  },
  { timestamps: true }
);

productSchema.plugin(mongoosePaginate);

export default mongoose.model('products', productSchema);