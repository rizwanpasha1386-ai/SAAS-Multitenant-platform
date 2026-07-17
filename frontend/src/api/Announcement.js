import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const getAnnouncements = async (projectId) => {
  const res = await axios.get(
    `${API_URL}/api/project/${projectId}/announcements`,
    {
      withCredentials: true,
    }
  );

  console.log(res.data);
  return res.data.data;
};