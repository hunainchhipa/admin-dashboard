import React, { useState, useEffect } from 'react'
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  Row,
  Col,
} from 'reactstrap'

const BookForm = ({ initialData = {}, onSave, onCancel }) => {
  const [formData, setFormData] = useState(initialData)
  const [imagePreview, setImagePreview] = useState(null)

  useEffect(() => {
    if (initialData.image) {
      setImagePreview(initialData.image)
    }
  }, [initialData])

  const handleChange = (e) => {
    const { name, value, type, files } = e.target
    if (type === 'file' && files[0]) {
      setFormData({ ...formData, [name]: files[0] })
      setImagePreview(URL.createObjectURL(files[0]))
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('access_token')
    const formDataToSend = new FormData()

    for (const key in formData) {
      if (formData.hasOwnProperty(key)) {
        formDataToSend.append(key, formData[key])
      }
    }

    try {
      const response = await fetch('http://192.168.1.217:8000/api/books', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      })

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const data = await response.json()
      onSave(data)
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error)
    }
  }

  return (
    <Modal isOpen={true} toggle={onCancel}>
      <ModalHeader toggle={onCancel}>Book Form</ModalHeader>
      <ModalBody>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label for="isbn">ISBN</Label>
            <Input
              type="text"
              name="isbn"
              id="isbn"
              value={formData.isbn || ''}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label for="title">Title</Label>
            <Input
              type="text"
              name="title"
              id="title"
              value={formData.title || ''}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label for="author">Author</Label>
            <Input
              type="text"
              name="author"
              id="author"
              value={formData.author || ''}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label for="publisher">Publisher</Label>
            <Input
              type="text"
              name="publisher"
              id="publisher"
              value={formData.publisher || ''}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label for="year">Year</Label>
            <Input
              type="number"
              name="year"
              id="year"
              value={formData.year || ''}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label for="genre">Genre</Label>
            <Input
              type="text"
              name="genre"
              id="genre"
              value={formData.genre || ''}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label for="quantity">Quantity</Label>
            <Input
              type="number"
              name="quantity"
              id="quantity"
              value={formData.quantity || ''}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label for="image">Image</Label>
            <Input type="file" name="image" id="image" onChange={handleChange} />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                style={{ marginTop: '10px', maxHeight: '200px' }}
              />
            )}
          </FormGroup>
          <Button type="submit">Submit</Button>
          <Button type="button" onClick={onCancel} className="ml-2">
            Cancel
          </Button>
        </Form>
      </ModalBody>
    </Modal>
  )
}

export default BookForm
