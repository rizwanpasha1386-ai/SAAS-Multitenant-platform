const Project = require("../models/project.model");
const Message = require("../models/messages.model");

const projectChatSocket = (io, socket) => {
  // join project room
  socket.on("join-project-room", async (projectId) => {
    try {
      const project = await Project.findById(projectId);

      if (!project) {
        return socket.emit("error-message", "Project not found");
      }

      const isMember = project.members.some(
        (memberId) => memberId.toString() === socket.user._id.toString()
      );

      const isOwner = project.createdBy.toString() === socket.user._id.toString();

      if (!isMember && !isOwner) {
        return socket.emit(
          "error-message",
          "You are not allowed to join this project room"
        );
      }

      socket.join(projectId);

      socket.emit("project-room-joined", {
        projectId,
        message: "Joined project room successfully",
      });
    } catch (error) {
      socket.emit("error-message", "Failed to join project room");
    }
  });

  socket.on("send-project-message", async ({ projectId, message }) => {
    try {
      const project = await Project.findById(projectId);

      if (!project) {
        return socket.emit("error-message", "Project not found");
      }

      const isMember = project.members.some(
        (memberId) => memberId.toString() === socket.user._id.toString()
      );

      const isOwner = project.createdBy.toString() === socket.user._id.toString();

      if (!isMember && !isOwner) {
        return socket.emit(
          "error-message",
          "You are not allowed to send message in this project"
        );
      }

      const savedMessage = await Message.create({
        tenantId: project.tenantId,
        projectId: project._id,
        sender: socket.user._id,
        message,
        type: "chat",
      });

      const populatedMessage = await savedMessage.populate(
        "sender",
        "name email role"
      );

      io.to(projectId).emit("receive-project-message", populatedMessage);
    } catch (error) {
      socket.emit("error-message", "Failed to send project message");
    }
  });

  socket.on("send-announcement", async ({ projectId, message }) => {
    try {
      const project = await Project.findById(projectId);

      if (!project) {
        return socket.emit("error-message", "Project not found");
      }

      const isOwner = project.createdBy.toString() === socket.user._id.toString();

      if (!isOwner) {
        return socket.emit(
          "error-message",
          "Only project admin can send announcement"
        );
      }

      const savedAnnouncement = await Message.create({
        tenantId: project.tenantId,
        projectId: project._id,
        sender: socket.user._id,
        message,
        type: "announcement",
      });

      const populatedAnnouncement = await savedAnnouncement.populate(
        "sender",
        "name email role"
      );

      io.to(projectId).emit("receive-announcement", populatedAnnouncement);
    } catch (error) {
      socket.emit("error-message", "Failed to send announcement");
    }
  });

  socket.on("leave-project-room", (projectId) => {
    socket.leave(projectId);

    socket.emit("project-room-left", {
      projectId,
      message: "Left project room",
    });
  });
}

module.exports = projectChatSocket;