const db = require('../db');

exports.getTasks = async (req, res) => {
    try {
        const result = await db.query('SELECT tasks.*, users.name as assigned_name FROM tasks LEFT JOIN users ON tasks.assigned_to_user_id = users.id ORDER BY tasks.created_at DESC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.createTask = async (req, res) => {
    const { title, description, points_value, assigned_to_user_id } = req.body;

    if (req.user.role !== 'parent') {
        return res.status(403).json({ message: 'Only parents can create tasks' });
    }

    try {
        const result = await db.query(
            'INSERT INTO tasks (title, description, points_value, assigned_to_user_id) VALUES ($1, $2, $3, $4) RETURNING *',
            [title, description, points_value, assigned_to_user_id]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateTaskStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const taskResult = await db.query('SELECT * FROM tasks WHERE id = $1', [id]);
        const task = taskResult.rows[0];

        if (!task) return res.status(404).json({ message: 'Task not found' });

        // Workflow logic
        if (status === 'waiting_approval' && req.user.role === 'child') {
            // Child marks as done
            await db.query('UPDATE tasks SET status = $1 WHERE id = $2', ['waiting_approval', id]);
        } else if (status === 'completed' && req.user.role === 'parent') {
            // Parent validates
            await db.query('UPDATE tasks SET status = $1, completed_at = CURRENT_TIMESTAMP WHERE id = $2', ['completed', id]);

            // Award points
            await db.query('UPDATE users SET current_points = current_points + $1 WHERE id = $2', [task.points_value, task.assigned_to_user_id]);

            // Log transaction
            await db.query('INSERT INTO transactions (user_id, amount, type, reference_id) VALUES ($1, $2, $3, $4)',
                [task.assigned_to_user_id, task.points_value, 'task_completion', id]);

        } else if (status === 'pending' && req.user.role === 'parent') {
            // Parent rejects or resets
            await db.query('UPDATE tasks SET status = $1 WHERE id = $2', ['pending', id]);
        } else {
            return res.status(403).json({ message: 'Unauthorized status change' });
        }

        const updatedTask = await db.query('SELECT * FROM tasks WHERE id = $1', [id]);
        res.json(updatedTask.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
