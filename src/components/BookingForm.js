import React, { useState, useEffect } from 'react'
import Select from 'react-select'
import { Button, Form, FormGroup, Label, Input } from 'reactstrap'
import axios from 'axios'

const BookingForm = ({ initialData, onSave, onCancel }) => {
  const [customers, setCustomers] = useState([])
  const [books, setBooks] = useState([])
  const [formData, setFormData] = useState({
    customer: '',
    books: [],
    startDate: '',
    endDate: '',
  })

  useEffect(() => {
    const token = localStorage.getItem('access_token')

    axios
      .get('http://192.168.1.217:8000/api/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          role: 'user',
        },
      })
      .then((response) => {
        setCustomers(
          response.data.data.map((customer) => ({ value: customer.id, label: customer.name })),
        )
      })
      .catch((error) => {
        console.error('Error fetching customers:', error)
      })

    axios
      .get('http://192.168.1.217:8000/api/books', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setBooks(response.data.data.map((book) => ({ value: book.id, label: book.title })))
      })
      .catch((error) => {
        console.error('Error fetching books:', error)
      })
  }, [])

  useEffect(() => {
    if (initialData) {
      setFormData({
        customer: initialData.user_id,
        books: initialData.book_data.map((book) => ({ value: book.id, label: book.title })),
        startDate: initialData.start_date,
        endDate: initialData.end_date,
      })
    }
  }, [initialData])

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value })
  }

  const handleSelectChange = (name, selectedOption) => {
    handleChange(name, selectedOption)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const formattedData = {
      customer: formData.customer.value,
      books: formData.books.map((book) => book.value),
      start_date: formData.startDate,
      end_date: formData.endDate,
    }
    await onSave(formattedData)
  }

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup>
        <Label for="customer">Customer</Label>
        <Select
          id="customer"
          value={customers.find((customer) => customer.value === formData.customer)}
          options={customers}
          onChange={(selectedOption) => handleSelectChange('customer', selectedOption)}
        />
      </FormGroup>
      <FormGroup>
        <Label for="books">Books</Label>
        <Select
          id="books"
          isMulti
          value={formData.books}
          options={books}
          onChange={(selectedOptions) => handleSelectChange('books', selectedOptions)}
        />
      </FormGroup>
      <FormGroup>
        <Label for="startDate">Start Date</Label>
        <Input
          type="date"
          id="startDate"
          value={formData.startDate}
          onChange={(e) => handleChange('startDate', e.target.value)}
        />
      </FormGroup>
      <FormGroup>
        <Label for="endDate">End Date</Label>
        <Input
          type="date"
          id="endDate"
          value={formData.endDate}
          onChange={(e) => handleChange('endDate', e.target.value)}
        />
      </FormGroup>
      <Button color="primary" type="submit">
        Save
      </Button>
      <Button color="secondary" onClick={onCancel} className="ml-2">
        Cancel
      </Button>
    </Form>
  )
}

export default BookingForm
