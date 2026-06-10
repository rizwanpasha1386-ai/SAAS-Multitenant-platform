import axios from "axios";

export const getAnnouncements = async (projectId) => {
  const res = await axios.get(
    `http://localhost:8000/api/project/${projectId}/announcements`,
    {
      withCredentials: true,
    }
  );

  console.log(res.data);
  return res.data.data;
};