import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import "tailwindcss/tailwind.css";
import { PaperAirplaneIcon } from "@heroicons/react/20/solid";
import "./scrollbar.css";

const Chat = () => {
  const [showModal, setShowModal] = useState(true);
  const [showChatModal, setShowChatModal] = useState(false);
  const [name, setName] = useState("");
  const [selectedChatUser, setSelectedChatUser] = useState("");
  const [users, setUsers] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [receiver, setReceiver] = useState(null);
  const [messages, setMessages] = useState({});
  const [messageInput, setMessageInput] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);
  const chatWindowRef = useRef(null);

  const socket = useRef(null);

  useEffect(() => {
    if (currentUserId) {
      socket.current = io("http://localhost:3000", {
        query: { userId: currentUserId },
      });

      socket.current.on("connect", () => {
        console.log("Connected to WebSocket server");
      });

      socket.current.on("message", (newMessage) => {
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
          scrollToBottom();
          return updatedMessages;
        });
      });

      return () => {
        socket.current.disconnect();
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
              (msg) =>
                (msg.senderId === receiver.id &&
                  msg.receiverId === currentUserId) ||
                (msg.senderId === currentUserId &&
                  msg.receiverId === receiver.id)
            )
            .map((msg) => ({
              sender: msg.sender.name,
              message: msg.content,
              type: msg.senderId === currentUserId ? "sent" : "received",
            }));
          setMessages((prevMessages) => {
            const updatedMessages = {
              ...prevMessages,
              [receiver.name]: userMessages,
            };
            scrollToBottom();
            return updatedMessages;
          });
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      }
    };
    fetchMessages();
  }, [receiver, currentUserId]);

  const scrollToBottom = () => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  };

  const sendMessage = async () => {
    const message = messageInput;
    if (currentUserId && receiver && message.trim()) {
      try {
        // Send via WebSocket
        socket.current.emit("message", {
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
          scrollToBottom();
          return updatedMessages;
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
      const existingUser = response.data.find((user) => user.name === name);

      if (existingUser) {
        setCurrentUserId(existingUser.id);
      } else {
        const newUserResponse = await axios.post(
          "http://localhost:3000/users/register",
          { name }
        );
        const newUser = newUserResponse.data;
        setCurrentUserId(newUser.id);
        setUsers((prevUsers) => [...prevUsers, newUser]);
      }

      setShowModal(false);
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n.charAt(0).toUpperCase())
      .join("");
  };

  const handleCreateChat = () => {
    const selectedUser = users.find((user) => user.name === selectedChatUser);
    if (selectedUser) {
      setReceiver(selectedUser);
    }
    setShowChatModal(false);
  };

  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchInput.toLowerCase())
  );

  return (
    <div className="bg-gray-900 text-white flex flex-col justify-between items-stretch h-screen w-screen flex-shrink-0 ">
      {showModal && (
        <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center">
          <div className="bg-gray-800 p-4 rounded shadow-lg">
            <h2 className="text-xl mb-4">Enter Your Name Here</h2>
            <Input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mb-4 bg-gray-600"
            />
            <Button onClick={handleSaveUser} disabled={!name.trim()}>
              Enter
            </Button>
          </div>
        </div>
      )}
      <div className="flex items-center justify-between p-3 bg-gray-900">
        <Input
          type="text"
          placeholder="Search user"
          className="w-1/4 bg-gray-800"
          value={searchInput}
          onChange={handleSearchInputChange}
        />
        <div>Chat App</div>
        <Button
          className="bg-green-600 hover:bg-green-700"
          onClick={() => setShowChatModal(true)}
        >
          Add chat
        </Button>
      </div>
      <div className="flex flex-grow overflow-hidden">
        <div className="w-1/4 bg-gray-900 p-4 overflow-y-auto">
          <h2 className="text-lg font-semibold mb-4">Users</h2>
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className={`p-2 cursor-pointer rounded mb-2 hover:bg-gray-700 ${
                receiver?.id === user.id ? "bg-gray-700" : "bg-gray-900"
              }`}
              onClick={() => setReceiver(user)}
            >
              <div className="flex items-center">
                <div className="w-12 h-12 bg-cyan-950 rounded-full mr-2 flex items-center justify-center text-white font-bold">
                  {getInitials(user.name)}
                </div>
                <div>
                  <div className="font-semibold">
                    {user.id === currentUserId ? "You" : user.name}
                  </div>
                  <div className="text-gray-400">Last message</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="w-3/4 flex flex-col">
          <div
            ref={chatWindowRef}
            className="flex-grow p-4 overflow-y-auto bg-gray-800 flex flex-col-reverse scrollbar-thin"
          >
            {receiver ? (
              <div>
                {messages[receiver.name]?.map((msg, index) => (
                  <div
                    key={index}
                    className={`p-2 my-2 ${
                      msg.type === "sent" ? "text-right" : "text-left"
                    }`}
                  >
                    <div
                      className={`inline-block p-2 rounded ${
                        msg.type === "sent"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-600 text-white"
                      }`}
                    >
                      {msg.message}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-400">
                Select a user to start chatting
              </div>
            )}
          </div>
          <div className="p-4 flex bg-gray-800">
            <Input
              type="text"
              placeholder="Type a message"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              className="mr-2 w-full bg-gray-900"
            />
            <Button
              className="bg-green-500"
              onClick={sendMessage}
              disabled={!messageInput.trim()}
            >
              <PaperAirplaneIcon className="w-6 h-6 text-white" />
            </Button>
          </div>
        </div>
      </div>
      {showChatModal && (
        <Dialog open={showChatModal} onOpenChange={setShowChatModal}>
          <DialogOverlay className="bg-gray-600 bg-opacity-50" />
          <DialogContent className="border border-gray-800 w-96 shadow-lg bg-gray-800 flex justify-center items-center">
            <div className="bg-gray-800 p-6 rounded-lg w-96">
              <DialogTitle className="text-xl text-white mb-4">
                Create chat
              </DialogTitle>
              <div className="mb-4 overflow-y-auto">
                <select
                  className="w-full bg-gray-700 text-white p-2 rounded"
                  value={selectedChatUser}
                  onChange={(e) => {
                    setSelectedChatUser(e.target.value);
                  }}
                >
                  <option value="" disabled>
                    Select a user to chat...
                  </option>
                  {users.map((user) => (
                    <option key={user.id} value={user.name}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>
              <DialogFooter className="flex justify-between">
                <Button
                  onClick={() => setShowChatModal(false)}
                  className="bg-gray-600"
                >
                  Close
                </Button>
                <Button onClick={handleCreateChat} className="bg-green-600">
                  Create
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Chat;
