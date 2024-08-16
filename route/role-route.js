const express = require("express");
const router = express.Router()
const roleController = require('../controller/Controller-role')

router.get('/get',roleController.getRoles)

router.post('/add', roleController.AddRoles)



module.exports = router