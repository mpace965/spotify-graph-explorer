import React from 'react'
import { Jumbotron } from 'react-bootstrap'

import Graph from './Graph'
import Navigation from './Navigation'

class GraphExplorer extends React.Component {
  renderHelpOrGraph() {
    const {
      artistAndRelated,
      destroyGraph,
      getArtistAndRelated,
      hasSearched,
      loadedArtists
    } = this.props

    if (hasSearched) {
      return (
        <Graph
          artistAndRelated={artistAndRelated}
          destroyGraph={destroyGraph}
          getArtistAndRelated={artist => getArtistAndRelated(artist)}
          loadedArtists={loadedArtists}
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
    const { makePlaylist, searchArtistAndRelated } = this.props

    return (
      <div style={{ height: '100%', overflow: 'hidden' }}>
        <Navigation
          makePlaylist={() => makePlaylist()}
          searchArtistAndRelated={artist => searchArtistAndRelated(artist)}
        />
        {this.renderHelpOrGraph()}
      </div>
    )
  }
}

export default GraphExplorer
