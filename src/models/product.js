import { Schema, model } from 'mongoose';

const productSchema = new Schema({
  title: {
    type: String,
    require: true,
    index: true,
  },
  description: {
    type: String,
    require: true,
  },
  price: {
    type: Number,
    require: true,
  },
  stock: {
    type: Number,
    require: true,
  },
  code: {
    type: String,
    require: true,
    unique: true,
  },
  thumbnail: {
    default: [],
  },
});

const productModel = model('products', productSchema);

export default productModel;
