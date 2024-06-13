import React from "react";
import getInitials from "@/utils/getInitials";
import { User } from "@/types";

interface UserListProps {
  users: User[];
  currentUserId: string | null;
  receiver: User | null;
  setReceiver: React.Dispatch<React.SetStateAction<User | null>>;
}

const UserList: React.FC<UserListProps> = ({
  users,
  currentUserId,
  receiver,
  setReceiver,
}) => {
  return (
    <div className="w-1/4 bg-gray-900 p-4 overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4">Users</h2>
      {users.map((user) => (
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
              <div className="text-gray-400 text-sm">
                {user.id === currentUserId ? "Online" : "Last Message"}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserList;
