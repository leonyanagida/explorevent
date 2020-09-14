import React, { useEffect, useState, createContext } from 'react'
import axios from 'axios'
import Skeleton from '@material-ui/lab/Skeleton'

export const UserContext: any = createContext({})
export const UserProvider = ({ children }: { children: any }) => {
  const [user, setUser] = useState({})
  const [isLoading, setIsLoading] = useState<boolean>(true) // True by default

  useEffect(() => {
    // Run if the user already is logged in to our application
    if (!user || Object.keys(user).length === 0) {
      axios
        .get(`/api/auth/checktoken`)
        .then((res: any) => {
          // If the token returns an empty object,
          // make sure to log the user out of the passport session (back-end)
          if (Object.keys(res.data).length === 0) {
            // Calling the logout API will clear previous tokens on the backend
            axios.get('/api/users/logout')
            // Set the loading to false so that the user is able to view the page
            return setIsLoading(false)
          }
          // Make sure to set the data FIRST before setting the isLoading state to false
          // That way the application doesn't re-run all the components twice due to the user state changing
          setUser(res.data)
          // End the loading animation
          setIsLoading(false)
        })
        .catch(() => {
          setIsLoading(false)
          // Note:
          // We are checking for empty objects in the App.tsx file
          // Therefore we MUST set the user as an empty object to avoid errors
          setUser({})
        })
    } else {
      // In all other scenarios, set the loading to false so the user can view the page
      setIsLoading(false)
    }
  }, [])

  // We want to make sure to display the page to the user
  // once we fetch all the necessary data from the server
  if (isLoading)
    return (
      <div style={{ margin: 'auto', maxWidth: '80%' }}>
        <br />
        <Skeleton variant="text" width="100%" />
        <Skeleton variant="text" width="100%" />
        <Skeleton variant="text" width="100%" />
      </div>
    )
  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>
}
