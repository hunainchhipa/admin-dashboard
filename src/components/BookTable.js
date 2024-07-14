import React, { useState, useEffect } from 'react'
import { Button, Row, Col } from 'reactstrap'
import Pagination from './Pagination'
import axios from 'axios'
import BookForm from './BookForm'
import GenericSearchBar from './generic/GenericSearchBar'
import GenericTable from './generic/GenericTable'

const BookTable = () => {
  const [books, setBooks] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [filter, setFilter] = useState('')
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [selectedBooks, setSelectedBooks] = useState([])
  const [searchBy, setSearchBy] = useState('title')
  const [suggestions, setSuggestions] = useState([])
  const [currentBook, setCurrentBook] = useState(null)
  const [isCreating, setIsCreating] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [sortKey, setSortKey] = useState('title')
  const [sortOrder, setSortOrder] = useState('asc')
  const [selectAllCurrentPage, setSelectAllCurrentPage] = useState(false)
  const [selectAllPages, setSelectAllPages] = useState(false)
  const [showSelectAllButton, setShowSelectAllButton] = useState(false)

  const bookColumns = [
    { key: 'title', label: 'Title' },
    { key: 'author', label: 'Author' },
    { key: 'publisher', label: 'Publisher' },
    { key: 'year', label: 'Year' },
    { key: 'quantity', label: 'Quantity' },
  ]

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('access_token')
        const response = await axios.get('http://192.168.1.217:8000/api/books', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        setBooks(response.data.data)
      } catch (error) {
        console.error('Error fetching books:', error)
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
      const filteredSuggestions = books.filter((book) =>
        book[searchBy]?.toLowerCase().includes(value.toLowerCase()),
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

  const handleRowClick = (book) => {
    setCurrentBook(book)
    setShowForm(true)
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(Number(value))
    setCurrentPage(1)
  }

  const handleSelectBook = (bookId) => {
    if (selectedBooks.includes(bookId)) {
      setSelectedBooks(selectedBooks.filter((id) => id !== bookId))
    } else {
      setSelectedBooks([...selectedBooks, bookId])
    }
  }

  const handleSelectAllCurrentPage = () => {
    const currentBooks = filteredBooks.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage,
    )

    if (selectAllCurrentPage) {
      setSelectedBooks(selectedBooks.filter((id) => !currentBooks.some((book) => book.id === id)))
      setSelectAllCurrentPage(false)
    } else {
      const currentIds = currentBooks.map((book) => book.id)
      setSelectedBooks([...new Set([...selectedBooks, ...currentIds])])
      setSelectAllCurrentPage(true)
    }
    setShowSelectAllButton(true)
  }

  const handleSelectAllPages = () => {
    if (selectedBooks.length === books.length) {
      setSelectedBooks([])
      setSelectAllPages(false)
    } else {
      setSelectedBooks(books.map((book) => book.id))
      setSelectAllPages(true)
    }
  }

  const handleDeleteSelected = () => {
    setBooks(books.filter((book) => !selectedBooks.includes(book.id)))
    setSelectedBooks([])
    setSelectAllPages(false)
    setSelectAllCurrentPage(false)
    setShowSelectAllButton(false)
  }

  const handleBookUpdate = (updatedBook) => {
    if (isCreating) {
      setBooks([updatedBook, ...books])
      setIsCreating(false)
    } else {
      setBooks(books.map((book) => (book.id === updatedBook.id ? updatedBook : book)))
    }
    setShowForm(false)
  }

  const handleSort = (key) => {
    const order = sortKey === key && sortOrder === 'asc' ? 'desc' : 'asc'
    setSortKey(key)
    setSortOrder(order)
    setBooks(
      books.slice().sort((a, b) => {
        if (order === 'asc') {
          return a[key] > b[key] ? 1 : -1
        } else {
          return a[key] < b[key] ? 1 : -1
        }
      }),
    )
  }

  const filteredBooks = books.filter((book) =>
    book[searchBy]?.toLowerCase().includes(filter.toLowerCase()),
  )

  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage)
  const currentBooks = filteredBooks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )

  return (
    <div>
      <Row className="mb-3">
        <Col md={9}>
          <GenericSearchBar
            columns={bookColumns}
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
              setCurrentBook({})
              setShowForm(true)
            }}
          >
            Create New Book
          </Button>
          <Button
            color="danger"
            className="ml-2"
            onClick={handleDeleteSelected}
            disabled={selectedBooks.length === 0}
          >
            Delete Selected
          </Button>
        </Col>
      </Row>
      {showForm ? (
        <BookForm
          initialData={currentBook}
          onSave={handleBookUpdate}
          onCancel={() => setShowForm(false)}
        />
      ) : (
        <div>
          <GenericTable
            columns={bookColumns}
            data={currentBooks}
            onRowClick={handleRowClick}
            selectedItems={selectedBooks}
            onSelectItem={handleSelectBook}
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
              {selectedBooks.length === books.length ? 'Deselect All' : 'Select All'}
            </Button>
          )}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={handleItemsPerPageChange}
            totalRecords={filteredBooks.length}
          />
        </div>
      )}
    </div>
  )
}

export default BookTable
