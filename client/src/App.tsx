import React, { useContext } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { ThemeProvider as StyledThemeProvider } from 'styled-components'
import { UserContext } from './context/UserContext'
import AuthAppRouter from './AuthAppRouter'
import AppRouter from './AppRouter'
import ScrollToTopHook from './hooks/ScrollToTopHook'
import ThemeContext from './context/ThemeContext'
import Footer from './components/Footer'

const App = () => {
  const user: any = useContext(UserContext)
  const theme = useContext(ThemeContext)

  // We are checking if the user context contains a user id (authenticated)
  return (
    <div style={{ backgroundColor: '#f9f9f9' }}>
      <StyledThemeProvider theme={theme}>
        <Router>
          <ScrollToTopHook />
          {!user || !user.user.id || Object.keys(user.user).length === 0 ? <AppRouter /> : <AuthAppRouter />}
          <Footer />
        </Router>
      </StyledThemeProvider>
    </div>
  )
}

export default App
