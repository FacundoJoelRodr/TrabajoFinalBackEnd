import mongoose from 'mongoose';

const productsCarts = new mongoose.Schema({
  _id: false,
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'products' },
  quantity: { type: Number },
});

const cartSchema = new mongoose.Schema(
  {
    products: { type: [productsCarts], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model('carts', cartSchema);
