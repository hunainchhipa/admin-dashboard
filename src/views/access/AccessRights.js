import React, { useState, useEffect } from 'react'
import { FormGroup, Input, Button, Table } from 'reactstrap'
import axios from 'axios'

const AccessRights = () => {
  const [users, setUsers] = useState([])
  const [accessRights, setAccessRights] = useState({})
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('access_token')
      try {
        const response = await axios.get('http://192.168.1.217:8000/api/users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            role: 'librarian',
          },
        })
        const data = response.data.data
        setUsers(data)
        const initialAccessRights = data.reduce((acc, user) => {
          acc[user.id] = {
            dashboard: true,
            librarian: false,
            user: false,
            booking: false,
            books: false,
            googleBooks: false,
          }
          return acc
        }, {})
        setAccessRights(initialAccessRights)
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    }
    fetchUsers()
  }, [])

  const handleAccessChange = (userId, section) => {
    setAccessRights((prevRights) => ({
      ...prevRights,
      [userId]: {
        ...prevRights[userId],
        [section]: !prevRights[userId][section],
      },
    }))
  }

  const handleSave = async () => {
    const token = localStorage.getItem('access_token')
    try {
      debugger
      const response = await axios.post(
        'http://192.168.1.217:8000/api/access-rights',
        accessRights,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      console.log('Access rights saved:', response.data)
    } catch (error) {
      console.error('Error saving access rights:', error)
    }
  }

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
  }

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div>
      <h1>Manage Access Rights</h1>
      <FormGroup>
        <Input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </FormGroup>
      <Table striped>
        <thead>
          <tr>
            <th>User</th>
            <th>Dashboard</th>
            <th>Librarian</th>
            <th>User</th>
            <th>Booking</th>
            <th>Books</th>
            <th>Google Books</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>
                <Input
                  type="checkbox"
                  checked={accessRights[user.id]?.dashboard}
                  onChange={() => handleAccessChange(user.id, 'dashboard')}
                />
              </td>
              <td>
                <Input
                  type="checkbox"
                  checked={accessRights[user.id]?.librarian}
                  onChange={() => handleAccessChange(user.id, 'librarian')}
                />
              </td>
              <td>
                <Input
                  type="checkbox"
                  checked={accessRights[user.id]?.user}
                  onChange={() => handleAccessChange(user.id, 'user')}
                />
              </td>
              <td>
                <Input
                  type="checkbox"
                  checked={accessRights[user.id]?.booking}
                  onChange={() => handleAccessChange(user.id, 'booking')}
                />
              </td>
              <td>
                <Input
                  type="checkbox"
                  checked={accessRights[user.id]?.books}
                  onChange={() => handleAccessChange(user.id, 'books')}
                />
              </td>
              <td>
                <Input
                  type="checkbox"
                  checked={accessRights[user.id]?.googleBooks}
                  onChange={() => handleAccessChange(user.id, 'googleBooks')}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Button color="primary" onClick={handleSave}>
        Save
      </Button>
    </div>
  )
}

export default AccessRights
