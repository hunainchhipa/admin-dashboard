import React from 'react'
import { Table, Input } from 'reactstrap'

const GenericTable = ({
  columns = [],
  data = [],
  onRowClick,
  selectedItems = [],
  onSelectItem,
  onSelectAll,
  onSort,
  sortKey,
  sortOrder,
}) => {
  const handleSort = (key) => {
    onSort(key)
  }

  return (
    <Table striped>
      <thead>
        <tr>
          <th>
            <Input
              type="checkbox"
              checked={selectedItems.length >= data.length}
              onChange={onSelectAll}
            />
          </th>
          {columns.map((col, index) => (
            <th key={index} onClick={() => handleSort(col.key)}>
              {col.label}
              {sortKey === col.key && (sortOrder === 'asc' ? ' 🔼' : ' 🔽')}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item.id} onClick={() => onRowClick(item)}>
            <td>
              <Input
                type="checkbox"
                checked={selectedItems.includes(item.id)}
                onChange={() => onSelectItem(item.id)}
                onClick={(e) => e.stopPropagation()}
              />
            </td>
            {columns.map((col, index) => (
              <td key={index}>{item[col.key]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  )
}

export default GenericTable
