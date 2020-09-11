import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import AuthNavbar from './components/nav/AuthNavbar'
import EditEvent from './pages/edit-event/Index'
import EditAccountDetails from './pages/user-account/EditAccountDetails'
import EditAccountEmail from './pages/user-account/EditAccountEmail'
import EditAccountPassword from './pages/user-account/EditAccountPassword'
import Account from './pages/user-account/Account'
import AccountProfile from './pages/user-account/AccountProfile'
import CreateEvent from './pages/create-event/Index'
import DeleteAccount from './pages/user-account/DeleteAccount'
import Disclaimer from './pages/Disclaimer'
import Event from './pages/view-event/Index'
import EventList from './pages/EventList'
import Home from './pages/Home'
import Login from './pages/Login'
import Logout from './pages/Logout'
import MeetPeople from './pages/MeetPeople'
import Niche from './pages/Niche'
import NotFound from './pages/NotFound'
import OnlineInPerson from './pages/OnlineInPerson'

const AuthAppRouter = () => {
  // Includes AUTHORIZED ONLY routes for when the user is logged in
  return (
    <>
      <AuthNavbar />
      <Switch>
        <Route path="/events/edit/:eventId" exact component={EditEvent} />
        <Route path="/account/edit/delete" exact component={DeleteAccount} />
        <Route path="/account/edit/details" exact component={EditAccountDetails} />
        <Route path="/account/edit/email" exact component={EditAccountEmail} />
        <Route path="/account/edit/password" exact component={EditAccountPassword} />
        <Route path="/events/create/event" exact component={CreateEvent} />
        <Route path="/events/search" exact component={EventList} />
        <Route path="/events/:eventId" exact component={Event} />
        <Route path="/profiles/:userId" exact component={AccountProfile} />
        <Route path="/account" exact component={Account} />
        <Route path="/disclaimer" exact component={Disclaimer} />
        <Route path="/login" exact component={Login} />
        <Route path="/logout" exact component={Logout} />
        <Route path="/meetpeople" exact component={MeetPeople} />
        <Route path="/niche" exact component={Niche} />
        <Route path="/onlineinperson" exact component={OnlineInPerson} />
        {/* Send authorized users back to the home page if they land on the sign up page */}
        <Route path="/signup" exact component={Home} />
        <Route path="/" exact component={Home} />
        <Route component={NotFound} />
      </Switch>
    </>
  )
}

export default AuthAppRouter
