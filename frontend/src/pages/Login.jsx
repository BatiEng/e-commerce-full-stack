import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";

function Login() {
  const { backendURL, navigate, setToken, setUser } = useContext(ShopContext);
  const [currentState, setCurrentState] = useState("Login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const response =
        currentState === "Login"
          ? await axios.post(backendURL + "/api/user/login", {
              email,
              password,
            })
          : await axios.post(backendURL + "/api/user/register", {
              name,
              email,
              password,
            });
      if (response.data.success) {
        navigate("/");
        toast.success(response.data.message, { autoClose: 1000 });
        setUser(response.data.user[0]);
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user[0]));
      } else {
        toast.error(response.data.message, { autoClose: 2000 });
      }
    } catch (err) {
      toast.error(err.response.data.message, { autoClose: 2000 });
    }
  };
  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800"
    >
      <div className="inline-flex items-center gap-2 mb-2 mt-10">
        <p className="prata-regular text-3xl">{currentState}</p>
        <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
      </div>
      {currentState === "Login" ? (
        ""
      ) : (
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-800"
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
          value={name}
          required
        />
      )}
      <input
        type="email"
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        required
      />
      <input
        type="password"
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        required
      />
      <div className="w-full flex  justify-between text-sm mt-[-8px]">
        <p className="cursor-pointer">Forgot your password?</p>
        {currentState === "Login" ? (
          <p
            onClick={() => setCurrentState("Sign up")}
            className="cursor-pointer"
          >
            Create account
          </p>
        ) : (
          <p
            onClick={() => setCurrentState("Login")}
            className="cursor-pointer"
          >
            Login here
          </p>
        )}
      </div>
      <button className="bg-black text-white font-light px-8 py-2 cursor-pointer">
        {currentState === "Login" ? "Login" : "Register"}
      </button>
    </form>
  );
}

export default Login;
