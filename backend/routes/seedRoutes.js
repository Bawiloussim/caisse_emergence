// ⚠️ ROUTE TEMPORAIRE — à utiliser une seule fois pour créer le premier
// compte secrétaire en production (quand l'onglet "Shell" de Render n'est
// pas disponible sur le plan gratuit), puis à SUPPRIMER (voir server.js).
//
// Protégée par SEED_SECRET : sans ce secret dans l'URL, la route refuse.

const express = require('express');
const Member = require('../models/Member');

const router = express.Router();

router.get('/run-seed', async (req, res) => {
  try {
    if (!process.env.SEED_SECRET || req.query.secret !== process.env.SEED_SECRET) {
      return res.status(403).json({ message: 'Secret invalide ou manquant' });
    }

    const email = (process.env.SECRETARY_EMAIL || '').toLowerCase().trim();
    const password = process.env.SECRETARY_PASSWORD;
    const name = process.env.SECRETARY_NAME || 'Secrétaire';

    if (!email || !password) {
      return res.status(400).json({
        message: 'Définissez SECRETARY_EMAIL et SECRETARY_PASSWORD dans les variables d\'environnement',
      });
    }

    const existing = await Member.findOne({ email });
    if (existing) {
      return res.json({ message: `Un compte existe déjà pour ${email} — aucune action effectuée.` });
    }

    await Member.create({
      name,
      email,
      password,
      accountRole: 'secretaire',
      role: 'Secrétaire',
      mustChangePassword: false,
    });

    res.json({ message: `✅ Compte secrétaire créé avec succès : ${email}` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
