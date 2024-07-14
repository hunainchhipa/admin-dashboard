import React, { useState } from 'react'
import axios from 'axios'
import { Button, Form, FormGroup, Label, Input, ListGroup, ListGroupItem } from 'reactstrap'
import BookForm from './BookForm'

const SearchBooksPage = () => {
  const [query, setQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [selectedBook, setSelectedBook] = useState(null)
  const [showBookForm, setShowBookForm] = useState(false)

  const handleSearch = async () => {
    const token = localStorage.getItem('access_token')
    try {
      const response = await axios.post(
        'http://192.168.1.217:8000/api/search_google_api',
        { query },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      setSearchResults(response.data.data)
    } catch (error) {
      console.error('Error searching books:', error)
    }
  }

  const handleSelectBook = (book) => {
    setSelectedBook(book)
    setShowBookForm(true)
  }

  const handleSaveBook = (savedBook) => {
    // Implement the logic to save the selected book into your collection
    // You can send a POST request to your server with the savedBook data
    setShowBookForm(false)
    setSearchResults([]) // Clear search results after adding the book
    setQuery('') // Reset the query input
  }

  return (
    <div>
      <Form
        inline
        onSubmit={(e) => {
          e.preventDefault()
          handleSearch()
        }}
      >
        <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
          <Label for="query" className="mr-sm-2">
            Search Book
          </Label>
          <div className="d-flex gap-2">
            <Input
              type="text"
              name="query"
              id="query"
              placeholder="Enter book name"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Button color="primary" onClick={handleSearch}>
              Search
            </Button>
          </div>
        </FormGroup>
      </Form>
      <ListGroup className="mt-4">
        {searchResults.map((book) => (
          <ListGroupItem key={book.id} className="d-flex justify-content-between">
            {book.title} by {book.author}
            <div>
              <Button
                color="success"
                size="sm"
                className="ml-3 text-white"
                onClick={() => handleSelectBook(book)}
              >
                Add
              </Button>
            </div>
          </ListGroupItem>
        ))}
      </ListGroup>
      {showBookForm && (
        <BookForm
          initialData={selectedBook}
          onSave={handleSaveBook}
          onCancel={() => setShowBookForm(false)}
        />
      )}
    </div>
  )
}

export default SearchBooksPage
