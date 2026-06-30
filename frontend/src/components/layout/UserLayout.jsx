import React from 'react'
import Header from '../common/Header'
import Footer from '../common/Footer'
import ChatAgent from '../agent/ChatAgent'
import { Outlet } from 'react-router-dom'

const UserLayout = () => {
  return (
    <>
    <Header/>
    <main>
        <Outlet />
    </main>
    <Footer/>
    <ChatAgent />
    </>
  )
}

export default UserLayout