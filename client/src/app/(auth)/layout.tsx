import React from 'react'

// passing in { children } to the function
const Layout = ( { children }: { children: React.ReactNode}) => {
  return (
    // create a div with class name auth-layout, and add a component "main", with class name auth-layout__main
    <div className="auth-layout">
      <main className="auth-layout__main">
        {children}
      </main>
    </div>
  )
}
export default Layout