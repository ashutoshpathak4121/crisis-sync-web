const express = require('express');
const router = express.Router();
const routeController = require('../controllers/routeController');
const { validateBody } = require('../middleware/validationMiddleware');
const { routeCalculateSchema } = require('../validators/schemas');

router.post('/calculate', validateBody(routeCalculateSchema), routeController.calculateRoute);
router.get('/recommendations', routeController.getRecommendations);

module.exports = router;
