import React from 'react'
import cytoscape from 'cytoscape'
import regCose from 'cytoscape-cose-bilkent'
import _ from 'lodash'

class Graph extends React.Component {
  cy = null

  constructor(props) {
    super(props)

    regCose(cytoscape)

    this.state = {
      loadedArtists: []
    }
  }

  componentDidMount() {
    const { getArtistAndRelated } = this.props

    let cy = cytoscape({
      container: document.getElementById('cy'),
      elements: [],
      style: [
        {
          selector: 'node',
          style: {
            'height': '128',
            'width': '128',
            'label': 'data(name)',
            'background-image': 'data(image)',
            'background-fit': 'cover',
            'color': 'white',
            'text-outline-color': '#000',
            'text-outline-width': '2',
            'text-valign': 'bottom',
            'text-margin-y': '-30'
          }
        },
        {
          selector: '.loaded',
          style: {
            'height': '256',
            'width': '256'
          }
        }
      ]
    })

    this.cy = cy
  }

  componentDidUpdate(prevProps) {
    const { artistAndRelated } = this.props
    const prevArtistAndRelated = prevProps.artistAndRelated

    if (artistAndRelated !== prevArtistAndRelated) {
      this.addArtistsToGraph()
    }
  }

  artistImageUrlIfExists(artist) {
    const image = _.first(artist.images)

    if (image) {
      return image.url
    }
  }

  addArtistsToGraph() {
    const { getArtistAndRelated } = this.props
    const { artist, related_artists } = this.props.artistAndRelated
    const { loadedArtists } = this.state
    const newLoadedArtists = _.union(loadedArtists, [artist.id])

    // Add center artist node to graph
    if (!this.cy.getElementById(artist.id).length) {
      this.cy.add({ data: {
          id: artist.id,
          name: artist.name,
          image: this.artistImageUrlIfExists(artist)
        }
      })
    }

    this.cy.getElementById(artist.id).addClass('loaded')

    // Add all related artists nodes to graph, and connect them to center
    // artist
    _.forEach(related_artists, relatedArtist => {
      if (!this.cy.getElementById(relatedArtist.id).length) {
        this.cy.add({ data: {
            id: relatedArtist.id,
            name: relatedArtist.name,
            image: this.artistImageUrlIfExists(relatedArtist)
          }
        })
      }

      if (!this.cy.getElementById(`${artist.id}-${relatedArtist.id}`).length) {
        this.cy.add({
          data: {
            id: `${artist.id}-${relatedArtist.id}`,
            source: artist.id,
            target: relatedArtist.id
          }
        })
      }
    })

    // Redraw the layout
    this.cy.layout({ name: 'cose-bilkent' })

    // Reset tap events with new state
    this.cy.$('node').off('tap')
    this.cy.$('node').on('tap', event => {
      const ele = event.cyTarget
      const found = _.find(this.state.loadedArtists, id => {
        return ele.data('id') === id
      })

      // Only load related artists for ones that haven't been loaded yet
      if (!found) {
        getArtistAndRelated(ele.data('name'))
      }
    })

    this.setState({ loadedArtists: newLoadedArtists })
  }

  render() {
    return (
      <div style={{ width: '100%', height: '100%', overflow: 'hidden' }} id='cy' />
    )
  }
}

export default Graph
