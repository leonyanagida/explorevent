import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'

const ScrollToTopHook: React.FC = () => {
  let history = useHistory()
  // Scrolls the user back to the top of the page when navigating to different routes
  useEffect(() => {
    const unlisten = history.listen(() => {
      window.scrollTo(0, 0)
    })
    return () => {
      unlisten()
    }
  }, [])
  return null
}

export default ScrollToTopHook
