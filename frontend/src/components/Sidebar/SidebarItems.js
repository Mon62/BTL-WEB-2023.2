import React from 'react'
import Home from './Home'
import Notifications from './Notifications'
import Create from './Create'
import Search from './Search'
import Messages from './Messages'
import Explore from './Explore'
import Profile from './Profile'

const SidebarItems = () => {
  return (
    <>
        <Home />
        <Notifications/>
        <Create />
        <Search />
        <Messages />
        <Explore />
        <Profile />
    </>
  )
}

export default SidebarItems