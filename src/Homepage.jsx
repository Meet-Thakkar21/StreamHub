import React from 'react';
import Navbar from './navbar/navbar';
import Sidebar from './navbar/sidebar';
import Home from './Home/home';
const Homepage=()=>{
  return(
   <div>
    <Navbar></Navbar><Sidebar></Sidebar><Home></Home>
   </div>
  )
}
export default Homepage;
