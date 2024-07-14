import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Button, Row, Col } from 'reactstrap'
import GenericTable from './generic/GenericTable'
import GenericSearchBar from './generic/GenericSearchBar'
import Pagination from './Pagination'
import CustomerForm from './CustomerForm'

const CustomerTable = () => {
  const [customers, setCustomers] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [filter, setFilter] = useState('')
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [selectedCustomers, setSelectedCustomers] = useState([])
  const [searchBy, setSearchBy] = useState('name')
  const [suggestions, setSuggestions] = useState([])
  const [currentCustomer, setCurrentCustomer] = useState(null)
  const [isCreating, setIsCreating] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [sortKey, setSortKey] = useState('name')
  const [sortOrder, setSortOrder] = useState('asc')
  const [selectAllCurrentPage, setSelectAllCurrentPage] = useState(false)
  const [selectAllPages, setSelectAllPages] = useState(false)
  const [showSelectAllButton, setShowSelectAllButton] = useState(false)

  const customerColumns = [
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
            role: 'user',
          },
        })

        if (Array.isArray(response.data.data)) {
          setCustomers(response.data.data)
        } else {
          console.error('API response is not an array:', response.data)
        }
      } catch (error) {
        console.error('Error fetching customers:', error)
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
      const filteredSuggestions = customers.filter((customer) =>
        customer[searchBy].toLowerCase().includes(value.toLowerCase()),
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

  const handleRowClick = (customer) => {
    setCurrentCustomer(customer)
    setShowForm(true)
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(Number(value))
    setCurrentPage(1)
  }

  const handleSelectCustomer = (customerId) => {
    if (selectedCustomers.includes(customerId)) {
      setSelectedCustomers(selectedCustomers.filter((id) => id !== customerId))
    } else {
      setSelectedCustomers([...selectedCustomers, customerId])
    }
  }

  const handleSelectAllCurrentPage = () => {
    const currentCustomers = filteredCustomers.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage,
    )

    if (selectAllCurrentPage) {
      setSelectedCustomers(
        selectedCustomers.filter((id) => !currentCustomers.some((customer) => customer.id === id)),
      )
      setSelectAllCurrentPage(false)
    } else {
      const currentIds = currentCustomers.map((customer) => customer.id)
      setSelectedCustomers([...new Set([...selectedCustomers, ...currentIds])])
      setSelectAllCurrentPage(true)
    }
    setShowSelectAllButton(true)
  }

  const handleSelectAllPages = () => {
    if (selectedCustomers.length === customers.length) {
      setSelectedCustomers([])
      setSelectAllPages(false)
    } else {
      setSelectedCustomers(customers.map((customer) => customer.id))
      setSelectAllPages(true)
    }
  }

  const handleDeleteSelected = () => {
    setCustomers(customers.filter((customer) => !selectedCustomers.includes(customer.id)))
    setSelectedCustomers([])
    setSelectAllPages(false)
    setSelectAllCurrentPage(false)
    setShowSelectAllButton(false)
  }

  const handleCustomerUpdate = (updatedCustomer) => {
    if (isCreating) {
      setCustomers([updatedCustomer, ...customers])
      setIsCreating(false)
    } else {
      setCustomers(
        customers.map((customer) =>
          customer.id === updatedCustomer.id ? updatedCustomer : customer,
        ),
      )
    }
    setShowForm(false)
  }

  const handleSort = (key) => {
    const order = sortKey === key && sortOrder === 'asc' ? 'desc' : 'asc'
    setSortKey(key)
    setSortOrder(order)
    setCustomers(
      customers.slice().sort((a, b) => {
        if (order === 'asc') {
          return a[key] > b[key] ? 1 : -1
        } else {
          return a[key] < b[key] ? 1 : -1
        }
      }),
    )
  }

  const filteredCustomers = customers.filter((customer) =>
    customer[searchBy].toLowerCase().includes(filter.toLowerCase()),
  )

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage)
  const currentCustomers = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )

  return (
    <div>
      <Row className="mb-3">
        <Col md={9}>
          <GenericSearchBar
            columns={customerColumns}
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
              setCurrentCustomer({})
              setShowForm(true)
            }}
          >
            Create New Customer
          </Button>
          <Button
            color="danger"
            className="ml-2"
            onClick={handleDeleteSelected}
            disabled={selectedCustomers.length === 0}
          >
            Delete Selected
          </Button>
        </Col>
      </Row>
      <GenericTable
        columns={customerColumns}
        data={currentCustomers}
        onRowClick={handleRowClick}
        selectedItems={selectedCustomers}
        onSelectItem={handleSelectCustomer}
        onSelectAll={handleSelectAllCurrentPage}
        onSort={handleSort}
        sortKey={sortKey}
        sortOrder={sortOrder}
        selectAllCurrentPage={selectAllCurrentPage}
        handleSelectAllCurrentPage={handleSelectAllCurrentPage}
        showSelectAllButton={showSelectAllButton}
        handleSelectAllPages={handleSelectAllPages}
      />
      {showSelectAllButton && totalPages > 1 && (
        <Button size="sm" className="mt-2" onClick={handleSelectAllPages}>
          {selectedCustomers.length === customers.length ? 'Deselect All' : 'Select All'}
        </Button>
      )}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={handleItemsPerPageChange}
        totalRecords={filteredCustomers.length}
      />
      <CustomerForm
        initialData={currentCustomer}
        onSave={handleCustomerUpdate}
        onCancel={() => setShowForm(false)}
        isOpen={showForm}
      />
    </div>
  )
}

export default CustomerTable
