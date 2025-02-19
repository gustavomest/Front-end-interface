const express = require("express");
const router = express.Router();
const serviceController = require("../controllers/serviceController");

router.put("/:serviceName/start", serviceController.startService);
router.put("/:serviceName/stop", serviceController.stopService);
router.get("/:serviceName", serviceController.getServiceStatus);
module.exports = router;
