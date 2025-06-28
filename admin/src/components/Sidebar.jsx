import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className='h-screen max-w-[300px] bg-red-400 p-4'>
      <div className='flex flex-col space-y-4'>
        <Link to={"/"}>
          <button className='bg-white text-red-500 px-4 py-2 rounded hover:bg-red-500 hover:text-white transition'>
          Manage Players
        </button>
        </Link>


       <Link to={"/teams"}>
         <button className='bg-white text-red-500 px-4 py-2 rounded hover:bg-red-500 hover:text-white transition'>
          Manage Team
        </button>
       </Link>

       <Link to={"/matches"}>
         <button className='bg-white text-red-500 px-4 py-2 rounded hover:bg-red-500 hover:text-white transition'>
          Manage Matches
        </button>
       </Link>
      </div>
    </div>
  );
};

export default Sidebar;
