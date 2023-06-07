const Expense= require('../models/expense');

exports.postExpense=async(req,res,next)=>{
    try{
        const {amount,description,category}=req.body;
        const data=await Expense.create({
            amount:amount,
            description:description,
            category:category
        })
        console.log(data);
        return res.status(201).json({details:data}); 
        
    }
    catch(err){
        res.status(500).json(err);

    }

}

exports.getExpense=async(req,res,next)=>{
    try{
        const expense=await Expense.findAll();
        res.status(201).json({expense:expense});
    }
    catch(err){
        console.log(err);
    }
}

exports.deleteExpense=async(req,res,next)=>{
    try{
      if(req.params.id=='undefined'){
        console.log('ID is missing')
        return res.status(400).json({err:'Id is missing'})
      }
      const pId=req.params.id;
      await Expense.destroy({where:{id:pId}});
      res.sendStatus(200);
    }catch(err){
      console.log(err);
      res.status(500).json(err)
    }
  }