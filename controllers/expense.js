const Expense = require('../models/expense');

exports.postExpense = async (req, res, next) => {
    try {
        const { amount, description, category } = req.body;
        console.log(req.user.id);
        if(amount==undefined || amount.length===0){
            return res.status(400).json({success:false,message:'Parameters missing'})
        }
        const data = await Expense.create({
            amount: amount,
            description: description,
            category: category,
            userId: req.user.id,
        })
        const totalExpense=Number(req.user.totalExpenses)+Number(amount)
        console.log(totalExpense)
        User.update({
            totalExpenses:totalExpense
        },{
            where:{id:req.user.id}
        }).then(async()=>{
            res.status(200).json({expense:expense})
        })
        .catch(async(err)=>{
            return res.status(500).json({success:false,error:err})
        }).catch(async(err)=>{
            return res.status(500).json({success:false,error:err})
        })
        // console.log(data);
        return res.status(201).json({ details: data });

    }
    catch (err) {
        res.status(500).json(err);

    }

}

exports.getExpense = async (req, res, next) => {
    try {
       
        // const expense = await Expense.findAll({where:{userId:req.user.id}});
        const expense=await req.user.getExpenses();
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
        await Expense.destroy({ where: { id: eId, userId: req.user.id } });
        res.sendStatus(200);
    } catch (err) {
        console.log(err);
        res.status(500).json(err)
    }
}