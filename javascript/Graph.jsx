import React from 'react'
import cytoscape from 'cytoscape'
import regCose from 'cytoscape-cose-bilkent'

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
            height: '32',
            width: '32',
            label: 'data(name)'
          }
        }
      ]
    })

    this.cy = cy

    getArtistAndRelated('kanye')
    getArtistAndRelated('big sean')
    getArtistAndRelated('childish gambino')
  }

  componentDidUpdate(prevProps) {
    const { artistAndRelated } = this.props
    const prevArtistAndRelated = prevProps.artistAndRelated

    if (artistAndRelated !== prevArtistAndRelated) {
      this.addArtistsToGraph()
    }
  }

  addArtistsToGraph() {
    const { artist, related_artists } = this.props.artistAndRelated

    this.cy.add({ data: { id: artist.id, name: artist.name } })

    _.forEach(related_artists, relatedArtist => {
      this.cy.add({ data: { id: relatedArtist.id, name: relatedArtist.name } })

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
