const Todos=require('../models/todos');

exports.postTodos=async(req,res,next)=>{
    try{
    const todos=req.body.todos;
    const description =req.body.description;
    const data=await Todos.create({
      todos:todos,
      description:description,
      isdone:false
    });
    console.log(data);
     res.status(201).json({newTodosDetails:data});   
    }
    catch(err){
        res.status(500).json({
          error:err
        });
    };
  }
exports.getTodos=async(req,res,next)=>{
    try{
      const todos=await Todos.findAll({where:{isdone:false}});
      res.status(200).json({allTodos:todos});
    }
    catch(err){
      console.log('Get Todos is Failing',JSON.stringify(error))
      res.status(500).json({
        error:err
      })
    }
  }

exports.getTodosDone=async(req,res,next)=>{
    try{
    const todos=await Todos.findAll({where:{isdone:true}});
    console.log(todos);
      res.status(200).json({allTodos:todos});
    }
    catch(err){
        console.log(err);
    }
}

exports.postTodosDone=async(req,res,next)=>{
  try{
    const id= req.params.id;
    const todo =await Todos.findOne({where:{id:id}});
    todo.isdone=true;
    todo.save();
    res.status(200).json({todo:todo});
    
  }
  catch(err){
    console.log(err);
  }
}

exports.deleteTodos=async(req,res,next)=>{
    try{
      if(req.params.id=='undefined'){
        console.log('ID is missing')
        return res.status(400).json({err:'Id is missing'})
      }
      const tId=req.params.id;
      await Todos.destroy({where:{id:tId}});
      res.sendStatus(200);
    }catch(err){
      console.log(err);
      res.status(500).json(err)
    }
  }