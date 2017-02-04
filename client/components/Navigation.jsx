import React from 'react'
import { Navbar, Nav, NavDropdown, MenuItem } from 'react-bootstrap'

import Search from './Search.jsx'

class Navigation extends React.Component {
  renderTools() {
    const { auth, makePlaylist } = this.props

    if (auth) {
      return (
        <Nav pullRight>
          <NavDropdown title='Tools' id='basic-nav-pulldown'>
            <MenuItem onClick={() => makePlaylist()}>Make Playlist</MenuItem>
            <MenuItem href='/logout'>Sign Out</MenuItem>
          </NavDropdown>
        </Nav>
      )
    }
  }

  renderSearch() {
    const { auth, searchArtistAndRelated } = this.props

    if (auth) {
      return (
        <Nav pullRight>
          <Search
            searchArtistAndRelated={artist => searchArtistAndRelated(artist)}
          />
        </Nav>
      )
    }
  }

  render() {
    return (
      <Navbar id='nav' style={{ marginBottom: '0px' }}>
        <Navbar.Header>
          <Navbar.Brand>
            <a href='#' onClick={() => location.reload()}>Spotify Graph Explorer</a>
          </Navbar.Brand>
        </Navbar.Header>
        {this.renderTools()}
        {this.renderSearch()}
      </Navbar>
    )
  }
}

export default Navigation
