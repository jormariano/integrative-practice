import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  name: String,
  lastname: String,
  password: String,
  age: Number,
  mail: {
    type: String,
    unique: true,
  },
});

export const userModel = model('users', userSchema);
