// Évite qu'une erreur dans une fonction async (ex: erreur MongoDB) ne
// fasse planter tout le serveur. Toute erreur est transmise au
// gestionnaire d'erreurs centralisé de server.js, qui renvoie une réponse
// JSON propre (avec les en-têtes CORS déjà appliqués).
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
