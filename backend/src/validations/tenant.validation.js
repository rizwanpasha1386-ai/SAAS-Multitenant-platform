const Joi = require('joi')

const objectId = Joi.string().hex().length(24)

const tenantIdParamSchema=Joi.object({
    tenantId:objectId.required(),
})

const tenantMemberParamSchema = Joi.object({
  tenantId: objectId.required(),
  memberId: objectId.required()
});
module.exports={tenantIdParamSchema,tenantMemberParamSchema}
