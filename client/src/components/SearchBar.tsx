import React, { useState } from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { useLocation, useHistory } from 'react-router-dom'
import Paper from '@material-ui/core/Paper'
import InputBase from '@material-ui/core/InputBase'
import IconButton from '@material-ui/core/IconButton'
import SearchIcon from '@material-ui/icons/Search'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      margin: 'auto',
      padding: '2px 4px',
      maxWidth: 600,
      width: '80%',
    },
    input: {
      marginLeft: theme.spacing(1),
      flex: 1,
      padding: '1em',
    },
    iconButton: {
      padding: 10,
    },
    divider: {
      height: 28,
      margin: 4,
    },
  })
)

const SearchBar = () => {
  let history = useHistory()
  let location = useLocation()
  const classes = useStyles()
  const [text, setText] = useState<string>('')

  const handleChange = (event: React.ChangeEvent<{ value: string }>) => {
    // Prevents errors when a user keep pressing delete when no text is in the search bar
    if (event.target.value) {
      setText(event.target.value)
    }
  }

  const handleSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault()
    // Only submit if the user has input text into the search box
    if (!text.length) return
    history.push({
      pathname: `/events/search`,
      search: `?query=${text}`,
      state: { referrer: location },
    })
  }

  return (
    <div>
      <Paper component="form" className={classes.root} onSubmit={handleSubmit}>
        <InputBase
          className={classes.input}
          onChange={handleChange}
          placeholder="Search events"
          inputProps={{ 'aria-label': 'Search for events' }}
        />
        <IconButton type="submit" className={classes.iconButton} aria-label="search">
          <SearchIcon />
        </IconButton>
      </Paper>
    </div>
  )
}

export default SearchBar
