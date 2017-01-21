import React from 'react'
import { render } from 'react-dom'
import { Navbar } from 'react-bootstrap'

import Graph from './Graph.jsx'

class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      elements: []
    }
  }

  renderNavbar() {
    return (
      <Navbar>
        <Navbar.Header>
          <Navbar.Brand>
            <a href='#'>Spotify Graph Explorer</a>
          </Navbar.Brand>
        </Navbar.Header>
      </Navbar>
    )
  }

  render() {
    const { elements } = this.state

    return (
      <div>
        {this.renderNavbar()}
        <Graph elements={elements} />
      </div>
    )
  }
}

render(<App/>, document.getElementById('app'))
