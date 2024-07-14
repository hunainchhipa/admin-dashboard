// src/components/GenericForm.js

import React, { useState } from 'react'
import { Form, FormGroup, Label, Input, Button, Row, Col } from 'reactstrap'

const GenericForm = ({ fields = [], initialData = {}, onSave, onCancel }) => {
  const [formData, setFormData] = useState({ ...initialData })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSave = () => {
    onSave(formData)
  }

  return (
    <Form>
      {fields.map((field, index) => (
        <FormGroup key={index}>
          <Label for={field.name}>{field.label}</Label>
          <Input
            type={field.type}
            name={field.name}
            id={field.name}
            value={formData[field.name] || ''}
            onChange={handleChange}
          />
        </FormGroup>
      ))}
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
  )
}

export default GenericForm
