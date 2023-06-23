const express= require('express');

const router=express.Router();

const todosController=require('../controllers/todos');

router.post('/add-todos',todosController.postTodos);

router.get('/get-todos',todosController.getTodos);

router.get('/get-todosdone',todosController.getTodosDone);

router.post('/post-donetodo/:id',todosController.postTodosDone);

router.delete('/delete-todos/:id',todosController.deleteTodos);

module.exports=router;