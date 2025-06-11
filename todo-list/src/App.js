import './App.css';

import { messaging } from "./firebase";
import { getToken, onMessage } from "firebase/messaging";
import { updateDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { db } from "./firebase";
import {collection, addDoc, deleteDoc, doc, onSnapshot} from "firebase/firestore";

function App() {
  const [input, setInput] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [tasks, setTasks] = useState([]);
  const [completed, setCompleted] = useState([]);

  const tasksRef = collection(db, "tasks");

    useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "tasks"), (snapshot) => {
      const active = [];
      const done = [];

      snapshot.forEach((doc) => {
        const data = doc.data();
        const task = { id: doc.id, ...data };
        if (task.completed) {
          done.push(task);
        } else {
          active.push(task);
        }
      });

      setTasks(active);
      setCompleted(done);
    });

    return () => unsubscribe();
  }, [tasksRef]);

  useEffect(() => {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        getToken(messaging, {
          vapidKey: "BCD4T7N0eWxog1UzzaZZL8mx7CaEPplERt6YbReD3LNUifLc5BKkVXsTH9ERXLuwOzEi4IIfvnL3aF4TCGwL7yc"
        }).then((currentToken) => {
          if (currentToken) {
            console.log("Token FCM:", currentToken);
            // Puedes guardarlo en Firestore si planeas enviar notificaciones desde un servidor
          } else {
            console.log("No se pudo obtener el token.");
          }
        });
      }
  });

  onMessage(messaging, (payload) => {
    console.log("Mensaje en primer plano:", payload);
    alert(payload.notification.title + "\n" + payload.notification.body);
  });
  }, []);

  const addTask = async () => {
    const trimmed = input.trim();
    if (trimmed) {
      await addDoc(tasksRef, {
        texto: trimmed,
        fecha: fecha || null,
        hora: hora || null,
        completed: false
      });
      setInput("");
      setFecha("");
      setHora("");
    }
  };

  const completeTask = async (id) => {
    const taskDoc = doc(db, "tasks", id);
    await updateDoc(taskDoc, {
      completed: true
    });
  };


  return (
    <div className="min-h-screen bg-[#FFF9DB] flex items-center justify-center p-4">
      <div className="bg-white shadow-md rounded-xl p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-blue-600 mb-4">
          Lista de Tareas
        </h1>

        <div className="flex flex-col gap-2 mb-4">
          <input
            type="text"
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Escribe una tarea"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
          />
          <div className="flex gap-2">
            <input
              type="date"
              className="border rounded-lg px-3 py-2 flex-1"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
            />
            <input
              type="time"
              className="border rounded-lg px-3 py-2 flex-1"
              value={hora}
              onChange={(e) => setHora(e.target.value)}
            />
          </div>
          <button
            onClick={addTask}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
          >
            Agregar
          </button>
        </div>

        <h2 className="text-lg font-semibold mb-2">Tareas pendientes:</h2>
        <ul className="space-y-2 mb-4">
          {tasks.length === 0 && (
            <li className="text-gray-500">No hay tareas pendientes</li>
          )}
          {tasks.map((task) => (
            <li
              key={task.id}
              className="flex justify-between items-center bg-gray-200 rounded-lg px-3 py-2"
            >
              <div>
                <span>{task.texto}</span>
                {(task.fecha || task.hora) && (
                  <p className="text-sm text-gray-600">
                    {task.fecha ? `Fecha: ${task.fecha}` : ""}{" "}
                    {task.hora ? `Hora: ${task.hora}` : ""}
                  </p>
                )}
              </div>
              <button
                onClick={() => completeTask(task.id)}
                className="text-green-500 hover:text-green-700"
              >
                ✓
              </button>
            </li>
          ))}
        </ul>

        {completed.length > 0 && (
          <>
            <h2 className="text-lg font-semibold mb-2">Tareas completadas:</h2>
            <ul className="space-y-2 mb-4">
              {completed.map((task) => (
                <li
                  key={task.id}
                  className="flex justify-between items-center bg-green-100 text-green-800 rounded-lg px-3 py-2"
                >
                  <div>
                    <span className="line-through">{task.texto}</span>
                    {(task.fecha || task.hora) && (
                      <p className="text-sm">
                        {task.fecha ? `Fecha: ${task.fecha}` : ""}{" "}
                        {task.hora ? `Hora: ${task.hora}` : ""}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={async () => {
                      const taskDoc = doc(db, "tasks", task.id);
                      await deleteDoc(taskDoc);
                    }}
                    className="ml-4 text-red-500 hover:text-red-700"
                    title="Eliminar tarea"
                    >
                    🗑
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}

export default App;









