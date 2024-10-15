const mongoose = require('mongoose');

const commentModelSchema = mongoose.Schema({
    comment : {
        type:String,
        required:true
    },
    blog: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'blog'   
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'signUp'   
    }
})

const commentModel = mongoose.model('comment',commentModelSchema);

module.exports = commentModel;