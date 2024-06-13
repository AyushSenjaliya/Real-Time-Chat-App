import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { io, Socket } from "socket.io-client";
import { toast } from "react-toastify";
import { User, Message, NewMessage } from "@/types";

const useChat = () => {
  const [showModal, setShowModal] = useState<boolean>(true);
  const [showChatModal, setShowChatModal] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [selectedChatUser, setSelectedChatUser] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);
  const [searchInput, setSearchInput] = useState<string>("");
  const [receiver, setReceiver] = useState<User | null>(null);
  const [messages, setMessages] = useState<{ [key: string]: Message[] }>({});
  const [messageInput, setMessageInput] = useState<string>("");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const socket = useRef<Socket | null>(null);

  useEffect(() => {
    if (currentUserId) {
      socket.current = io("http://localhost:3000", {
        query: { userId: currentUserId },
      });

      socket.current.on("connect", () => {
        console.log("Connected to WebSocket server");
      });

      socket.current.on("message", (newMessage: NewMessage) => {
        setMessages((prevMessages) => {
          const updatedMessages = {
            ...prevMessages,
            [newMessage.sender.name]: [
              ...(prevMessages[newMessage.sender.name] || []),
              {
                sender: newMessage.sender.name,
                message: newMessage.content,
                type:
                  newMessage.sender.id === currentUserId ? "sent" : "received",
              },
            ],
          };
          return updatedMessages;
        });

        if (newMessage.sender.id !== currentUserId) {
          toast.info(
            `New message from ${newMessage.sender.name}: ${newMessage.content}`
          );
        }
      });

      return () => {
        socket.current?.disconnect();
      };
    }
  }, [currentUserId]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:3000/users");
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      if (receiver) {
        try {
          const response = await axios.get("http://localhost:3000/messages");
          const userMessages = response.data
            .filter(
              (msg: any) =>
                (msg.senderId === receiver.id &&
                  msg.receiverId === currentUserId) ||
                (msg.senderId === currentUserId &&
                  msg.receiverId === receiver.id)
            )
            .map((msg: any) => ({
              sender: msg.sender.name,
              message: msg.content,
              type: msg.senderId === currentUserId ? "sent" : "received",
            }));
          setMessages((prevMessages) => {
            const updatedMessages = {
              ...prevMessages,
              [receiver.name]: userMessages,
            };
            return updatedMessages;
          });
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      }
    };
    fetchMessages();
  }, [receiver, currentUserId]);

  const sendMessage = async () => {
    const message = messageInput;
    if (currentUserId && receiver && message.trim()) {
      try {
        // Send via WebSocket
        socket.current?.emit("message", {
          senderId: currentUserId,
          receiverId: receiver.id,
          content: message,
        });

        setMessages((prevMessages) => {
          const updatedMessages = {
            ...prevMessages,
            [receiver.name]: [
              ...prevMessages[receiver.name],
              {
                sender: "You",
                message: message,
                type: "sent",
              },
            ],
          };
          return updatedMessages;
        });

        // Emit notification event to the receiver
        socket.current?.emit("notify", {
          senderName: "You",
          receiverId: receiver.id,
          content: message,
        });

        setMessageInput("");
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  const handleSaveUser = async () => {
    try {
      const response = await axios.get("http://localhost:3000/users");
      const existingUser = response.data.find(
        (user: User) => user.name === name
      );

      if (existingUser) {
        setCurrentUserId(existingUser.id);
        toast.success(`Welcome back, ${existingUser.name}!`);
      } else {
        const newUserResponse = await axios.post(
          "http://localhost:3000/users/register",
          { name }
        );
        const newUser = newUserResponse.data;
        setCurrentUserId(newUser.id);
        setUsers((prevUsers) => [...prevUsers, newUser]);
        toast.success(`New user added: ${newUser.name}`);
      }

      setShowModal(false);
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  const handleCreateChat = () => {
    const selectedUser = users.find((user) => user.name === selectedChatUser);
    if (selectedUser) {
      setReceiver(selectedUser);
    }
    setShowChatModal(false);
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchInput.toLowerCase())
  );

  return {
    showModal,
    setShowModal,
    name,
    setName,
    handleSaveUser,
    searchInput,
    setSearchInput,
    filteredUsers,
    receiver,
    setReceiver,
    messages,
    messageInput,
    setMessageInput,
    sendMessage,
    currentUserId,
    showChatModal,
    setShowChatModal,
    selectedChatUser,
    setSelectedChatUser,
    handleCreateChat,
  };
};

export default useChat;
