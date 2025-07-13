import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import jwt_encode from "jwt-encode";
import "./App.css";

// تعريف نوع المستخدم
type User = {
  username: string;
  token: string;
};

const SECRET = "supersecret"; // السر اللي هيتم brute-force عليه

export default function App() {
  const [view, setView] = useState<"login" | "register">("login");
  const [form, setForm] = useState({ username: "", password: "" });
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUser({ username: payload.username, token });
      } catch {
        Cookies.remove("token");
      }
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = () => {
    const users: { username: string; password: string }[] = JSON.parse(
      localStorage.getItem("users") || "[]"
    );
    users.push({ username: form.username, password: form.password });
    localStorage.setItem("users", JSON.stringify(users));
    alert("Registered! Now login.");
    setView("login");
  };

  const handleLogin = () => {
    const users: { username: string; password: string }[] = JSON.parse(
      localStorage.getItem("users") || "[]"
    );
    const found = users.find(
      (u) => u.username === form.username && u.password === form.password
    );
    if (found) {
      const payload = { username: found.username, role: "user" };
      const token = jwt_encode(payload, SECRET);
      Cookies.set("token", token);
      setUser({ username: found.username, token });
    } else {
      alert("Invalid credentials");
    }
  };

  const handleLogout = () => {
    Cookies.remove("token");
    setUser(null);
  };

  const checkAdmin = () => {
    const token = Cookies.get("token");
    if (!token) return alert("No token");
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload.role === "admin") {
        alert("🎉 Congratulations! You're an admin. flag{Y0u_4R3_4dM1n}");
      } else {
        alert("You are not admin.");
      }
    } catch {
      alert("Invalid token");
    }
  };

  if (!user) {
    return (
      <div className="container">
        <div className="card">
          <h2>{view === "login" ? "Login" : "Register"}</h2>
          <input
            name="username"
            placeholder="Username"
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
          />
          <button onClick={view === "login" ? handleLogin : handleRegister}>
            {view === "login" ? "Login" : "Register"}
          </button>
          <p onClick={() => setView(view === "login" ? "register" : "login")}>
            {view === "login"
              ? "Don't have an account? Register"
              : "Already have an account? Login"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <h2>Welcome, {user.username}</h2>
        <button onClick={checkAdmin}>Check Admin</button>
        <button className="logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}
