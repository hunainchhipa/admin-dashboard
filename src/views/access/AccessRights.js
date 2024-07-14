import React, { useState, useEffect } from 'react'
import { Form, FormGroup, Label, Input, Button, Table } from 'reactstrap'
import generateDemoData from '../../utils/generateDemoData' // Replace with actual data generation for users

const AccessRights = () => {
  const [users, setUsers] = useState([])
  const [accessRights, setAccessRights] = useState({})
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const data = generateDemoData(10) // Generate 10 demo users
    setUsers(data)
    const initialAccessRights = data.reduce((acc, user) => {
      acc[user.id] = { dashboard: true, user: false, customer: false, sale: false }
      return acc
    }, {})
    setAccessRights(initialAccessRights)
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

  const handleSave = () => {
    // Save access rights to backend or local storage
    console.log('Access rights saved:', accessRights)
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
            <th>User</th>
            <th>Customer</th>
            <th>Sale</th>
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
                  checked={accessRights[user.id]?.user}
                  onChange={() => handleAccessChange(user.id, 'user')}
                />
              </td>
              <td>
                <Input
                  type="checkbox"
                  checked={accessRights[user.id]?.customer}
                  onChange={() => handleAccessChange(user.id, 'customer')}
                />
              </td>
              <td>
                <Input
                  type="checkbox"
                  checked={accessRights[user.id]?.sale}
                  onChange={() => handleAccessChange(user.id, 'sale')}
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
