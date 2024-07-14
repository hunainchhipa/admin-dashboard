import React, { useEffect, useRef } from 'react'
import { ListGroup, ListGroupItem } from 'reactstrap'

const getUniqueSuggestions = (suggestions, searchColumn) => {
  const uniqueSuggestions = []
  const seenValues = new Set()

  suggestions.forEach((suggestion) => {
    const value = suggestion[searchColumn]
    if (!seenValues.has(value)) {
      seenValues.add(value)
      uniqueSuggestions.push(suggestion)
    }
  })

  return uniqueSuggestions
}

const GenericSearchBar = ({
  columns,
  onSearchChange,
  onColumnChange,
  searchTerm,
  searchColumn,
  suggestions,
  onSuggestionClick,
}) => {
  const searchRef = useRef(null)

  useEffect(() => {
    searchRef.current.focus()
  }, [searchColumn])
  const uniqueSuggestions = getUniqueSuggestions(suggestions, searchColumn)

  return (
    <div className="d-flex justify-content-between align-items-center mb-2">
      <div className="me-2" style={{ maxWidth: '200px' }}>
        <select className="form-select" onChange={onColumnChange} value={searchColumn}>
          {columns.map((col, index) => (
            <option key={index} value={col.key}>
              {col.label}
            </option>
          ))}
        </select>
      </div>
      <div className="flex-grow-1" style={{ position: 'relative' }}>
        <input
          type="search"
          className="form-control"
          placeholder="Search here..."
          value={searchTerm}
          onChange={onSearchChange}
          ref={searchRef}
        />
        {uniqueSuggestions.length > 0 && searchTerm && (
          <ListGroup
            style={{
              position: 'absolute',
              zIndex: 1,
              listStyle: 'none',
              width: '100%',
              padding: 0,
              margin: 0,
              border: '1px solid #ccc',
              backgroundColor: 'white',
              color: 'black',
            }}
          >
            {uniqueSuggestions.map((suggestion, index) => (
              <ListGroupItem
                key={index}
                style={{ cursor: 'pointer' }}
                onClick={() => onSuggestionClick(suggestion)}
              >
                {suggestion[searchColumn]}
              </ListGroupItem>
            ))}
          </ListGroup>
        )}
      </div>
    </div>
  )
}

export default GenericSearchBar
