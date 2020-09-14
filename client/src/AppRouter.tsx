import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import DefaultNavbar from './components/nav/DefaultNavbar'
import AccountProfile from './pages/user-account/AccountProfile'
import Event from './pages/view-event/Index'
import EventList from './pages/EventList'
import Disclaimer from './pages/Disclaimer'
import Home from './pages/Home'
import Login from './pages/Login'
import MeetPeople from './pages/MeetPeople'
import Niche from './pages/Niche'
import NotFound from './pages/NotFound'
import OnlineInPerson from './pages/OnlineInPerson'
import Signup from './pages/Signup'

const AppRouter = () => {
  return (
    <>
      <DefaultNavbar />
      <Switch>
        <Route path="/events/search" exact component={EventList} />
        <Route path="/events/:eventId" exact component={Event} />
        <Route path="/profiles/:userId" exact component={AccountProfile} />
        <Route path="/disclaimer" exact component={Disclaimer} />
        <Route path="/login" exact component={Login} />
        <Route path="/meetpeople" exact component={MeetPeople} />
        <Route path="/niche" exact component={Niche} />
        <Route path="/signup" exact component={Signup} />
        <Route path="/onlineinperson" exact component={OnlineInPerson} />
        <Route path="/" exact component={Home} />
        <Route component={NotFound} />
      </Switch>
    </>
  )
}

export default AppRouter
