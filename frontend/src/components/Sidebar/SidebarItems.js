import React, { useState } from 'react'
import Home from './Home'
import Notifications from './Notifications'
import Create from './Create'
import Search from './Search'
import Explore from './Explore'
import Profile from './Profile'

const SidebarItems = () => {
  const [bg, setBg] = useState('Home')
  const [prevFont, setPrevFont] = useState("")
  const [fontWeight, setFontWeight] = useState('Home')
  const [prevColor, setPrevColor] = useState("")
  const handleBg = (color) => {
    if((bg === 'Home') || (bg === 'Explore') || (bg === 'Messages') || (bg ==='Profile') ){
      setPrevColor(bg)
      setPrevFont(fontWeight)
    }
    setBg(color);
    setFontWeight(color)
  }
  const handlePrevBg = (color) =>{
    setBg(prevColor)
    setFontWeight(prevFont)
  }
  return (
    <>
        <Home bg={bg === 'Home' ? 'blackAlpha.100' : ''} fontWeight={fontWeight === 'Home' ? 'bold' : ''} handleBg={() => handleBg('Home')} />
        <Search bg={bg === 'Search' ? 'blackAlpha.100' : ''} fontWeight={fontWeight === 'Search' ? 'bold' : ''} handleBg={() => handleBg('Search')} handlePrevBg={handlePrevBg}/>
        <Explore bg={bg === 'Explore' ? 'blackAlpha.100' : ''} fontWeight={fontWeight === 'Explore' ? 'bold' : ''} handleBg={() => handleBg('Explore')} />
        <Notifications bg={bg === 'Notifications' ? 'blackAlpha.100' : ''} fontWeight={fontWeight === 'Notifications' ? 'bold' : ''} handleBg={() => handleBg('Notifications')} handlePrevBg={handlePrevBg}/>
        <Create bg={bg === 'Create' ? 'blackAlpha.100' : ''} handleBg={() => handleBg('Create')} />
        <Profile bg={bg === 'Profile' ? 'blackAlpha.100' : ''} fontWeight={fontWeight === 'Profile' ? 'bold' : ''} handleBg={() => handleBg('Profile')} />
    </>
  )
}

export default SidebarItems