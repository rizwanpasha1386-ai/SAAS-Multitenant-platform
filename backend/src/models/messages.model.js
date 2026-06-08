const mongoose=require('mongoose')

const messagesschema=new mongoose.Schema({
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
    },
     projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
     sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["chat", "announcement"],
      default: "chat",
    },
},{timestamps:true})

const MESSAGES=mongoose.model('messages',messagesschema)
module.exports=MESSAGES