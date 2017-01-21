import React from 'react'
import { render } from 'react-dom'
import { Navbar } from 'react-bootstrap'
import $ from 'jquery'
import _ from 'lodash'

import Graph from './Graph.jsx'

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
        <Graph
          artistAndRelated={this.state.artistAndRelated}
          getArtistAndRelated={artist => this.getArtistAndRelated(artist)}
        />
      </div>
    )
  }
}

render(<App/>, document.getElementById('app'))
