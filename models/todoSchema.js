const mongoose = require('mongoose')

const todoSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    status: {
        type: String,
        enum: ['active', 'inactive']
    },
    date: {
        type: Date,
        default: Date.now
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
},
{
    timestamps: true,
})
// find with instant method
todoSchema.methods = {
    findActive: () => {
        return mongoose.model('Todo').find(({status: 'active'}))
    },
    findActiveCallback: (cb) => {
        return mongoose.model('Todo').find({status: 'active'}, cb)
    },
}

// find with static methods
todoSchema.statics = {
    findByJS: function () {
        return this.find({title: /js/i})
    }
}

// query helpers
todoSchema.query = {
    byLanguage: function (lang) {
        return this.find({title: new RegExp(lang, "i")})
    }
}

module.exports = todoSchema