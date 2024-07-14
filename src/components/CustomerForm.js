import React, { useState, useEffect } from 'react'
import {
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Row,
  Col,
} from 'reactstrap'
import axios from 'axios'

const CustomerForm = ({ initialData = {}, onSave, onCancel, isOpen }) => {
  const [formData, setFormData] = useState({ ...initialData })

  useEffect(() => {
    setFormData({ ...initialData })
  }, [initialData])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSave = async () => {
    const token = localStorage.getItem('access_token')
    const customerData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      id: formData.id,
      role: 'user',
    }
    try {
      await axios.post('http://192.168.1.217:8000/api/user_register', customerData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          role: 'user',
        },
      })
      onSave(formData)
    } catch (error) {
      console.error('Error saving customer:', error)
    }
  }

  return (
    <Modal isOpen={isOpen} toggle={onCancel}>
      <ModalHeader toggle={onCancel}>Customer Form</ModalHeader>
      <ModalBody>
        <Form>
          <Input type="hidden" name="id" value={formData.id || ''} />
          <FormGroup>
            <Label for="name">Name</Label>
            <Input
              type="text"
              name="name"
              id="name"
              value={formData.name || ''}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label for="email">Email</Label>
            <Input
              type="email"
              name="email"
              id="email"
              value={formData.email || ''}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label for="phone">Phone</Label>
            <Input
              type="text"
              name="phone"
              id="phone"
              value={formData.phone || ''}
              onChange={handleChange}
            />
          </FormGroup>
          <Row className="d-flex justify-content-end">
            <Col className="d-flex justify-content-end">
              <Button color="secondary" className="mr-2" onClick={onCancel}>
                Cancel
              </Button>
              <Button color="primary" onClick={handleSave}>
                Save
              </Button>
            </Col>
          </Row>
        </Form>
      </ModalBody>
    </Modal>
  )
}

export default CustomerForm
