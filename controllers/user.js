const User=require('../models/user');

exports.postUser=async(req,res,next)=>{
    try{
    const name=req.body.name;
    const email =req.body.email;
    const password=req.body.password;
    const data=await User.create({
      name:name,
      email:email,
      password:password
    });
    console.log(data);
     res.status(201).json({newProductDetails:data});   
    }
    catch(err){
        res.status(500).json({
          error:err
        });
    };
  }
  