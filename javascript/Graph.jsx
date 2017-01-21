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
        }
      ]
    })

    this.cy = cy

    getArtistAndRelated('kanye')
    getArtistAndRelated('childish gambino')
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
    const { artist, related_artists } = this.props.artistAndRelated

    this.cy.add({ data: {
        id: artist.id,
        name: artist.name,
        image: this.artistImageUrlIfExists(artist)
      }
    })

    _.forEach(related_artists, relatedArtist => {
      this.cy.add({ data: {
          id: relatedArtist.id,
          name: relatedArtist.name,
          image: this.artistImageUrlIfExists(relatedArtist)
        }
      })

      this.cy.add({
        data: {
          id: `${artist.id}-${relatedArtist.id}`,
          source: artist.id,
          target: relatedArtist.id
        }
      })
    })

    this.cy.layout({ name: 'cose-bilkent' })
  }

  render() {
    return (
      <div style={{ width: '100%', height: '100%', overflow: 'hidden' }} id='cy' />
    )
  }
}

export default Graph
