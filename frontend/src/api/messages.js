import axios from "axios";

export const getMessages = async (
  projectId
) => {
  const res = await axios.get(
    `http://localhost:8000/api/project/${projectId}/messages`,
    {
      withCredentials: true,
    }
  );
  console.log(res.data);
  return res.data.data;
};
