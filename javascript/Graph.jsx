import React from 'react'
import cytoscape from 'cytoscape'
import regCose from 'cytoscape-cose-bilkent'
import _ from 'lodash'

class Graph extends React.Component {
  cy = null

  constructor(props) {
    super(props)

    regCose(cytoscape)
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
    const { artistAndRelated, destroyGraph } = this.props
    const prevArtistAndRelated = prevProps.artistAndRelated
    const prevDestroyGraph = prevProps.destroyGraph

    if (artistAndRelated !== prevArtistAndRelated) {
      this.addArtistsToGraph()
    } else if (destroyGraph !== prevDestroyGraph) {
      this.cy.destroy()
    }
  }

  artistImageUrlIfExists(artist) {
    const image = _.first(artist.images)

    if (image) {
      return image.url
    }
  }

  insertArtist(artist) {
    this.insertIfNotExistsInGraph(artist.id,
      {
        id: artist.id,
        name: artist.name,
        image: this.artistImageUrlIfExists(artist)
      }
    )
  }

  insertEdge(source, target) {
    const id = `${source}-${target}`

    this.insertIfNotExistsInGraph(id,
      {
        id,
        source,
        target
      }
    )
  }

  insertIfNotExistsInGraph(id, data) {
    if (!this.cy.getElementById(id).length) {
      this.cy.add({ data })
    }
  }

  resetTapEvents(artist) {
    const { getArtistAndRelated } = this.props
    
    this.cy.$('node').off('tap')
    this.cy.$('node').on('tap', event => {
      const ele = event.cyTarget
      const found = _.find(this.props.loadedArtists, artist => {
        return ele.data('id') === artist.id
      })

      // Only load related artists for ones that haven't been loaded yet
      if (!found) {
        getArtistAndRelated(ele.data('id'))
      }
    })
  }

  addArtistsToGraph() {
    const { artist, related_artists } = this.props.artistAndRelated
    const { loadedArtists } = this.props

    // Add center artist node to graph
    this.insertArtist(artist)

    this.cy.getElementById(artist.id).addClass('loaded')

    // Add all related artists nodes to graph, and connect them to center
    // artist
    _.forEach(related_artists, relatedArtist => {
      this.insertArtist(relatedArtist)
      this.insertEdge(artist.id, relatedArtist.id)
    })

    // Redraw the layout
    this.cy.layout({ name: 'cose-bilkent' })

    // Reset tap events with new state
    this.resetTapEvents(artist)
  }

  render() {
    return (
      <div style={{ width: '100%', height: '100%', overflow: 'hidden' }} id='cy' />
    )
  }
}

export default Graph
