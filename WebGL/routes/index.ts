/*
 * GET home page.
 */
import express = require('express');
const router = express.Router();

router.get('/', (req: express.Request, res: express.Response) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Request-Headers", "X-Requested-With, Content-Type, Accept");
    res.sendFile("/public/ThreeJS.html", { root: __dirname });
});

export default router;