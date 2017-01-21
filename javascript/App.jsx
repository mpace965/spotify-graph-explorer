import React from 'react'
import { render } from 'react-dom'
import { Navbar, Nav, NavItem } from 'react-bootstrap'
import $ from 'jquery'
import _ from 'lodash'

import Graph from './Graph.jsx'
import Search from './Search.jsx'

class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      artistAndRelated: {}
    }
  }

  getArtistAndRelated(artist) {
    $.ajax({
      type: 'get',
      url: '/search',
      data: { artist },
      success: artistAndRelated => {
        this.setState({ artistAndRelated })
      },
      error: response => {
        console.log(response)
      }
    })
  }

  renderNavbar() {
    return (
      <Navbar id='nav' style={{ marginBottom: '0px' }}>
        <Navbar.Header>
          <Navbar.Brand>
            <a href='#'>Spotify Graph Explorer</a>
          </Navbar.Brand>
        </Navbar.Header>
        <Nav pullRight>
          <Search
            getArtistAndRelated={artist => this.getArtistAndRelated(artist)}
          />
        </Nav>
      </Navbar>
    )
  }

  render() {
    return (
      <div style={{ height: '100%', overflow: 'hidden' }}>
        {this.renderNavbar()}
        <Graph
          artistAndRelated={this.state.artistAndRelated}
          getArtistAndRelated={artist => this.getArtistAndRelated(artist)}
        />
      </div>
    )
  }
}

render(<App/>, document.getElementById('app'))
