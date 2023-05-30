const User=require('../models/user');

exports.postUser=async(req,res,next)=>{
    try{
        if(!req.body.name || !req.body.email || !req.body.password  
          ){
            
          return res.status(400).json({err:"Bad parameters - Something is missing"})
        }
        

    const name=req.body.name;
    const email =req.body.email;
    // const  emailExist= req.params.email;
    const emailExist =await User.findOne({where:{email:email}});
    if(emailExist){
      return res.status(401).json({err:"Email Already Exist "});      
    }
    else{
      const password=req.body.password;
      const data=await User.create({
        name:name,
        email:email,
        password:password
      });
      console.log(data);
       res.status(201).json({message:'Successfully create new user'});  
}   
    }
    catch(err){
        res.status(500).json(err);
    };
  }
  