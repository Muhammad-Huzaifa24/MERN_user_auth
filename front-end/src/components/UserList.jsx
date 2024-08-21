import React, { useState, useEffect } from "react";
import useUserStore from "../hooks/useUserData";
import Loader from "./Loader";

const UserList = () => {
  const { users, fetchAllUsers } = useUserStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        await fetchAllUsers();
        setTimeout(() => setLoading(false), 1000);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    loadData();
  }, [fetchAllUsers]);

  if (error) return <p>Error: {error}</p>;

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="user-list">
          {users.map((user) => (
            <div key={user._id} className="user-card">
              <img
                src={user.profilePicture}
                alt={user.name}
                className="user-avatar"
              />
              <div className="user-details">
                <p className="user-name">{user.name}</p>
                <p className="user-email">{user.email}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default UserList;
