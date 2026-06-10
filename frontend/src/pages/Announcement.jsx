import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { socket } from "../socket"; 
import { getAnnouncements } from "../api/Announcement";
import { useWorkspace } from "../context/WorkspaceContext";

export default function Announcement() {
  const { projectId } = useParams();
  const { currentUser, userRole,isAdmin,isOwner } = useWorkspace();

  const canSendAnnouncement = isOwner || isAdmin;

  const [announcements, setAnnouncements] = useState([]);
  const [message, setMessage] = useState("");

  const loadAnnouncements = async () => {
    try {
      const data = await getAnnouncements(projectId);
      setAnnouncements(data);
    } catch (error) {
      console.log("Failed to load announcements", error);
    }
  };

  const sendAnnouncement = () => {
    if (!message.trim()) return;

    socket.emit("send-announcement", {
      projectId,
      message,
    });

    setMessage("");
  };

  useEffect(() => {
  loadAnnouncements();

  socket.connect();
  socket.emit("join-project-room", projectId);

  const handleReceiveAnnouncement = (announcement) => {
    setAnnouncements((prev) => [announcement, ...prev]);
  };

  const handleError = (msg) => {
    alert(msg);
  };

  socket.on("receive-announcement", handleReceiveAnnouncement);
  socket.on("error-message", handleError);

  return () => {
    socket.emit("leave-project-room", projectId);

    socket.off("receive-announcement", handleReceiveAnnouncement);
    socket.off("error-message", handleError);
  };
}, [projectId]);

  return (
    <div>
      <h2>Announcements</h2>

      {canSendAnnouncement ? (
  <>
    <textarea
      placeholder="Write announcement..."
      value={message}
      onChange={(e) => setMessage(e.target.value)}
    />

    <br />

    <button onClick={sendAnnouncement}>
      Send Announcement
    </button>
  </>
) : (
  <p>You can view announcements, but only owner/admin can post.</p>
)}

      <hr />

      {announcements.length === 0 ? (
        <p>No announcements yet</p>
      ) : (
        announcements.map((announcement) => (
          <div key={announcement._id}>
            <h4>📢 {announcement.message}</h4>

            <p>
              By {announcement.sender?.name || "Unknown"}
            </p>

            <small>
              {new Date(
                announcement.createdAt
              ).toLocaleString()}
            </small>

            <hr />
          </div>
        ))
      )}
    </div>
  );
}