import React from 'react'
import { render } from 'react-dom'
import { Jumbotron, Navbar, Nav, NavDropdown, MenuItem } from 'react-bootstrap'
import $ from 'jquery'
import _ from 'lodash'

import Graph from './Graph.jsx'
import Search from './Search.jsx'

class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      artistAndRelated: {},
      loadedArtists: [],
      destroyGraph: false,
      playlistInfo: {},
      hasSearched: false
    }
  }

  processSearchAndGet(artistAndRelated) {
    const { artist } = artistAndRelated
    const { loadedArtists } = this.state
    const newLoadedArtists = _.union(loadedArtists, [artist])

    this.setState({ artistAndRelated, loadedArtists: newLoadedArtists })
  }

  searchArtistAndRelated(name) {
    this.setState({ hasSearched: true })

    $.ajax({
      type: 'get',
      url: '/artist/search',
      data: { name },
      success: artistAndRelated => {
        this.processSearchAndGet(artistAndRelated)
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
        this.processSearchAndGet(artistAndRelated)
      },
      error: response => {
        console.log(response)
      }
    })
  }

  makePlaylist() {
    const artistChain = _.map(this.state.loadedArtists, artist => {
      return {
        name: artist.name,
        id: artist.id
      }
    })

    const newWindow = window.open('', '_blank')

    if (this.state.loadedArtists.length >= 2) {
      $.ajax({
        type: 'get',
        url: '/make-playlist',
        data: {artistChain},
        success: response => {
          newWindow.location.href = response.url
        },
        error: response => {
          console.log(response)
        }
      })
    }
  }

  resetGraph() {
    this.setState({ destroyGraph: !this.state.destroyGraph })
  }

  renderNavbar() {
    return (
      <Navbar id='nav' style={{ marginBottom: '0px' }}>
        <Navbar.Header>
          <Navbar.Brand>
            <a href='#' onClick={() => location.reload()}>Spotify Graph Explorer</a>
          </Navbar.Brand>
        </Navbar.Header>
        <Nav pullRight>
          <NavDropdown title='Tools' id='basic-nav-pulldown'>
            <MenuItem onClick={() => this.makePlaylist()}>Make Playlist</MenuItem>
            <MenuItem href='/logout'>Sign Out</MenuItem>
          </NavDropdown>
        </Nav>
        <Nav pullRight>
          <Search
            searchArtistAndRelated={artist => this.searchArtistAndRelated(artist)}
          />
        </Nav>
      </Navbar>
    )
  }

  renderHelpOrGraph() {
    if (this.state.hasSearched) {
      return (
        <Graph
          artistAndRelated={this.state.artistAndRelated}
          destroyGraph={this.state.destroyGraph}
          getArtistAndRelated={artist => this.getArtistAndRelated(artist)}
          loadedArtists={this.state.loadedArtists}
        />
      )
    } else {
      return (
        <div className='container'>
          <Jumbotron>
            <h1>Let's get started</h1>
            <h4>
              Search for any of your favorite artists and take a look at artists similar{' '}
              to them. Then, click on any node to explore its related artists. After selecting{' '}
              several artists, you can export your similar artists chain as a playlist on your{' '}
              Spotify account!
            </h4>
          </Jumbotron>
        </div>
      )
    }
  }

  render() {
    return (
      <div style={{ height: '100%', overflow: 'hidden' }}>
        {this.renderNavbar()}
        {this.renderHelpOrGraph()}
      </div>
    )
  }
}

render(<App/>, document.getElementById('app'))
