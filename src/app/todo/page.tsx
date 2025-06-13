"use client";
import { useState } from "react";

export default function Todo() {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState<string[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTodo(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (todo.trim()) {
      setTodos([...todos, todo]);
      setTodo("");
    }
  };

  // 삭제 기능
  const handleDelete = (index: number) => {
    const newTodos = todos.filter((_, i) => i !== index);
    setTodos(newTodos);
  };

  // 수정 시작
  const handleEditStart = (index: number) => {
    setEditingIndex(index);
    setEditingValue(todos[index]);
  };

  // 수정 완료
  const handleEditComplete = (index: number) => {
    if (editingValue.trim()) {
      const newTodos = [...todos];
      newTodos[index] = editingValue;
      setTodos(newTodos);
    }
    setEditingIndex(null);
    setEditingValue("");
  };

  // 수정 취소
  const handleEditCancel = () => {
    setEditingIndex(null);
    setEditingValue("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  const handleEditKeyPress = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Enter") {
      handleEditComplete(index);
    } else if (e.key === "Escape") {
      handleEditCancel();
    }
  };

  return (
    <div>
      <h1>Todo List</h1>

      <div>
        <div>
          <input
            type="text"
            value={todo}
            onChange={handleChange}
            onKeyDown={handleKeyPress}
            placeholder="새 할 일을 입력하세요"
          />
          <button onClick={handleSubmit}>Add</button>
        </div>
      </div>

      <ul>
        {todos.map((todoItem, index) => (
          <li key={index}>
            {editingIndex === index ? (
              // 수정 모드
              <>
                <input
                  type="text"
                  value={editingValue}
                  onChange={(e) => setEditingValue(e.target.value)}
                  onKeyDown={(e) => handleEditKeyPress(e, index)}
                  autoFocus
                />
                <button onClick={() => handleEditComplete(index)}>완료</button>
                <button onClick={handleEditCancel}>취소</button>
              </>
            ) : (
              <>
                <span>{todoItem}</span>
                <button onClick={() => handleEditStart(index)}>수정</button>
                <button onClick={() => handleDelete(index)}>삭제</button>
              </>
            )}
          </li>
        ))}
      </ul>

      {todos.length === 0 && <p>할 일이 없습니다.</p>}
    </div>
  );
}
