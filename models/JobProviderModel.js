const mongoose = require('mongoose');

const providerSchema = new mongoose.Schema({
  companyname: {type:String , required:true},
  email: { type: String, required:true, unique: true },
  phone: { type: Number, required:true, unique: true },
  hiring: {type:String, required:true},
  createdAt: { type: Date, default: Date.now() }
});

module.exports = mongoose.model('Job Provider', providerSchema);