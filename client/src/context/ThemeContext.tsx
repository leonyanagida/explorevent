import React, { useState, createContext } from 'react'

const lightTheme = {
  primaryColor: '#262626',
  secondaryColor: '#B2B2B2',
  bg: '#FFFFFF',
  blue: '#0095F6',
  red: '#ED4956',
  white: '#FFF',
  borderColor: '#DBDBDB',
  borderRadius: '4px',
}

const darkTheme = {
  primaryColor: '#262626',
  secondaryColor: '#B2B2B2',
  bg: '#231f20',
  blue: '#0095F6',
  red: '#ED4956',
  white: '#FFF',
  borderColor: '#DBDBDB',
  borderRadius: '4px',
}

const ThemeContext = createContext({})
export default ThemeContext

export const ThemeProvider = ({ children }: { children: any }) => {
  const [theme, setTheme] = useState(lightTheme)
  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
}
