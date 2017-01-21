import React from 'react'
import { render } from 'react-dom'
import { Navbar } from 'react-bootstrap'

import Graph from './Graph.jsx'

class App extends React.Component {
  constructor(props) {
    super(props)
  }

  renderNavbar() {
    return (
      <Navbar id='nav'>
        <Navbar.Header>
          <Navbar.Brand>
            <a href='#'>Spotify Graph Explorer</a>
          </Navbar.Brand>
        </Navbar.Header>
      </Navbar>
    )
  }

  render() {
    return (
      <div style={{ height: '100%', overflow: 'hidden' }}>
        {this.renderNavbar()}
        <Graph />
      </div>
    )
  }
}

render(<App/>, document.getElementById('app'))
