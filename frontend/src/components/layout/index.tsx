import { useState } from 'react';
import { Menu, X } from 'react-feather';

import Sidebar from './Sidebar';

export default function Layout({ children }) {
  const [showSidebar, setShowSidebar] = useState(false);

  const childrenArray = Array.isArray(children) ? children : [children];
  const header = childrenArray[0];
  const content = childrenArray.slice(1);

  return (
    <>
      <Sidebar className={showSidebar ? 'show' : ''} />
      <div className="lg:ml-72 mx-auto min-h-screen flex flex-col bg-gray-50">
        <div className="layout-header pt-10 p-4 border-b rounded-t-md px-5 sm:px-10 py-5">
          {header}
        </div>
        <div className="bg-white rounded-b-md shadow-sm px-5 sm:px-10 mb-10 flex-1">
          {content}
        </div>
      </div>
      <button
        className={`fixed bottom-5 border shadow-md bg-white p-3 rounded-full transition-all focus:outline-none lg:hidden ${
          showSidebar ? 'right-5' : 'left-5'
        }`}
        onClick={() => setShowSidebar(!showSidebar)}
      >
        {showSidebar ? <X size={30} /> : <Menu size={30} />}
      </button>
    </>
  );
}
