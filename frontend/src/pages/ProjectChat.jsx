import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { socket } from "../socket";
import { getMessages } from "../api/messages";

export default function ProjectChat() {
  const { projectId } = useParams();

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [joined, setJoined] = useState(false);
  const [error, setError] = useState("");

  const sendMessage = () => {
    if (!message.trim()) return;

    socket.emit("send-project-message", {
      projectId,
      message,
    });

    setMessage("");
  };

  useEffect(() => {
    socket.connect();
    console.log(projectId)
    socket.emit("join-project-room", projectId);

    const handleRoomJoined = (data) => {
      console.log("Room joined:", data);
      setJoined(true);
      setError("");
    };

    const handleReceiveMessage = (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    };

    const handleRoomLeft = (data) => {
      console.log("Room left:", data);
      setJoined(false);
    };

    const handleError = (errorMessage) => {
      console.log("Socket error:", errorMessage);
      setError(errorMessage);
    };

    socket.on("project-room-joined", handleRoomJoined);
    socket.on("receive-project-message", handleReceiveMessage);
    socket.on("project-room-left", handleRoomLeft);
    socket.on("error-message", handleError);

    const loadMessages = async () => {
      try {
        const data = await getMessages(projectId);
        setMessages(Array.isArray(data) ? data : []);
      } catch (error) {
        console.log("Failed to load messages:", error);
        setError("Failed to load messages");
      }
    };

    loadMessages();

    return () => {
      socket.emit("leave-project-room", projectId);

      socket.off("project-room-joined", handleRoomJoined);
      socket.off("receive-project-message", handleReceiveMessage);
      socket.off("project-room-left", handleRoomLeft);
      socket.off("error-message", handleError);

      socket.disconnect();
    };
  }, [projectId]);

  return (
    <div>
      <h2>Project Chat</h2>

      {joined && <p>Connected to project room</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div>
        {messages.map((msg) => (
          <div key={msg._id}>
            <strong>{msg.sender?.name || "Unknown User"}</strong>
            <p>{msg.message}</p>
          </div>
        ))}
      </div>

      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            sendMessage();
          }
        }}
        placeholder="Type message..."
      />

      <button onClick={sendMessage}>Send</button>
    </div>
  );
}