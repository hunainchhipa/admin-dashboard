import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Button, Row, Col, Modal, ModalHeader, ModalBody } from 'reactstrap'
import GenericTable from './generic/GenericTable'
import GenericSearchBar from './generic/GenericSearchBar'
import Pagination from './Pagination'
import GenericForm from './generic/GenericForm'

const UserTable = () => {
  const [users, setUsers] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [filter, setFilter] = useState('')
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [selectedUsers, setSelectedUsers] = useState([])
  const [searchBy, setSearchBy] = useState('name')
  const [suggestions, setSuggestions] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  const [modal, setModal] = useState(false)
  const [sortKey, setSortKey] = useState('name')
  const [sortOrder, setSortOrder] = useState('asc')
  const [isCreating, setIsCreating] = useState(false)
  const [selectAllCurrentPage, setSelectAllCurrentPage] = useState(false)
  const [selectAllPages, setSelectAllPages] = useState(false)
  const [showSelectAllButton, setShowSelectAllButton] = useState(false)

  const userFields = [
    { name: 'name', label: 'Name', type: 'text' },
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'phone', label: 'Phone', type: 'text' },
    { name: 'role', label: 'Role', type: 'text' },
  ]

  const userColumns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
  ]

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('access_token')
        const response = await axios.get('http://192.168.1.217:8000/api/users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            role: 'librarian',
          },
        })

        if (Array.isArray(response.data.data)) {
          setUsers(response.data.data)
        } else {
          console.error('API response is not an array:', response.data)
        }
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    }

    fetchData()
  }, [])

  const handleSearchByChange = (event) => {
    setSearchBy(event.target.value)
    setFilter('')
    setSuggestions([])
    setCurrentPage(1)
  }

  const handleFilterChange = (event) => {
    const value = event.target.value
    setFilter(value)
    setCurrentPage(1)

    if (value) {
      const filteredSuggestions = users.filter((user) =>
        user[searchBy].toLowerCase().includes(value.toLowerCase()),
      )
      setSuggestions(filteredSuggestions.slice(0, 5))
    } else {
      setSuggestions([])
    }
  }

  const handleSuggestionClick = (suggestion) => {
    setFilter(suggestion[searchBy])
    setSuggestions([])
  }

  const handleRowClick = (user) => {
    setCurrentUser(user)
    setModal(true)
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(Number(value))
    setCurrentPage(1)
  }

  const handleSelectUser = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId))
    } else {
      setSelectedUsers([...selectedUsers, userId])
    }
  }

  const handleSelectAllCurrentPage = () => {
    const currentUsers = filteredUsers.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage,
    )

    if (selectedUsers.length === currentUsers.length) {
      setSelectedUsers([])
      setSelectAllCurrentPage(false)
    } else {
      setSelectedUsers(currentUsers.map((user) => user.id))
      setSelectAllCurrentPage(true)
    }
    setShowSelectAllButton(true)
  }

  const handleSelectAllPages = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([])
      setSelectAllPages(false)
    } else {
      setSelectedUsers(users.map((user) => user.id))
      setSelectAllPages(true)
    }
  }

  const handleDeleteSelected = async () => {
    try {
      const token = localStorage.getItem('access_token')
      const deletePromises = selectedUsers.map((userId) =>
        axios.delete(`http://192.168.1.217:8000/api/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      )
      await Promise.all(deletePromises)
      setUsers(users.filter((user) => !selectedUsers.includes(user.id)))
      setSelectedUsers([])
      setSelectAllPages(false)
      setSelectAllCurrentPage(false)
      setShowSelectAllButton(false)
    } catch (error) {
      console.error('Error deleting users:', error)
    }
  }

  const handleUserUpdate = async (updatedUser) => {
    try {
      const token = localStorage.getItem('access_token')
      if (isCreating) {
        const response = await axios.post('http://192.168.1.217:8000/api/register', updatedUser, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        setUsers([response.data, ...users])
        setIsCreating(false)
      } else {
        const response = await axios.put(
          `http://192.168.1.217:8000/api/register/${updatedUser.id}`,
          updatedUser,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
        setUsers(users.map((user) => (user.id === updatedUser.id ? response.data : user)))
      }
      setModal(false)
    } catch (error) {
      console.error('Error saving user:', error)
    }
  }

  const handleSort = (key) => {
    const order = sortKey === key && sortOrder === 'asc' ? 'desc' : 'asc'
    setSortKey(key)
    setSortOrder(order)
    setUsers(
      users.slice().sort((a, b) => {
        if (order === 'asc') {
          return a[key] > b[key] ? 1 : -1
        } else {
          return a[key] < b[key] ? 1 : -1
        }
      }),
    )
  }

  const filteredUsers = users.filter((user) =>
    user[searchBy].toLowerCase().includes(filter.toLowerCase()),
  )

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
  const currentUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )

  return (
    <div>
      <Row className="mb-3">
        <Col md={9}>
          <GenericSearchBar
            columns={userColumns}
            onSearchChange={handleFilterChange}
            onColumnChange={handleSearchByChange}
            searchTerm={filter}
            searchColumn={searchBy}
            suggestions={suggestions}
            onSuggestionClick={handleSuggestionClick}
          />
        </Col>
        <Col md={3} className="d-flex align-items-end justify-content-end">
          <Button
            color="primary"
            onClick={() => {
              setIsCreating(true)
              setCurrentUser({})
              setModal(true)
            }}
          >
            Create New Record
          </Button>
          <Button
            color="danger"
            className="ml-2"
            onClick={handleDeleteSelected}
            disabled={selectedUsers.length === 0}
          >
            Delete Selected
          </Button>
        </Col>
      </Row>
      <GenericTable
        columns={userColumns}
        data={currentUsers}
        onRowClick={handleRowClick}
        selectedItems={selectedUsers}
        onSelectItem={handleSelectUser}
        onSelectAll={handleSelectAllCurrentPage}
        onSort={handleSort}
        sortKey={sortKey}
        sortOrder={sortOrder}
      />
      {showSelectAllButton && totalPages > 1 && (
        <Button size="sm" className="mt-2" onClick={handleSelectAllPages}>
          {selectedUsers.length === users.length ? 'Deselect All' : 'Select All'}
        </Button>
      )}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={handleItemsPerPageChange}
        totalRecords={filteredUsers.length}
      />
      <Modal isOpen={modal} toggle={() => setModal(!modal)}>
        <ModalHeader toggle={() => setModal(!modal)}>
          {isCreating ? 'Create New User' : 'Edit User'}
        </ModalHeader>
        <ModalBody>
          {currentUser && (
            <GenericForm
              fields={userFields}
              initialData={currentUser}
              onSave={handleUserUpdate}
              onCancel={() => setModal(false)}
            />
          )}
        </ModalBody>
      </Modal>
    </div>
  )
}

export default UserTable
