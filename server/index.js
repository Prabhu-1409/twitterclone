const express = require('express')
const port = process.env.PORT || 3001
const mongoose = require('mongoose')
const cors = require('cors')
const {model,post_model,feedback_model} = require('./model')

mongoose.connect("mongodb+srv://prabhu_m_s:T5eDLySw52GhH6yW@prabhucluster.67len0n.mongodb.net/?DbName=mobileapp&retryWrites=true&w=majority&appName=prabhucluster/mobileapp").then(()=>{
    console.log("connected")
}).catch((err)=>{
    console.log(err)
})
const app = express()
app.use(cors({
    origin:"http://localhost:8081",
    methods:["POST","GET"]
}))
app.use(express.json())

app.get("/",(req,res)=>{
    res.send("Hello")
})

app.post("/signup", async(req,res)=>{
    const data = req.body
    try{
        const found = await model.find({
            "email":data.email
        })
        //console.log(found)
        if(found!=""){
           res.json({
            status:302,
            message:"User Found"
           })
        }else{
            await model.create({
                "name":data.name,
                "email":data.email,
                "password":data.password
            }).then(()=>{
                res.json({
                    status:200,
                    message:"User Created Successfully"
                })
            })
        }
    }catch(err){
        console.log(err)
    }
    //console.log(data)
})

app.post("/login",async(req,res)=>{
    try{
        const data = await req.body
        const found = await model.find({
            "email":data.email
        })
        // console.log(data.password+" "+found[0].password)
        // console.log(found)
        if(found!=""){
            if(found[0].password!=data.password){
                res.json({
                    status:401,
                    message:"Password is incorrect"
                })
            }else{
                res.json({
                    status:302,
                    message:found[0]
                })
            }
        }else{
            res.json({
                status:404,
                message:"User Not Found, Please Signup"
            })
        }
    }catch(err){
        console.log(err)
    }
})

app.get("/post", async(req,res)=>{
    try{
        const post_data = await post_model.find()
        res.json({
            message:post_data
        })
        //console.log(post_data)
    }catch(err){
        console.log(err)
    }
})

app.put("/comments",async (req,res)=>{
    try{
        const data = req.body
        //console.log(data)
        const objectid = new mongoose.Types.ObjectId(req.body.postid)
        //console.log(objectid)
        await post_model.updateOne({
            _id:objectid
        },{
            $push:{
                comments:{
                    name:req.body.username,
                    text:req.body.comment
                }
            }
        })
    }catch(err){
        console.log(err)
    }
})

app.post("/commentslikes", async(req,res)=>{
    const objectid = new mongoose.Types.ObjectId(req.body.id)
    try{
        await post_model.find({
            "_id":objectid
        }).then((data)=>{
            res.json({
                message:data
            })
        })
        // res.json({
        //     message:post_data
        // })
        //console.log(post_data)
    }catch(err){
        console.log(err)
    }
})

app.put("/likeupdate",async(req,res)=>{
    const data = req.body
    try{
        const objectid = new mongoose.Types.ObjectId(data.postid)
        // if(data.active==true){
        //     await post_model.updateOne({
        //         _id:objectid
        //     },{
        //         $push:{
        //             likes:data.userid
        //         }
        //     })
        // }else{
        //     await post_model.updateOne({
        //         _id:objectid
        //     },{
        //         $pull:{
        //             likes:data.userid
        //         }
        //     })
        // }
        const found = await post_model.findOne({
            _id:objectid,
            likes:{
                $in:[data.userid]
            }
        })
        if(found!=null){
           const updated  = await post_model.findOneAndUpdate({
                        _id:objectid
                    },{
                        $pull:{
                            likes:data.userid
                        }
                    },{new:true})
                    //console.log(updated)
                    res.json({
                        message:updated
                    })
        }else{
           const updated =  await post_model.findOneAndUpdate({
                        _id:objectid
                    },{
                        $push:{
                            likes:data.userid
                        }
                    },{new:true})
                     
                    res.json({
                        message:updated
                    })
        }
        //console.log(found)
        // await post_model.find({
        //     _id:objectid
        // }).then((data)=>{
        //     res.json({
        //         message:data
        //     })
        // })
        
    }catch(err){
        console.log(err)
    }
})


app.post("/singlepost",async(req,res)=>{
    const data = req.body
    const objectid = new mongoose.Types.ObjectId(req.body.id)
    try{
        await post_model.find({
            "_id":objectid
        }).then((data)=>{
            res.json({
                message:data
            })
        })
        // res.json({
        //     message:post_data
        // })
        //console.log(post_data)
    }catch(err){
        console.log(err)
    }
})
// app.put("/likedelete",async(req,res)=>{
//     const data = req.body
//     try{
//         const objectid = new mongoose.Types.ObjectId(data.postid)
        
//     }catch(err){
//         console.log(err)
//     }
// })

app.get("/likes",async(req,res)=>{
    try{
        const post_data = await post_model.find()
        res.json({
            message:post_data
        })
        //console.log(post_data)
    }catch(err){
        console.log(err)
    }
})

app.post('/feedback', async(req,res)=>{
    const data = req.body
    try{
        await feedback_model.create({
            "username":data.username,
            "improvement":data.improvement,
            "suggestions":data.suggestion
        }).then(()=>{
            res.json({
                message:"Submitted"
            })
        })
    }catch(err){
        console.log(err)
    }
})

app.put('/saved',async (req,res)=>{
    const data = req.body
    try{
        const objectid = new mongoose.Types.ObjectId(data.postid)
        const found = await post_model.findOne({
            _id:objectid,
            saved:{
                $in:[data.userid]
            }
        })
        if(found!=null){
           const updated  = await post_model.findOneAndUpdate({
                        _id:objectid
                    },{
                        $pull:{
                            saved:data.userid
                        }
                    },{new:true})
                    //console.log(updated)
                    res.json({
                        message:updated
                    })
        }else{
           const updated =  await post_model.findOneAndUpdate({
                        _id:objectid
                    },{
                        $push:{
                            saved:data.userid
                        }
                    },{new:true})
                     
                    res.json({
                        message:updated
                    })
        }
       
        
    }catch(err){
        console.log(err)
    }
})

app.listen(port,(req,res)=>{
    console.log("Listening")
})