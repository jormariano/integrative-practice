import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  name: {
    type: String,
    require: true,
  },
  lastname: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  age: {
    type: Number,
    require: true,
  },
  mail: {
    type: String,
    unique: true,
    index: true,
  },
  rol: {
    type: String,
    default: 'User',
  },
});

export const userModel = model('users', userSchema);
