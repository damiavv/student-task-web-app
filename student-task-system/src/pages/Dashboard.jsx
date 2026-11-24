import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { auth, db, functions } from "../firebase";

const createTask = httpsCallable(functions, "createTask");
const toggleTask = httpsCallable(functions, "toggleTask");
const deleteTask = httpsCallable(functions, "deleteTask");

function Dashboard({ user }) {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const q = query(collection(db, "tasks"), where("uid", "==", user.uid));
    return onSnapshot(
      q,
      (snap) => {
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        list.sort(
          (a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0),
        );
        setTasks(list);
      },
      (err) => setMessage(err.message),
    );
  }, [user.uid]);

  async function run(fn, data) {
    setMessage("");
    try {
      const res = await fn(data);
      if (res.data?.message) setMessage(res.data.message);
      return true;
    } catch (err) {
      setMessage(err.message);
      return false;
    }
  }

  async function handleAdd(e) {
    e.preventDefault();
    if (await run(createTask, { title })) setTitle("");
  }

  return (
    <div style={{ maxWidth: 560, margin: "40px auto", textAlign: "left" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>My Tasks</h1>
        <button onClick={() => signOut(auth)}>Logout</button>
      </div>
      <p>Signed in as {user.email}</p>

      <form onSubmit={handleAdd} style={{ display: "flex", gap: 8 }}>
        <input
          style={{ flex: 1 }}
          placeholder="New task"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={100}
          required
        />
        <button type="submit">Add</button>
      </form>

      {message && <p>{message}</p>}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {tasks.map((t) => (
          <li
            key={t.id}
            style={{ display: "flex", gap: 8, alignItems: "center", padding: 4 }}
          >
            <input
              type="checkbox"
              checked={t.completed}
              onChange={() => run(toggleTask, { taskId: t.id })}
            />
            <span
              style={{
                flex: 1,
                textDecoration: t.completed ? "line-through" : "none",
              }}
            >
              {t.title}
            </span>
            <button onClick={() => run(deleteTask, { taskId: t.id })}>
              Delete
            </button>
          </li>
        ))}
        {tasks.length === 0 && <li>No tasks yet.</li>}
      </ul>
    </div>
  );
}

export default Dashboard;
