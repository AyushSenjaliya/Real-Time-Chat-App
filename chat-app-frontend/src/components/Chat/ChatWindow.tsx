import React, { useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PaperAirplaneIcon } from "@heroicons/react/20/solid";
import { Message, User } from "@/types";

interface ChatWindowProps {
  receiver: User | null;
  messages: { [key: string]: Message[] };
  messageInput: string;
  setMessageInput: React.Dispatch<React.SetStateAction<string>>;
  sendMessage: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  receiver,
  messages,
  messageInput,
  setMessageInput,
  sendMessage,
}) => {
  const chatWindowRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, receiver]);

  return (
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
                      ? "bg-sky-700 text-white"
                      : "bg-sky-900 text-white"
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
  );
};

export default ChatWindow;
