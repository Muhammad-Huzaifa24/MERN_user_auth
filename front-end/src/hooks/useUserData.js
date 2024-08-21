// useUserStore.js
import { create } from "zustand";
import {
  fetchUserByName,
  fetchUsers,
  updateUserByName,
} from "../services/userService";

const useUserStore = create((set) => ({
  user: null,
  users: [],
  setUser: (user) => {
    set({ user });
  },
  setUsers: (users) => {
    set({ users });
  },
  clearUser: () => {
    set({ user: null });
  },
  fetchUser: async (userName) => {
    try {
      const userData = await fetchUserByName(userName);
      set({ user: userData });
    } catch (error) {
      console.error("Failed to fetch user data:", error.message);
    }
  },
  fetchAllUsers: async () => {
    try {
      const usersData = await fetchUsers();
      set({ users: usersData });
    } catch (error) {
      console.error("Failed to fetch users data:", error.message);
    }
  },
  saveUser: async (user_name, userData) => {
    try {
      const updatedUser = await updateUserByName(user_name, userData);
      set({ user: updatedUser });
    } catch (error) {
      console.error("Failed to save user data:", error.message);
    }
  },
}));

export default useUserStore;
