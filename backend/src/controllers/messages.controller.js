const MESSAGES=require('../models/messages.model')

const getProjectMessages=async(req,res)=>{
    
    try{
        const { projectId } = req.params;
        const messages = await MESSAGES.find({
            projectId,
            type:'chat'
        }).populate("sender", "name email role")
        .sort({ createdAt: 1 });
        res.status(200).json({
        success: true,
        count: messages.length,
        data: messages,
        });
    }
    catch (error) {
        res.status(500).json({
        success: false,
        message: "Failed to fetch project messages",
        });
    }
}
const getProjectAnnouncements =async(req,res)=>{
     try{
        const announcements = await Message.find({
        projectId,
        type: "announcement",
        })
        .populate("sender", "name email role")
        .sort({ createdAt: -1 });

        res.status(200).json({
        success: true,
        count: announcements.length,
        data: announcements,
        });
     }catch (error) {
        res.status(500).json({
        success: false,
        message: "Failed to fetch project announcements",
        });
     }
}

module.exports = {
  getProjectMessages,
  getProjectAnnouncements,
};