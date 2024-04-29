import React from 'react'
import Home from './Home'
import Notifications from './Notifications'
import Create from './Create'
import Search from './Search'

const SidebarItems = () => {
  return (
    <>
        <Home />
        <Notifications/>
        <Create />
        <Search />
    </>
  )
}

export default SidebarItems