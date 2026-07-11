const USER=require('../models/user.model')
const MEMBERSHIP=require('../models/membership.model')
const PROJECT=require('../models/project.model')
const TASK=require('../models/tasks.model')

//redis 
const {
  getCache,
  setCache,
  deleteCache,
  deleteMultipleCacheKeys,
  deleteCacheByPattern,
} = require("../services/cache.service");
const cacheKeys = require("../services/cache-key.services");

async function invalidateProjectCaches(tenantId, projectId) {
  const exactKeys = [cacheKeys.tenantProjects(tenantId)];

  if (projectId) {
    exactKeys.push(
      cacheKeys.project(tenantId, projectId),
      cacheKeys.projectMembers(tenantId, projectId),
      cacheKeys.projectAnnouncements(tenantId, projectId)
    );
  }

  await deleteMultipleCacheKeys(exactKeys);

  await Promise.all([
    deleteCacheByPattern(cacheKeys.projectList(tenantId, "*", "*", "*")),
    deleteCacheByPattern(cacheKeys.myProjects(tenantId, "*", "*", "*")),
  ]);
}

async function createProject(req,res) {
    try {
        const {name,description,duedate}=req.body
        const tenantId=req.params.tenantId
        const project=await PROJECT.create({
            name:name,
            description:description,
            createdBy:req.user._id,
            duedate:duedate,
            members: [req.user._id],
            tenantId:tenantId
        })

        await invalidateProjectCaches(tenantId, project._id);

        return res.status(201).json({msg:"Project created successfully",
            project:project
        })
    } catch (error) {
        return res.status(500).json({msg:"Server error"})
    }
}

