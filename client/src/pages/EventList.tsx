import React, { useEffect, useRef, useState } from 'react'
import { useLocation, useHistory } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import axios from 'axios'
import Grid from '@material-ui/core/Grid'
import Container from '@material-ui/core/Container'
import EventCard from '../components/EventCard'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import LinearProgress from '@material-ui/core/LinearProgress'
import Select from '@material-ui/core/Select'
import Skeleton from '@material-ui/lab/Skeleton'
import Typography from '@material-ui/core/Typography'
import Searchbar from '../components/SearchBar'
import lostImg from '../assets/img/lost.png'

const useStylesEventList = makeStyles((theme) => ({
  eventListContainer: {
    [theme.breakpoints.down('sm')]: {
      paddingTop: '3em',
    },
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  noResultsContainer: {
    minHeight: '100vh',
    paddingTop: '130px',
    textAlign: 'center',
    width: '100%',
  },
  noResultIcon: {
    opacity: 0.85,
    width: '15em',
  },
  skeletonListContainer: {
    marginTop: '1em',
  },
  sortContainer: {
    textAlign: 'right',
  },
}))

const EventList = () => {
  const location = useLocation()
  const history = useHistory()
  const classes = useStylesEventList()
  const [isSorting, setIsSorting] = useState<boolean>(false)
  const [eventSearchData, setEventSearchData] = useState<any>([])
  const [eventSearchError, setEventSearchError] = useState<boolean>(false)
  const [isEventSearching, setIsEventSearching] = useState<boolean>(true)
  const [selectState, setSelectState] = useState<{ option: string | number; name: string }>({
    option: '',
    name: '',
  })
  const [page, setPage] = useState<number>(1)
  const [eventsPerPage] = useState<number>(9) // The number of events that will be shown on inital load
  const [currentEvents, setCurrentEvents] = useState<any>([])
  const [isEventsLoading, setIsEventsLoading] = useState<boolean>(false)
  const [eventElement, setEventElement] = useState<HTMLDivElement | null>(null)
  // Use the IntersectionObserver to determine if the element is visible on the page
  const observer = useRef<IntersectionObserver>(
    new IntersectionObserver(
      (entries) => {
        const first = entries[0]
        if (first.isIntersecting) {
          fetchMoreData()
        }
      },
      // The last entire event card must be shown in order to fetch more event data
      { threshold: 1 }
    )
  )

  useEffect(() => {
    // For infinite scrolling effect
    // Keep track of the last event card on the page
    const currentElement = eventElement
    const currentObserver = observer.current
    if (currentElement) {
      currentObserver.observe(currentElement)
    }
    return () => {
      if (currentElement) {
        currentObserver.unobserve(currentElement)
      }
    }
  }, [eventElement])

  useEffect(() => {
    // Only run this function if the location's pathname is /events/search and there is location state (so we don't receive and error)
    if (location.pathname !== '/events/search' || !location.state) {
      // Display any errors
      setEventSearchError(true)
      // Return and end the searching animation
      return setIsEventSearching(false)
    }
    // If there are no errors, fetch the api data
    eventListApi()
  }, [location])

  useEffect(() => {
    if (isEventsLoading) return
    if (eventSearchData) {
      setIsEventsLoading(true)
      // We are doing calculations for pagination:
      const indexOfLastEvent: number = page * eventsPerPage
      const indexOfFirstEvent: number = indexOfLastEvent - eventsPerPage
      // We don't want to mutate the original state.
      // Therefore we will use the spread operator and put eventSearchData in another array
      const theSearchDataArr = [...eventSearchData]
      const currEvent = theSearchDataArr.slice(indexOfFirstEvent, indexOfLastEvent)
      // If the user reaches the last post, we want to stop the loading animation and return
      const finalEventsPage: number = Math.ceil(eventSearchData.length / eventsPerPage)
      // Set loading to false once the states are updates
      // Note:
      // This will make sure that  we are not constantly updating the state once we reach the end of the page
      if (page > finalEventsPage) {
        // If we reach the final page, set the current event state back to the event search data
        setCurrentEvents(eventSearchData)
        return setIsEventsLoading(false)
      }
      // We don't want to mutate the original state.
      // Therefore we will use the spread operator and put currentEvents in another array
      const theCurrentEventsArr = [...currentEvents]
      // Update to include more events
      const updateCurrentEvents = theCurrentEventsArr.concat(currEvent)
      setCurrentEvents(updateCurrentEvents)
      setIsEventsLoading(false)
    }
  }, [eventSearchData, page])

  const fetchMoreData = () => {
    // NOTE:
    // In the future, add features such as calling to an api to fetch more data.
    // However, in this case we are going to increase the page count to trigger the
    // useEffect hook in order to concatenate new data to the setCurrentEvents array
    if (eventSearchData) {
      // Increase the page count
      // We will NEVER decrease the page count, only ADD!
      setPage((prevPage) => prevPage + 1)
    }
  }

  const eventListApi = () => {
    // Start the searching animation
    setIsEventSearching(true)
    // Remove any previous errors
    setEventSearchError(false)
    const params: URLSearchParams = new URLSearchParams(location.search)
    let query = params.get('query')
    // Searching for special characters may break the application
    // Make sure to escape nasty special characters to its proper URL Character Codes
    switch (query) {
      case '?':
        query = '%3F'
        break
      case '#':
        query = '%23'
        break
      case '%':
        query = '%25'
        break
      default:
        break
    }
    // Search events API
    if (query) {
      axios
        .get(`/api/events/search/${query}`)
        .then((res: any) => {
          // Returns an array of events
          setEventSearchData(res.data.event)
          // Just adding a small buffer before displaying data
          setTimeout(() => {
            setIsEventSearching(false)
          }, 1500)
        })
        .catch(() => {
          setEventSearchError(true)
          setIsEventSearching(false)
        })
    } else if (query === '' || query === null || query === undefined) {
      setEventSearchError(true)
      setIsEventSearching(false)
    } else {
      return history.push({
        pathname: '/events/search',
        search: `?query=${location.search}`,
        state: { referrer: location },
      })
    }
  }

  const handleSortingDates = (order: 'asc' | 'desc') => {
    if (currentEvents.length < 1) return // The array must contain at least 1 item
    // Use the spread operator so we don't mutate the original array
    const tempEventSearchData = [...currentEvents]
    // Sort by the event start date
    const events = tempEventSearchData.sort((a: { eventStartDate: string }, b: { eventStartDate: string }) => {
      const dateA = Number(new Date(a.eventStartDate))
      const dateB = Number(new Date(b.eventStartDate))
      return order === 'asc' ? dateB - dateA : dateA - dateB
    })
    // Add a bit of buffer in between sorting
    setTimeout(() => {
      // Make sure to make changes to both currentEvents and eventSearchData states
      setCurrentEvents(events)
      setEventSearchData(events)
      setIsSorting(false)
    }, 1000)
  }

  const handleSortingLikesArray = (order: 'asc' | 'desc') => {
    if (currentEvents.length < 1) return // The array must contain at least 1 item
    // Use the spread operator so we don't mutate the original array
    const tempEventSearchData = [...currentEvents]
    // Use the spread operator so we don't mutate the original array
    // Sort by length of the eventLikes array
    const events = tempEventSearchData.sort((a: { eventLikes: string }, b: { eventLikes: string }) => {
      const eventA = a.eventLikes.length
      const eventB = b.eventLikes.length
      return order === 'asc' ? eventB - eventA : eventA - eventB
    })
    // Add a bit of buffer in between sorting
    setTimeout(() => {
      // Make sure to make changes to both currentEvents and eventSearchData states
      setCurrentEvents(events)
      setEventSearchData(events)
      setIsSorting(false)
    }, 1000)
  }

  const handleSortingAttendingArray = (order: 'asc' | 'desc') => {
    const tempEventSearchData = [...eventSearchData]
    // Use the spread operator so we don't mutate the original array
    // Sort by length of the usersAttending array
    const events = tempEventSearchData.sort((a: { usersAttending: string }, b: { usersAttending: string }) => {
      const eventA = a.usersAttending.length
      const eventB = b.usersAttending.length
      return order === 'asc' ? eventB - eventA : eventA - eventB
    })
    // Add a bit of buffer in between sorting
    setTimeout(() => {
      // Make sure to make changes to both currentEvents and eventSearchData states
      setCurrentEvents(events)
      setEventSearchData(events)
      setIsSorting(false)
    }, 1000)
  }

  const handleChange = (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    if (!eventSearchData.length) return // Don't change state if the search data is an empty array
    // On option change, set the new state
    const name = event.target.name as keyof typeof selectState
    setSelectState({
      ...selectState,
      [name]: event.target.value,
    })
    setIsSorting(true)
    // Use the spread operator so we don't mutate the original array
    switch (event.target.value) {
      case 'newest':
        handleSortingDates('asc')
        break
      case 'oldest':
        handleSortingDates('desc')
        break
      case 'most liked':
        handleSortingLikesArray('asc')
        break
      case 'least liked':
        handleSortingLikesArray('desc')
        break
      case 'most attending':
        handleSortingAttendingArray('asc')
        break
      case 'least attending':
        handleSortingAttendingArray('desc')
        break
      default:
        setIsSorting(false)
        break
    }
  }

  return (
    <Container maxWidth="lg" className={classes.eventListContainer}>
      {(isEventSearching && !eventSearchError) || isSorting ? (
        <div className={classes.skeletonListContainer}>
          {isSorting && <LinearProgress color="primary" />}
          <br />
          <Grid container spacing={3}>
            {Array.from(new Array(8)).map((item: any, index: number) => {
              return (
                <Grid item xs={12} sm={4} key={index}>
                  <Skeleton variant="rect" width="100%" height={200} />
                  <Skeleton variant="text" width="100%" />
                  <Skeleton variant="text" width="100%" />
                  <Skeleton variant="text" width="60%" />
                </Grid>
              )
            })}
          </Grid>
        </div>
      ) : (
        <>
          {(!eventSearchData || eventSearchError) && (
            <div className={classes.noResultsContainer}>
              <Searchbar />
              <br />
              <br />
              <img className={classes.noResultIcon} src={lostImg} alt="Lost Person" />
              <Typography variant="h5" component="h2">
                <br />
                There was an error searching for events
              </Typography>
              <Typography variant="body1" component="p">
                <br />
                Please try again
              </Typography>
            </div>
          )}
          <React.Fragment>
            {eventSearchData.length > 0 && (
              <>
                <br />
                <br />
                <Searchbar />
                <br />
                {eventSearchData.length > 1 && (
                  <div className={classes.sortContainer}>
                    <FormControl className={classes.formControl}>
                      <InputLabel htmlFor="option-native-simple">Sort</InputLabel>
                      <Select
                        native
                        value={selectState.option}
                        onChange={handleChange}
                        inputProps={{
                          name: 'option',
                          id: 'option-native-simple',
                        }}
                      >
                        <option aria-label="None" value="" />
                        <option value={'newest'}>Newest</option>
                        <option value={'most liked'}>Most Liked</option>
                        <option value={'most attending'}>Most Attending</option>
                        <option value={'least liked'}>Least Liked</option>
                        <option value={'least attending'}>Least Attending</option>
                        <option value={'oldest'}>Oldest</option>
                      </Select>
                    </FormControl>
                  </div>
                )}
              </>
            )}
            <Grid container spacing={3}>
              {currentEvents.length > 0 ? (
                <>
                  {currentEvents.map((event: any, index: number) => {
                    return (
                      <Grid item xs={12} sm={4} key={event._id + event.eventName}>
                        <div ref={setEventElement}>
                          <EventCard
                            eventDate={event.eventDate}
                            eventHours={event.eventHours}
                            eventCity={event.eventCity}
                            eventState={event.eventState}
                            eventStartDate={event.eventStartDate}
                            eventId={event._id}
                            eventImg={event.eventImg}
                            eventName={event.eventName}
                            exclusive={event.exclusive}
                            online={event.online}
                            text={event.text}
                            usersAttendingCount={event.usersAttending.length || 0}
                            eventLikesCount={event.eventLikes.length}
                          />
                        </div>
                      </Grid>
                    )
                  })}
                </>
              ) : (
                <div className={classes.noResultsContainer}>
                  <Searchbar />
                  <br />
                  <br />
                  <img className={classes.noResultIcon} src={lostImg} alt="Lost Person" />
                  <Typography variant="h5" component="h2">
                    <br />
                    No results found
                  </Typography>
                  <Typography variant="body1" component="p">
                    <br />
                    Please try different keywords
                  </Typography>
                </div>
              )}
            </Grid>
            {isEventsLoading && (
              <>
                <br />
                <br />
                <h3>Loading....</h3>
              </>
            )}
          </React.Fragment>
        </>
      )}
    </Container>
  )
}
export default EventList
