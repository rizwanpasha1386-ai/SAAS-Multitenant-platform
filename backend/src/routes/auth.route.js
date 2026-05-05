const express=require('express')
const router=express.Router()
const {signup,login,GetMe}=require('../controllers/auth.controller')
const {validate}=require('../middlewares/validate')
const {signupSchema,loginSchema}=require('../validations/auth.validation')
const {auth}=require('../middlewares/auth')

router.post('/signup',validate(signupSchema),signup)
router.post('/login',validate(loginSchema),login)

router.use(auth)
router.get('/me',GetMe)
module.exports=router