async function getAllProjects(req, res) {
  try {
    const userId = req.user._id;
    const tenantId = req.params.tenantId;
    const { search, sort } = req.query;

    // Cache key
    const cacheKey = cacheKeys.projectList(tenantId, userId, search, sort);

    // Check cache
    const cachedProjects = await getCache(cacheKey);

    if (cachedProjects) {
      return res.status(200).json({
        success: true,
        data: cachedProjects,
      });
    }

    // Base filter
    let filter = {
      tenantId,
      createdBy: userId,
    };

    // Search
    if (search) {
      filter.name = {
        $regex: search,
        $options: "i",
      };
    }

    // Sorting
    let sortOption = { createdAt: -1 };

    if (sort === "createdAt") {
      sortOption = { createdAt: -1 };
    } else if (sort === "dueDate") {
      sortOption = { dueDate: 1 };
    }

    const projects = await PROJECT.find(filter)
      .sort(sortOption)
      .select("name description createdBy members dueDate createdAt");

    // Store in cache
    await setCache(cacheKey, projects);

    return res.status(200).json({
      success: true,
      data: projects,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
}

async function getProjectById(req, res) {
  try {
    const tenantId = req.params.tenantId;
    const projectId = req.params.projectId;

    // Generate cache key
    const cacheKey = cacheKeys.project(tenantId, projectId);

    // Check cache
    const cachedProject = await getCache(cacheKey);

    if (cachedProject) {
      return res.status(200).json({
        project: cachedProject,
      });
    }

    // Data already available from middleware
    const project = req.project;

    // Store in Redis
    await setCache(cacheKey, project);

    return res.status(200).json({
      project,
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      msg: "Server error",
      err: error.message,
    });
  }
}

async function updateProject(req, res) {
    try {
        const projectId = req.params.projectId;
        const { name, description, duedate } = req.body;

        // Find project
        const project = await PROJECT.findById(projectId);

        if (name) project.name = name;
        if (description) project.description = description;
        if (duedate) project.duedate = duedate;

        await project.save();
        await invalidateProjectCaches(req.params.tenantId || project.tenantId, projectId);

        return res.status(200).json({
            msg: "Project updated successfully",
            project
        });

    } catch (error) {
         return res.status(500).json({msg:"Server error",
            err:error.message
        })
    }
}

async function deleteProject(req,res) {
    try {
        const projectId = req.params.projectId;

        const project = await PROJECT.findById(projectId);
        const tenantId = req.params.tenantId || project?.tenantId;

        await PROJECT.findByIdAndDelete(projectId);
        await invalidateProjectCaches(tenantId, projectId);

        return res.status(200).json({msg:"Project deleted"})
    } catch (error) {
         return res.status(500).json({msg:"Server error",
            err:error.message
        })
    }
}

async function addProjectMembers(req, res) {
    try {
        const projectId = req.params.projectId;
        const { members } = req.body; // array of userIds

        // 1. Get project
        const project = await PROJECT.findById(projectId);
        const tenantId = req.params.tenantId;

        // 2. Validate users exist
        const users = await USER.find({ _id: { $in: members } });

        if (users.length !== members.length) {
            return res.status(404).json({
                msg: "Some users not found"
            });
        }

        // 3. Check users belong to tenant
        const tenantMembers = await MEMBERSHIP.find({
            tenant: tenantId,
            user: { $in: members }
        });

        if (tenantMembers.length !== members.length) {
            return res.status(400).json({
                msg: "Some users are not part of the tenant"
            });
        }

        // 4. Avoid duplicate project members
        const existingMembersSet = new Set(
            project.members.map(id => id.toString())
        );

        const newMembers = members.filter(
            id => !existingMembersSet.has(id.toString())
        );

        // 5. Update project
        if (newMembers.length > 0) {
            project.members.push(...newMembers);
            await project.save();
        }

        await invalidateProjectCaches(req.params.tenantId || project.tenantId, projectId);

        return res.status(200).json({
            success: true,
            msg: "Project members updated successfully",
            addedCount: newMembers.length,
            skipped: members.length - newMembers.length,
            totalMembers: project.members.length
        });

    } catch (error) {
        return res.status(500).json({
            msg: "Server error",
            error: error.message
        });
    }
}

async function RemoveMember(req,res) {
    try {
        const { projectId, memberId } = req.params;
        
        const project = await PROJECT.findOneAndUpdate(
            { _id: projectId, createdBy: req.user._id },
            {
                $pull: { members: memberId } 
            },
            { new: true }
        );
        if (!project) {
            return res.status(404).json({
                msg: "Project not found or unauthorized"
            });
        }

        await invalidateProjectCaches(req.params.tenantId || project.tenantId, projectId);

         return res.status(200).json({
            success: true,
            msg: "Member removed successfully",
            totalMembers: project.members.length,
            data: project
        });
    } catch (error) {
         return res.status(500).json({
            msg: "Server error",
            error: error.message
        });
    }
}

async function GetAllMembers(req, res) {
  try {
    const { projectId } = req.params;
    const tenantId = req.params.tenantId;
    const { search, role } = req.query;

    const cacheKey = cacheKeys.projectMembers(tenantId, projectId);
    const cachedMembers = await getCache(cacheKey);

    if (cachedMembers) {
      return res.status(200).json({
        success: true,
        count: cachedMembers.length,
        data: cachedMembers
      });
    }

    const project = await PROJECT.findById(projectId)
      .populate("members", "name email role");

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    let members = project.members;

    if (search) {
      const searchLower = search.toLowerCase();
      members = members.filter(member =>
        member.name.toLowerCase().includes(searchLower) ||
        member.email.toLowerCase().includes(searchLower)
      );
    }

    if (role) {
      members = members.filter(member => member.role === role);
    }

    await setCache(cacheKey, members);

    return res.status(200).json({
      success: true,
      count: members.length,
      data: members
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
}

//Member
async function GetMyProjects(req, res) {
  try {
    const userId = req.user._id;
    const tenantId = req.params.tenantId;
    const { search, dueDate } = req.query;

    // Cache key
    const cacheKey = cacheKeys.myProjects(tenantId, userId, search, dueDate);

    // Check cache
    const cachedProjects = await getCache(cacheKey);

    if (cachedProjects) {
      return res.status(200).json({
        success: true,
        count: cachedProjects.length,
        data: cachedProjects,
      });
    }

    const filter = {
      tenantId,
      members: userId,
    };

    // Search
    if (search) {
      filter.name = {
        $regex: search,
        $options: "i",
      };
    }

    // Due date filter
    if (dueDate) {
      const date = new Date(dueDate);

      const nextDay = new Date(date);
      nextDay.setDate(date.getDate() + 1);

      filter.duedate = {
        $gte: date,
        $lt: nextDay,
      };
    }

    const projects = await PROJECT.find(filter)
      .select("name description createdBy members duedate createdAt")
      .sort({ createdAt: -1 });

    // Store in cache
    await setCache(cacheKey, projects);

    return res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
}

async function GetAProject(req,res) {
    try {
        const {projectId,tenantId}=req.params

        const cacheKey = cacheKeys.project(tenantId, projectId);
        const cachedProject = await getCache(cacheKey);

        if (cachedProject) {
            return res.status(200).json({msg:"Project found",
                project:cachedProject
            })
        }

        const project=await PROJECT.findOne({
            _id:projectId,tenantId:tenantId})
            .select("name description members createdBy createdAt")
            .populate("members", "name email")
            .populate("createdBy", "name email");

        if(!project)
            return res.status(404).json({msg:"Project not found"})

        await setCache(cacheKey, project);

        return res.status(200).json({msg:"Project found",
            project:project
        })
    } catch (error) {
        console.log(error);
        
        return res.status(500).json({msg:"Server error"})
    }
}


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
        const { projectId, tenantId } = req.params;
        const cacheKey = cacheKeys.projectAnnouncements(tenantId, projectId);
        const cachedAnnouncements = await getCache(cacheKey);

        if (cachedAnnouncements) {
            return res.status(200).json({
                success: true,
                count: cachedAnnouncements.length,
                data: cachedAnnouncements,
            });
        }

        const announcements = await MESSAGES.find({
        projectId,
        type: "announcement",
        })
        .populate("sender", "name email role")
        .sort({ createdAt: -1 });

        await setCache(cacheKey, announcements);

        res.status(200).json({
        success: true,
        count: announcements.length,
        data: announcements,
        });
     }catch (error) {
        console.log("Error fetching announcements:", error);
        res.status(500).json({
        success: false,
        message: "Failed to fetch project announcements",
        });
     }
}


module.exports={createProject,getAllProjects,getProjectById,updateProject,deleteProject,addProjectMembers,RemoveMember,GetAllMembers,GetMyProjects,GetAProject,getProjectMessages,
  getProjectAnnouncements}