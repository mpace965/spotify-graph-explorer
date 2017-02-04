import React from 'react'
import $ from 'jquery'
import _ from 'lodash'

import GraphExplorer from './GraphExplorer'
import PropHelper from 'helpers/PropHelper'

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

  render() {
    return (
      <GraphExplorer
        artistAndRelated={this.state.artistAndRelated}
        destroyGraph={this.state.destroyGraph}
        getArtistAndRelated={id => this.getArtistAndRelated(id)}
        hasSearched={this.state.hasSearched}
        loadedArtists={this.state.loadedArtists}
        makePlaylist={() => this.makePlaylist()}
        searchArtistAndRelated={artist => this.searchArtistAndRelated(artist)}
      />
    )
  }
}

PropHelper.render(<App/>, 'app')
