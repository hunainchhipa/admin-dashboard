import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CAlert,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser, cibGoogle } from '@coreui/icons'
import axios from 'axios'
import { auth, googleProvider } from '../../../firebaseConfig'
import { signInWithPopup } from 'firebase/auth'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const fetchAccessRights = async (token) => {
    try {
      const response = await axios.get('http://192.168.1.217:8000/api/access-rights', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      localStorage.setItem('access_rights', JSON.stringify(response.data.data))
    } catch (error) {
      console.error('Error fetching access rights:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await axios.post('http://192.168.1.217:8000/api/login', {
        email,
        password,
      })

      // Handle successful login (e.g., store token, redirect)
      const { token, uid } = response.data
      localStorage.setItem('access_token', token)
      localStorage.setItem('uid', uid)

      // Fetch and store access rights
      await fetchAccessRights(token)

      navigate('/')
    } catch (error) {
      setError('Failed to log in')
    }

    setLoading(false)
  }

  const handleGoogleSignIn = async () => {
    setLoading(true)
    setError('')

    try {
      const result = await signInWithPopup(auth, googleProvider)
      const user = result.user
      console.log(result)
      const response = await axios.post('http://192.168.1.217:8000/api/google_register', {
        displayName: user.displayName,
        email: user.email,
      })

      if (response.status === 200) {
        const { token, uid } = response.data
        localStorage.setItem('access_token', token)
        localStorage.setItem('uid', uid)

        // Fetch and store access rights
        await fetchAccessRights(token)

        navigate('/')
      }
    } catch (error) {
      setError('Failed to sign in with Google')
    }

    setLoading(false)
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={handleSubmit}>
                    <h1>Login</h1>
                    <p className="text-body-secondary">Sign In to your account</p>
                    {error && <CAlert color="danger">{error}</CAlert>}
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="Email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CButton color="link" className="px-0">
                          Forgot password?
                        </CButton>
                      </CCol>
                      <CCol
                        xs={6}
                        className="text-right d-flex justify-content-end align-items-center"
                      >
                        <CButton color="primary" className="px-4" type="submit" disabled={loading}>
                          {loading ? 'Logging in...' : 'Login'}
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                  <div className="d-grid mt-3">
                    <CButton
                      className="text-white p-2"
                      color="danger"
                      onClick={handleGoogleSignIn}
                      disabled={loading}
                    >
                      <CIcon icon={cibGoogle} className="me-2" />
                      Sign In with Google
                    </CButton>
                  </div>
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>Sign up</h2>
                    <p>
                      Checkout the library admin dashboard and for that please click on below
                      button.
                    </p>
                    <Link to="/register">
                      <CButton color="primary" className="mt-3" active tabIndex={-1}>
                        Register Now!
                      </CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
