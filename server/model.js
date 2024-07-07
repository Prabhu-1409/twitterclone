const mongoose = require('mongoose')


const schema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    saved:Array
})

const commentschema = new mongoose.Schema({
    name:String,
    text:String
})

const postschema = new mongoose.Schema({
    profilename:String,
    profileabout:String,
    image:String,
    comments:Array,
    hashtag:String,
    date:Date,
    likes:Array,
    profilepic:String,
    type:String,
    saved:Array
})

const feedbackschema = new mongoose.Schema({
    username:String,
    improvement:String,
    suggestions:String
})


const model = new mongoose.model('signups',schema)
const post_model = new mongoose.model('posts',postschema)
const feedback_model = new mongoose.model('feedbacks',feedbackschema)


module.exports = {model,post_model,feedback_model}

