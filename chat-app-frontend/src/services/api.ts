import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
});

export const getUsers = async () => {
  const response = await api.get("/users");
  return response.data;
};

export const getMessages = async () => {
  const response = await api.get("/messages");
  return response.data;
};

export const registerUser = async (name: string) => {
  const response = await api.post("/users/register", { name });
  return response.data;
};

export const sendMessage = async (
  senderId: string,
  receiverId: string,
  content: string
) => {
  const response = await api.post("/messages", {
    senderId,
    receiverId,
    content,
  });
  return response.data;
};
