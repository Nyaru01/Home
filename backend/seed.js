const db = require('./db');
const bcrypt = require('bcryptjs');

async function seed() {
    try {
        const salt = await bcrypt.genSalt(10);
        const parentPassword = await bcrypt.hash('parent123', salt);
        const childPassword = await bcrypt.hash('child123', salt);

        // Nettoyer les données existantes
        await db.query('TRUNCATE users, tasks, rewards, transactions RESTART IDENTITY CASCADE');

        // Créer les utilisateurs
        const parentRes = await db.query(
            'INSERT INTO users (name, role, password_hash, avatar_ref) VALUES ($1, $2, $3, $4) RETURNING id',
            ['Jean-François', 'parent', parentPassword, 'parent-avatar']
        );

        const child1Res = await db.query(
            'INSERT INTO users (name, role, password_hash, current_points, avatar_ref) VALUES ($1, $2, $3, $4, $5) RETURNING id',
            ['Lucas', 'child', childPassword, 50, 'child-avatar-1']
        );

        const child2Res = await db.query(
            'INSERT INTO users (name, role, password_hash, current_points, avatar_ref) VALUES ($1, $2, $3, $4, $5) RETURNING id',
            ['Léa', 'child', childPassword, 30, 'child-avatar-2']
        );

        // Créer les tâches (Tasks)
        await db.query(
            'INSERT INTO tasks (title, description, points_value, assigned_to_user_id, status) VALUES ($1, $2, $3, $4, $5)',
            ['Ranger la chambre', 'Mettre tous les jouets dans les bacs et faire le lit.', 20, child1Res.rows[0].id, 'pending']
        );

        await db.query(
            'INSERT INTO tasks (title, description, points_value, assigned_to_user_id, status) VALUES ($1, $2, $3, $4, $5)',
            ['Vider le lave-vaisselle', 'Vider proprement le lave-vaisselle et ranger la vaisselle.', 15, child2Res.rows[0].id, 'waiting_approval']
        );

        await db.query(
            'INSERT INTO tasks (title, description, points_value, assigned_to_user_id, status) VALUES ($1, $2, $3, $4, $5)',
            ['Sortir les poubelles', 'Sortir les poubelles de recyclage et les ordures ménagères.', 10, child1Res.rows[0].id, 'pending']
        );

        // Créer les récompenses (Rewards)
        await db.query(
            'INSERT INTO rewards (title, description, cost, icon_ref) VALUES ($1, $2, $3, $4)',
            ['30 min de console', 'Un ticket pour 30 minutes de jeu vidéo supplémentaire.', 50, 'controller']
        );

        await db.query(
            'INSERT INTO rewards (title, description, cost, icon_ref) VALUES ($1, $2, $3, $4)',
            ['Sortie au cinéma', 'Le choix du film pour la prochaine sortie ciné.', 200, 'film']
        );

        await db.query(
            'INSERT INTO rewards (title, description, cost, icon_ref) VALUES ($1, $2, $3, $4)',
            ['Une glace', 'Une super glace avec 2 boules et du chantilly !', 40, 'icecream']
        );

        console.log('Base de données peuplée avec succès (Version FR) !');
        process.exit(0);
    } catch (err) {
        console.error('Erreur lors du seeding:', err);
        process.exit(1);
    }
}

seed();
