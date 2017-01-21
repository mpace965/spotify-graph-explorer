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
      artistAndRelated: {},
      destroyGraph: false
    }
  }

  searchArtistAndRelated(name) {
    $.ajax({
      type: 'get',
      url: '/artist/search',
      data: { name },
      success: artistAndRelated => {
        this.setState({ artistAndRelated })
      },
      error: response => {
        console.log(response)
      }
    })
  }

  getArtistAndRelated(id) {
    $.ajax({
      type: 'get',
      url: '/artist/find',
      data: { id },
      success: artistAndRelated => {
        this.setState({ artistAndRelated })
      },
      error: response => {
        console.log(response)
      }
    })
  }

  resetGraph() {
    this.setState({ destroyGraph: !this.state.destroyGraph })
  }

  renderNavbar() {
    return (
      <Navbar id='nav' style={{ marginBottom: '0px' }}>
        <Navbar.Header>
          <Navbar.Brand>
            <a href='#' onClick={() => this.resetGraph()}>Spotify Graph Explorer</a>
          </Navbar.Brand>
        </Navbar.Header>
        <Nav pullRight>
          <Search
            searchArtistAndRelated={artist => this.searchArtistAndRelated(artist)}
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
          destroyGraph={this.state.destroyGraph}
          getArtistAndRelated={artist => this.getArtistAndRelated(artist)}
        />
      </div>
    )
  }
}

render(<App/>, document.getElementById('app'))
