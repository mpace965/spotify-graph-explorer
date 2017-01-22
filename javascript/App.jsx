import React from 'react'
import { render } from 'react-dom'
import { Navbar, Nav, NavDropdown, MenuItem, Modal } from 'react-bootstrap'
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
      showPlaylistModal: false,
      playlistInfo: {}
    }
  }

  closePlayListModal() {
    this.setState({ showPlaylistModal: false })
  }

  searchArtistAndRelated(name) {
    $.ajax({
      type: 'get',
      url: '/artist/search',
      data: { name },
      success: artistAndRelated => {
        const { artist } = artistAndRelated
        const { loadedArtists } = this.state
        const newLoadedArtists = _.union(loadedArtists, [artist])

        this.setState({ artistAndRelated, loadedArtists: newLoadedArtists })
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
        const { artist } = artistAndRelated
        const { loadedArtists } = this.state
        const newLoadedArtists = _.union(loadedArtists, [artist])

        this.setState({ artistAndRelated, loadedArtists: newLoadedArtists })
      },
      error: response => {
        console.log(response)
      }
    })
  }

  makePlaylist() {
    if (this.state.loadedArtists.length >= 2) {
      $.ajax({
        type: 'get',
        url: '/make-playlist',
        data: { artists: this.state.loadedArtists },
        success: response => {
          this.setState({ showPlaylistModal: true, playlistInfo: response })
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
            <a href='#' onClick={() => this.resetGraph()}>Spotify Graph Explorer</a>
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

  render() {
    return (
      <div style={{ height: '100%', overflow: 'hidden' }}>
        {this.renderNavbar()}
        <Graph
          artistAndRelated={this.state.artistAndRelated}
          destroyGraph={this.state.destroyGraph}
          getArtistAndRelated={artist => this.getArtistAndRelated(artist)}
          loadedArtists={this.state.loadedArtists}
        />

        <Modal
          show={this.state.showPlaylistModal}
          onHide={() => this.closePlayListModal()}
        >
          <Modal.Header closeButton>
            <Modal.Title>{this.state.playlistInfo.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              Your playlist that connects {this.state.playlistInfo.title} has been made.{' '}
              <a href={this.state.playlistInfo.url} target='_blank'>Click here</a> to access it!
            </p>
          </Modal.Body>
        </Modal>
      </div>
    )
  }
}

render(<App/>, document.getElementById('app'))
