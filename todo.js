import React, { useState, useEffect } from 'react'

const API_BASE_URL = 'http://localhost:8080' // Adjust endpoint as needed

export default function TodoApp () {
  const [todos, setTodos] = useState([])
  const [name, setName] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editingName, setEditingName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // --- API Functions ---

  // GET: Get All Todos
  const fetchAllTodos = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`http://localhost:8080/find-items`)
      if (!response.ok) throw new Error('Failed to fetch todos')
      const data = await response.json()
      setTodos(data.data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // GET: Get One Todo by ID
  const fetchTodoById = async id => {
    setError(null)
    try {
      const response = await fetch(`${API_BASE_URL}/get-item/${id}`)
      if (!response.ok) throw new Error('Failed to fetch todo')
      const data = await response.json()
      alert(`Fetched Todo: ID: ${data.id}, Name: ${data.name}`)
    } catch (err) {
      setError(err.message)
    }
  }  

  // POST: Create Todo
  const createTodo = async e => {
    e.preventDefault()
    if (!name.trim()) return
    setError(null)

   
      const response = await fetch(`http://localhost:8080/add-item`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name })
      })
      if (!response.ok) throw new Error('Failed to create todo')

      setName('')
      fetchAllTodos()
    
  }

  // PUT / PATCH: Update Todo
  const updateTodo = async id => {
    if (!editingName.trim()) return
    setError(null)

    try {
      const response = await fetch(`${API_BASE_URL}/update-item/${id}`, {
        method: 'POST', // or 'PATCH' depending on your backend
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editingName })
      })
      if (!response.ok) throw new Error('Failed to update todo')

      setEditingId(null)
      setEditingName('')
      fetchAllTodos()
    } catch (err) {
      setError(err.message)
    }
  }

  // DELETE: Delete One Todo
  const deleteTodo = async id => {
    setError(null)
    try {
      const response = await fetch(`${API_BASE_URL}/delete-item/${id}`, {
        method: 'DELETE'
      })
      if (!response.ok) throw new Error('Failed to delete todo')

      fetchAllTodos()
    } catch (err) {
      setError(err.message)
    }
  }

  // Load all todos on component mount
  useEffect(() => {
    fetchAllTodos()
  }, [])

  // --- Render --- 

  return (
    <div
      style={{
        maxWidth: '600px',
        margin: '40px auto',
        fontFamily: 'Arial, sans-serif',
        padding: '20px',
        border: '1px solid #ddd',
        borderRadius: '8px'
      }}
    >
      <h2>TODO Application (React + Port 8080)</h2>

      {error && (
        <div
          style={{
            background: '#ffebee',
            color: '#c62828',
            padding: '10px',
            marginBottom: '15px',
            borderRadius: '4px'
          }}
        >
          Error: {error}
        </div>
      )}

      {/* Create Form */}
      <form
        onSubmit={createTodo}
        style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}
      >
        <input
          type='text'
          placeholder='Enter todo name...'
          value={name}
          onChange={e => setName(e.target.value)}
          style={{ flex: 1, padding: '8px', fontSize: '16px' }}
        />
        <button
          type='submit'
          style={{
            padding: '8px 16px',
            background: '#007BFF',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Add Todo
        </button>
      </form>

      <button
        onClick={fetchAllTodos}
        style={{ marginBottom: '15px', padding: '6px 12px', cursor: 'pointer' }}
      >
        Refresh All
      </button>

      {loading && <p>Loading...</p>}

      {/* Todo List */}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {todos.map(todo => (
          <li
            key={todo.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px',
              borderBottom: '1px solid #eee'
            }}
          >
            {editingId === todo.id ? (
              <div
                style={{
                  display: 'flex',
                  gap: '10px',
                  flex: 1,
                  marginRight: '10px'
                }}
              >
                <input
                  type='text'
                  value={editingName}
                  onChange={e => setEditingName(e.target.value)}
                  style={{ flex: 1, padding: '6px' }}
                />
                <button
                  onClick={() => updateTodo(todo.id)}
                  style={{
                    background: '#28a745',
                    color: '#fff',
                    border: 'none',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setEditingId(null)
                    setEditingName('')
                  }}
                  style={{
                    background: '#6c757d',
                    color: '#fff',
                    border: 'none',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  flex: 1
                }}
              >
                <span style={{ fontWeight: 'bold', color: '#555' }}>
                  [{todo.id}]
                </span>
                <span>{todo.name}</span>
              </div>
            )}

            {editingId !== todo.id && (
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  onClick={() => fetchTodoById(todo.id)}
                  style={{ padding: '4px 8px', cursor: 'pointer' }}
                >
                  Get One
                </button>
                <button
                  onClick={() => {
                    setEditingId(todo.id)
                    setEditingName(todo.name)
                  }}
                  style={{
                    padding: '4px 8px',
                    background: '#ffc107',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  style={{
                    padding: '4px 8px',
                    background: '#dc3545',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Delete
                </button>
              </div>
            )}
          </li>
        ))}
        {todos.length === 0 && !loading && (
          <p style={{ color: '#777' }}>No todos found.</p>
        )}
      </ul>
    </div>
  )
}
