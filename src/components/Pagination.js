// src/components/Pagination.js

import React from 'react'
import { Pagination as BSPagination, PaginationItem, PaginationLink, Input } from 'reactstrap'

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  onItemsPerPageChange,
  totalRecords,
}) => {
  const pages = [...Array(totalPages).keys()].map((num) => num + 1)

  return (
    <div className="d-flex justify-content-between align-items-center mt-3">
      <div>
        <BSPagination aria-label="Page navigation example">
          <PaginationItem disabled={currentPage === 1}>
            <PaginationLink first onClick={() => onPageChange(1)} />
          </PaginationItem>
          <PaginationItem disabled={currentPage === 1}>
            <PaginationLink previous onClick={() => onPageChange(currentPage - 1)} />
          </PaginationItem>
          {pages.map((page) => (
            <PaginationItem key={page} active={page === currentPage}>
              <PaginationLink onClick={() => onPageChange(page)}>{page}</PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem disabled={currentPage === totalPages}>
            <PaginationLink next onClick={() => onPageChange(currentPage + 1)} />
          </PaginationItem>
          <PaginationItem disabled={currentPage === totalPages}>
            <PaginationLink last onClick={() => onPageChange(totalPages)} />
          </PaginationItem>
        </BSPagination>
      </div>
      <div className="d-flex align-items-center">
        <span className="mr-2">Items per page:</span>
        <Input
          type="select"
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
          className="d-inline-block w-auto"
        >
          {[5, 10, 20, 50].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </Input>
        <span className="ml-3">Total records: {totalRecords}</span>
      </div>
    </div>
  )
}

export default Pagination
