const mongoose = require('mongoose');

const seekerSchema = new mongoose.Schema({
  fullname: {type:String , required:true},
  email: { type: String, required:true, unique: true },
  phone: { type: Number, required:true, unique: true },
  cv: {type:String , required:true},
  createdAt: { type: Date, default: Date.now() }
});

module.exports = mongoose.model('Job Seeker', seekerSchema);