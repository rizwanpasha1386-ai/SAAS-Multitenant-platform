const Joi = require('joi')

const objectId = Joi.string().hex().length(24)

const tenantIdParamSchema=Joi.object({
    tenantId:objectId.required(),
})
<<<<<<< HEAD

const tenantMemberParamSchema =
  Joi.object({
    tenantId: objectId.required(),

    memberId: objectId.required(),
  });

module.exports={tenantIdParamSchema,
    tenantMemberParamSchema,
}
=======
const tenantMemberParamSchema = Joi.object({
  tenantId: objectId.required(),
  memberId: objectId.required()
});
module.exports={tenantIdParamSchema,tenantMemberParamSchema}
>>>>>>> 08e81da (feat(frontend): add tenant workspace routing, member project/task portals, and project/task API integration)
