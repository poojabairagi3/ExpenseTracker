const sequelize = require('../util/database');
const Expense = require('../models/expense');
const User = require('../models/user');


exports.postExpense = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        // const user=req.user;
        const { amount, description, category } = req.body;
        console.log(req.user.id);
        const expense = await Expense.create({ amount: amount, description: description, category: category, userId: req.user.id }, { transaction: t });
        const totalExpense = parseInt(req.user.totalExpenses) + parseInt(amount);
        await User.update({ totalExpenses: totalExpense }, { where: { id: req.user.id }, transaction: t })
        await t.commit();
        res.status(200).json({ expense })
    }
    catch (err) {
        await t.rollback();
        console.log(err);
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
    const t = await sequelize.transaction();    
    try {
        if (req.params.id == 'undefined') {
            console.log('ID is missing')
            return res.status(400).json({ err: 'Id is missing' })
        }
        const eId = req.params.id;
        const amount = await Expense.findOne({ where: { id: eId } })
        const data=await Expense.destroy({ where: { id: eId, userId: req.user.id }, transaction: t });
        const totalExpenses = parseInt(req.user.totalExpenses) - parseInt(amount.amount);
        await User.update({ totalExpenses: totalExpenses }, { where: { id: req.user.id }, transaction: t })
        await t.commit();
        if(data===0){
            return res.status(400).json({message:"Expense does not belongs"})
        }
        res.sendStatus(200);
    } catch (err) {
        await t.rollback();
        console.log(err);
        res.status(500).json(err)
    }
}