import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import ChatWindow from "./ChatWindow";
import UserList from "./UserList";
import { ToastContainer } from "react-toastify";
import useChat from "@/hooks/useChat";
import "react-toastify/dist/ReactToastify.css";
import "tailwindcss/tailwind.css";
import "@/assets/styles/scrollbar.css";

const Chat: React.FC = () => {
  const {
    showModal,
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
  } = useChat();

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  return (
    <div className="bg-gray-900 text-white flex flex-col justify-between items-stretch h-screen w-screen flex-shrink-0 ">
      <ToastContainer />
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
        <UserList
          users={filteredUsers}
          currentUserId={currentUserId}
          receiver={receiver}
          setReceiver={setReceiver}
        />
        <ChatWindow
          receiver={receiver}
          messages={messages}
          messageInput={messageInput}
          setMessageInput={setMessageInput}
          sendMessage={sendMessage}
        />
      </div>
      {showChatModal && (
        <Dialog open={showChatModal} onOpenChange={setShowChatModal}>
          <DialogOverlay className="bg-gray-600 bg-opacity-50" />
          <DialogContent className="border border-gray-800 w-96 shadow-lg bg-gray-800 flex justify-center items-center">
            <div className="bg-gray-800 p-6 rounded-lg w-96">
              <DialogTitle className="text-xl text-white mb-4">
                Chat With
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
                  {filteredUsers.map((user) => (
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
