// const sequelize = require('../util/database');
const { NUMBER } = require('sequelize');
const Expense = require('../models/expense');
const User=require('../models/user');

exports.postExpense = async (req, res, next) => {
    try {
        // const user=req.user;
        const { amount, description, category } = req.body;
        console.log(req.user.id);
            const data = await Expense.create({
            amount: amount,
            description: description,
            category: category,
            userId: req.user.id,
        }).then(expense=>{
            const totalExpense=parseInt(req.user.totalExpenses)+parseInt(amount)
            console.log(totalExpense);
            User.update({
                totalExpenses:totalExpense
            },{
                where:{id:req.user.id}
            }).then(async()=>{
                // console.log(totalExpense);
                res.status(200).json({expense})
            })
            .catch(async(err)=>{
                console.log(err);
            })
        }).catch(async(err)=>{
            console.log(err);
        })
        // console.log(data);

        // return res.status(201).json({ details: data });

    }
    catch (err) {
        res.status(500).json(err);

    }

}

exports.getExpense = async (req, res, next) => {
    try {

        // const expense = await Expense.findAll({where:{userId:req.user.id}});
        const expense = await req.user.getExpenses();
        // const expense = await Expense.findAll({
        //     where: { userId: req.user.id }
        // })
        // console.log(expense)
        res.status(201).json({ expense: expense });
    }
    catch (err) {
        console.log(err);
    }
}

exports.deleteExpense = async (req, res, next) => {
    try {
        if (req.params.id == 'undefined') {
            console.log('ID is missing')
            return res.status(400).json({ err: 'Id is missing' })
        }
        const eId = req.params.id;
        const amount=await Expense.findOne({where:{id:eId}})
        await Expense.destroy({ where: { id: eId, userId: req.user.id } });
        const totalExpenses=parseInt(req.user.totalExpenses)-parseInt(amount.amount);
        await User.update({totalExpenses:totalExpenses},{where:{id:req.user.id}})
        res.sendStatus(200);
    } catch (err) {
        console.log(err);
        res.status(500).json(err)
    }
}