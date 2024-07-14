import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Button, Row, Col } from 'reactstrap'
import GenericTable from './generic/GenericTable'
import Pagination from './Pagination'
import BookingForm from './BookingForm'

const BookingsTable = () => {
  const [bookings, setBookings] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [isCreating, setIsCreating] = useState(false)
  const [currentBooking, setCurrentBooking] = useState(null)
  const [viewForm, setViewForm] = useState(false)

  const bookingColumns = [
    { key: 'customerName', label: 'Customer' },
    { key: 'bookTitles', label: 'Books' },
    { key: 'start_date', label: 'Start Date' },
    { key: 'end_date', label: 'End Date' },
  ]

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('access_token')
      const response = await axios.get('http://192.168.1.217:8000/api/booking_get', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const bookingsData = response.data.data

      const customersResponse = await axios.get('http://192.168.1.217:8000/api/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          role: 'user',
        },
      })

      const booksResponse = await axios.get('http://192.168.1.217:8000/api/books', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const customersMap = new Map(
        customersResponse.data.data.map((customer) => [customer.id, customer.name]),
      )

      const booksMap = new Map(booksResponse.data.data.map((book) => [book.id, book.title]))

      const transformedBookings = bookingsData.map((booking) => ({
        ...booking,
        customerName: customersMap.get(booking.user_id),
        bookTitles: booking.book_data.map((book) => booksMap.get(book.id)).join(', '),
        start_date: booking.start_date,
        end_date: booking.end_date,
      }))

      setBookings(transformedBookings)
    } catch (error) {
      console.error('Error fetching bookings:', error)
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  const handleRowClick = (booking) => {
    setCurrentBooking(booking)
    setIsCreating(false)
    setViewForm(true)
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(Number(value))
    setCurrentPage(1)
  }

  const handleSaveBooking = async (bookingData) => {
    try {
      const token = localStorage.getItem('access_token')
      const formattedData = {
        book_ids: bookingData.books,
        user_id: bookingData.customer,
        start_date: bookingData.start_date,
        end_date: bookingData.end_date,
      }
      if (isCreating) {
        await axios.post('http://192.168.1.217:8000/api/booking_save', formattedData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      } else {
        await axios.put(
          `http://192.168.1.217:8000/api/booking_save/${bookingData.id}`,
          formattedData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
      }
      setViewForm(false)
      fetchBookings()
    } catch (error) {
      console.error('Error saving booking:', error)
    }
  }

  const filteredBookings = bookings // Add any filtering logic if needed

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage)
  const currentBookings = filteredBookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )

  return (
    <div>
      {viewForm ? (
        <BookingForm
          initialData={currentBooking}
          onSave={handleSaveBooking}
          onCancel={() => setViewForm(false)}
        />
      ) : (
        <>
          <Row className="mb-3">
            <Col className="d-flex align-items-end justify-content-end">
              <Button
                color="primary"
                onClick={() => {
                  setIsCreating(true)
                  setCurrentBooking(null)
                  setViewForm(true)
                }}
              >
                Create New Booking
              </Button>
            </Col>
          </Row>
          <GenericTable
            columns={bookingColumns}
            data={currentBookings}
            onRowClick={handleRowClick}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={handleItemsPerPageChange}
            totalRecords={filteredBookings.length}
          />
        </>
      )}
    </div>
  )
}

export default BookingsTable
