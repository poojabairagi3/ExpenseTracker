const Expense = require('../models/expense');

exports.postExpense = async (req, res, next) => {
    try {
        const { amount, description, category } = req.body;
        console.log(req.user.id);
        const data = await Expense.create({
            amount: amount,
            description: description,
            category: category,
            userId: req.user.id,
        })
        console.log(data);
        return res.status(201).json({ details: data });

    }
    catch (err) {
        res.status(500).json(err);

    }

}

exports.getExpense = async (req, res, next) => {
    try {
        // console.log(user.id)
        // const expense = await Expense.findAll({where:{userId:req.user.id}});
        // const expense=await req.user.getExpenses();
        const expense = await Expense.findAll({
            where: { userId: req.user.id }
        })
        console.log(expense)
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
        await Expense.destroy({ where: { id: eId, userId: req.user.id } });
        res.sendStatus(200);
    } catch (err) {
        console.log(err);
        res.status(500).json(err)
    }
}