const db = require('../db');

exports.getRewards = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM rewards ORDER BY cost ASC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.createReward = async (req, res) => {
    const { title, description, cost, icon_ref } = req.body;

    if (req.user.role !== 'parent') {
        return res.status(403).json({ message: 'Only parents can create rewards' });
    }

    try {
        const result = await db.query(
            'INSERT INTO rewards (title, description, cost, icon_ref) VALUES ($1, $2, $3, $4) RETURNING *',
            [title, description, cost, icon_ref]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.purchaseReward = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        const rewardResult = await db.query('SELECT * FROM rewards WHERE id = $1', [id]);
        const reward = rewardResult.rows[0];

        if (!reward) return res.status(404).json({ message: 'Reward not found' });

        const userResult = await db.query('SELECT current_points FROM users WHERE id = $1', [userId]);
        const userPoints = userResult.rows[0].current_points;

        if (userPoints < reward.cost) {
            return res.status(400).json({ message: 'Not enough points' });
        }

        // Atomic transaction for point deduction and logging
        await db.query('BEGIN');
        await db.query('UPDATE users SET current_points = current_points - $1 WHERE id = $2', [reward.cost, userId]);
        await db.query('INSERT INTO transactions (user_id, amount, type, reference_id) VALUES ($1, $2, $3, $4)',
            [userId, -reward.cost, 'reward_purchase', id]);
        await db.query('COMMIT');

        const updatedUser = await db.query('SELECT current_points FROM users WHERE id = $1', [userId]);
        res.json({ message: 'Purchase successful', current_points: updatedUser.rows[0].current_points });
    } catch (err) {
        await db.query('ROLLBACK');
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
