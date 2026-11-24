import { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ maxWidth: 360, margin: "80px auto", textAlign: "left" }}>
      <h1>{isRegister ? "Create account" : "Login"}</h1>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password (min 6 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />
        <button type="submit" disabled={busy}>
          {busy ? "Please wait..." : isRegister ? "Register" : "Login"}
        </button>
      </form>
      {error && <p style={{ color: "crimson" }}>{error}</p>}
      <p>
        {isRegister ? "Already have an account?" : "No account yet?"}{" "}
        <button type="button" onClick={() => setIsRegister(!isRegister)}>
          {isRegister ? "Login" : "Register"}
        </button>
      </p>
    </div>
  );
}

export default Login;
