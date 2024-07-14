import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CWidgetStatsA,
} from '@coreui/react'
import Chart from 'react-apexcharts'

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null)

  const fetchDashboardData = async () => {
    const token = localStorage.getItem('access_token')
    const response = await axios.get('http://192.168.1.217:8000/api/dashboard', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    setDashboardData(response.data.data)
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  if (!dashboardData) {
    return <div>Loading...</div>
  }

  const chartOptions = {
    chart: {
      type: 'line',
    },
    xaxis: {
      categories: dashboardData.dates,
    },
    yaxis: {
      title: {
        text: 'Books',
      },
    },
    stroke: {
      curve: 'smooth',
    },
  }

  const chartSeries = [
    {
      name: 'Books',
      data: dashboardData.book_date_array,
    },
  ]

  return (
    <>
      <CRow>
        <CCol sm="6" lg="3">
          <CWidgetStatsA
            className="mb-4"
            color="primary"
            title="Top Book"
            value={dashboardData.most_getting_book_name}
          />
        </CCol>
        <CCol sm="6" lg="3">
          <CWidgetStatsA
            className="mb-4"
            color="info"
            title="Earned Last Week"
            value={`$${dashboardData.earned_last_week}`}
          />
        </CCol>
        <CCol sm="6" lg="3">
          <CWidgetStatsA
            className="mb-4"
            color="warning"
            title="Difference Last 2 Weeks"
            value={`$${dashboardData.different_between_last2_weeks}`}
          />
        </CCol>
        <CCol sm="6" lg="3">
          <CWidgetStatsA
            className="mb-4"
            color="danger"
            title="Top User"
            value={`${dashboardData.most_occuring_user_name} ($${dashboardData.most_occuring_user_amount})`}
          />
        </CCol>
      </CRow>

      <CRow>
        <CCol>
          <CCard className="mb-4">
            <CCardHeader>Books Trend</CCardHeader>
            <CCardBody>
              <Chart options={chartOptions} series={chartSeries} type="line" height={350} />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CRow>
        <CCol xs="12" lg="6">
          <CCard className="mb-4">
            <CCardHeader>Most Favorite Books This Month</CCardHeader>
            <CCardBody>
              <CTable hover responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Title</CTableHeaderCell>
                    <CTableHeaderCell>Author</CTableHeaderCell>
                    <CTableHeaderCell>Genre</CTableHeaderCell>
                    {/* <CTableHeaderCell>Quantity</CTableHeaderCell> */}
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {dashboardData.book_data.map((book) => (
                    <CTableRow key={book.id}>
                      <CTableDataCell>{book.title}</CTableDataCell>
                      <CTableDataCell>{book.author}</CTableDataCell>
                      <CTableDataCell>{book.genre}</CTableDataCell>
                      {/* <CTableDataCell>{book.quantity}</CTableDataCell> */}
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs="12" lg="6">
          <CCard className="mb-4">
            <CCardHeader>User Data</CCardHeader>
            <CCardBody>
              <CTable hover responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>User Name</CTableHeaderCell>
                    <CTableHeaderCell>Amount Paid</CTableHeaderCell>
                    <CTableHeaderCell>Last Booking Date</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {dashboardData.user_data.map((user, index) => (
                    <CTableRow key={index}>
                      <CTableDataCell>{user.user_name}</CTableDataCell>
                      <CTableDataCell>{user.amount_pay}</CTableDataCell>
                      <CTableDataCell>
                        {new Date(user.last_booking_date).toLocaleDateString()}
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Dashboard
