import React, { useState, useEffect } from 'react';

const AdminRoleManager = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/api/promotion/')
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  const promoteToAdmin = (userId) => {
    fetch(`http://localhost:3000/api/promotion/${userId}/role`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ role: 'admin' })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to promote user');
        }
        return response.json();
      })
      .then(data => {
        alert(`User ${data.user.username} has been promoted to admin.`);
        setUsers(users.filter(user => user.id !== userId)); // Remove the promoted user from the list
      })
      .catch(error => console.error('Error updating user role:', error));
  };

  return (
    <div>
      <h2>User Role Management</h2>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            <strong>{user.username}</strong> - Current Role: {user.role}
            <button onClick={() => promoteToAdmin(user.id)}>Promote to Admin</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminRoleManager;
