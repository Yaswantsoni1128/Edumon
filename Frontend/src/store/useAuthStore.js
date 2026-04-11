import { create } from 'zustand';
import axios from 'axios';
import toast from 'react-hot-toast';

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null,
  loading: false,

  login: async (email, password, role, navigate) => {
    set({ loading: true });
    try {
       console.log(import.meta.env.VITE_BASE_URL)
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/users/login`, {
        email,
        password,
        role,
      });

      const { token, user } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      set({ user, token, loading: false });
      toast.success(`Welcome back, ${user.name}!`);

      setTimeout(() => {
        if (user.role === "admin") navigate("/admin/dashboard");
        else if (user.role === "teacher") navigate("/teacher/dashboard");
        else if (user.role === "student") navigate("/student/dashboard");
      }, 1000);

    } catch (err) {
      const message = err.response?.data?.message || "Login failed";
      toast.error(message);
      set({ loading: false });
    }
  },

  logout: (navigate) => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ user: null, token: null });
    toast.success("Logged out successfully");
    if (navigate) navigate("/login");
  },

  checkAuth: () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");
    if (user && token) {
      set({ user, token });
    }
  }
}));

export default useAuthStore;
