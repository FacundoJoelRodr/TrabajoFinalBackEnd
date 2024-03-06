
import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

/*const productsOwnerSchema = new mongoose.Schema({
  idOwner: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
});
*/
const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    code: { type: mongoose.Schema.Types.ObjectId, auto: true },
    stock: { type: Number, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    owner: { type: String, required: true}, 
  },
  { timestamps: true }
);

productSchema.plugin(mongoosePaginate);

export default mongoose.model('products', productSchema);