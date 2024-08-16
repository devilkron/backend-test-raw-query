const express = require("express")
const router = express.Router()
const dataController = require("../controller/Controller-data")

router.get("/get", dataController.getData)


router.post("/add",dataController.Adddata)

router.patch("/updatedata/:ID",dataController.updateData)
router.patch("/changepwd",dataController.Changepwd)
module.exports = router