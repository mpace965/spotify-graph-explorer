import React from 'react'
import { Button, Jumbotron } from 'react-bootstrap'

import Navigation from './Navigation'

class Unauthorized extends React.Component {
  render() {
    const { makePlaylist, searchArtistAndRelated } = this.props

    return (
      <div style={{ height: '100%', overflow: 'hidden' }}>
        <Navigation auth={false} />

        <div className='container'>
          <Jumbotron>
            <p>Please authorize Spotify to begin using Spotify Graph Explorer</p>
            <Button bsStyle='primary' bsSize='lg' href='/auth/spotify'>Sign in</Button>
          </Jumbotron>
        </div>
      </div>
    )
  }
}

export default Unauthorized
