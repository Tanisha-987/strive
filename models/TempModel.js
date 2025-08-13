const mongoose = require('mongoose');

const tempSchema = new mongoose.Schema({
  fullname: {type:String },
  companyname: {type:String} , 
  email: { type: String, unique: true },
  phone: { type: Number, unique: true },
  role: { type: String, enum: ['seeker','provider'], default: 'seeker' }, 
  hiring:{type:String},
  cv: {type:String},
  createdAt: { type: Date, default: Date.now() }
});

module.exports = mongoose.model('Temporary Users', tempSchema);