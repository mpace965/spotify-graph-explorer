import React from 'react'
import { render } from 'react-dom'

import { Navbar } from 'react-bootstrap'

class App extends React.Component {
  renderNavbar() {
    return (
      <Navbar>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="#">Spotify Graph Explorer</a>
          </Navbar.Brand>
        </Navbar.Header>
      </Navbar>
    )
  }

  render() {
    return (
      this.renderNavbar()
    )
  }
}

render(<App/>, document.getElementById('app'))
