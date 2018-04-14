import mongoose from 'mongoose';



const Schema = mongoose.Schema;




var servicesSchema = new Schema({
    serviceName: String,
    industryID:
      {type: Schema.Types.ObjectId, ref: 'user'}
    },
    {
    
    timestamps: true
});

module.exports = mongoose.model('services', servicesSchema);

