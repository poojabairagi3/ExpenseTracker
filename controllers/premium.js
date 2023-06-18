const User = require('../models/user');
const Expense = require('../models/expense');
const sequelize = require('../util/database');

exports.getPremium = async (req, res) => {
    try {

        const leaderboardofusers = await User.findAll({
            attributes: ['id', 'name', [sequelize.fn('sum', sequelize.col('expenses.amount')), 'total_cost']],
            include: [                //byDefault:left joint
                {
                    model: Expense,
                    attributes: []
                }
            ],
            group: ['user.id'],
            order: [['total_cost', 'DESC']]
        });
        res.status(200).json(leaderboardofusers);
    }
    catch (err) {
        console.log(err);
    }
}