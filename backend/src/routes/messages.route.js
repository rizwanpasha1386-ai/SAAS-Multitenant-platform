const express=require('express')
const router=express.Router()

const {auth}=require('../middlewares/auth')
const {IsProjectMember,IsProjectOwner}=require('../middlewares/project.middleware')

const {
  getProjectMessages,
  getProjectAnnouncements,
} = require("../controllers/message.controller");

router.use(auth)
router.get('/:projectId/messages',IsProjectMember,getProjectMessages)
router.get('/:projectId/announcements',IsProjectMember,getProjectAnnouncements)

module.exports=router