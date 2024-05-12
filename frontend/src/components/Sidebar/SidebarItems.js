import React, { useState } from 'react'
import Home from './Home'
import Notifications from './Notifications'
import Create from './Create'
import Search from './Search'
import Messages from './Messages'
import Explore from './Explore'
import Profile from './Profile'

const SidebarItems = () => {
  const [bg, setBg] = useState('Home')
  const [prevColor, setPrevColor] = useState("")
  const handleBg = (color) => {
    if((bg === 'Home') || (bg === 'Explore') || (bg === 'Messages') || (bg ==='Profile') ){
      setPrevColor(bg)
    }
    setBg(color);
  }
  const handlePrevBg = (color) =>{
    setBg(prevColor)
  }
  return (
    <>
        <Home bg={bg === 'Home' ? 'blackAlpha.200' : ''} handleBg={() => handleBg('Home')} />
        <Search bg={bg === 'Search' ? 'blackAlpha.200' : ''} handleBg={() => handleBg('Search')} handlePrevBg={handlePrevBg}/>
        <Explore bg={bg === 'Explore' ? 'blackAlpha.200' : ''} handleBg={() => handleBg('Explore')} />
        <Messages bg={bg === 'Messages' ? 'blackAlpha.200' : ''} handleBg={() => handleBg('Messages')} />
        <Notifications bg={bg === 'Notifications' ? 'blackAlpha.200' : ''} handleBg={() => handleBg('Notifications')} handlePrevBg={handlePrevBg}/>
        <Create bg={bg === 'Create' ? 'blackAlpha.200' : ''} handleBg={() => handleBg('Create')} />
        <Profile bg={bg === 'Profile' ? 'blackAlpha.200' : ''} handleBg={() => handleBg('Profile')} />
    </>
  )
}

export default SidebarItems