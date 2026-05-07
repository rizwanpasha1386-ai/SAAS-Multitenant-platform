const express=require('express')

const router=express.Router()
const {auth}=require('../middlewares/auth')
const {isAdmin,isMember,isOwner}=require('../middlewares/roles.middleware')
const {createTenant,displayAllTenants,createAdmin,addTenantMembers,updateMemberRole,getTenantMembers,deleteTenantMember,viewTenant,updateTenant,deleteTenant}=require('../controllers/tenant.controller')
const {validate}=require('../middlewares/validate')
const {tenantIdParamSchema,tenantMemberParamSchema,}=require('../validations/tenant.validation')

router.use(auth)
router.get('/',displayAllTenants) //?search,role
router.post('/',createTenant)

//owner
router.get('/:tenantId',isOwner,validate(tenantIdParamSchema,"params"),viewTenant)
router.patch('/:tenantId',isOwner,validate(tenantIdParamSchema,"params"),updateTenant)
router.delete('/:tenantId',isOwner,validate(tenantIdParamSchema,"params"),deleteTenant)
router.post('/:tenantId/createAdmin',isOwner,validate(tenantIdParamSchema,"params"),createAdmin)
router.post('/:tenantId/add-members',isOwner,validate(tenantIdParamSchema,"params"),addTenantMembers)
router.get('/:tenantId/members',isOwner,validate(tenantIdParamSchema,"params"),getTenantMembers)  ///members?role=admin,member&search=rizwan&sort=-createdAt
router.delete('/:tenantId/members/:memberId',isOwner,validate(tenantMemberParamSchema,"params"),deleteTenantMember)
router.patch('/:tenantId/role',isOwner,validate(tenantIdParamSchema,"params"),updateMemberRole)

module.exports=router