import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { login } from "@/actions/auth";


const Login = () => {
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const mutation = useMutation({
  mutationFn: login,
  onSuccess: async () => {
    navigate("/");
  },
  onError: (error) => {
    console.error("LOGIN ERROR:", error);
  },
});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ identifier, password });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input
        type="text"
        placeholder="Email"
        value={identifier}
        onChange={(e) => setIdentifier(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? "Logging in..." : "Login"}
      </button>
    </form>
  );
};

export default Login;