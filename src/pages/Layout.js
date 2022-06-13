import React from 'react';
import { Outlet } from "react-router-dom";
import '../mystyle.css';

function Layout() {
  return(
    <div className='Content'>
      <div className='Container'>
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
