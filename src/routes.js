import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Librarian = React.lazy(() => import('./views/librarian/Librarian'))
const User = React.lazy(() => import('./views/user/User'))
const Books = React.lazy(() => import('./views/book/Book'))
const searchBook = React.lazy(() => import('./views/bookSearch/bookSearch'))
const Bookings = React.lazy(() => import('./views/booking/Booking'))
const AccessRights = React.lazy(() => import('./views/access/AccessRights'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/librarian', name: 'Librarian', element: Librarian },
  { path: '/user', name: 'User', element: User },
  { path: '/library/books', name: 'Book', element: Books },
  { path: '/booking', name: 'Booking', element: Bookings },
  { path: '/library/book-search', name: 'Get from Google', element: searchBook },
  { path: '/settings/access-rights', name: 'Access', element: AccessRights },
]

export default routes
