/*
 * GET home page.
 */
import express = require('express');
const router = express.Router();

router.get('/', (req: express.Request, res: express.Response) => {
    res.sendFile("/public/ThreeJS.html", { root: __dirname });
});

export default router;