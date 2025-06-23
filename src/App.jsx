import React from 'react'
import Search from './components/Search'
import { useState } from 'react';
function App() {

  const [searchTerm, setSearchTerm] = useState('');

  return (
    <main>
      <div className="pattern">

        <div className="wrapper">
          <header>
            <img src="./hero.png" alt="Herro Banner" />
            <h1>Find <span className="text-gradient">Movies</span>, You'll Enjoy the Hassle </h1>
          </header>
          <Search  searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>

        </div>

      </div>


    </main>
  )
}

export default App
