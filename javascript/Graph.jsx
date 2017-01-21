import React from 'react'
import cytoscape from 'cytoscape'

class Graph extends React.Component {
  cy = null

  componentDidMount() {
    const { getArtistAndRelated } = this.props

    let cy = cytoscape({
      container: document.getElementById('cy'),
      elements: [],
    })

    this.cy = cy

    getArtistAndRelated('kanye')
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

    this.cy.add({ data: { id: artist.id } })

    _.forEach(related_artists, relatedArtist => {
      this.cy.add({ data: { id: relatedArtist.id } })

      this.cy.add({
        data: {
          id: `${artist.id}-${relatedArtist.id}`,
          source: artist.id,
          target: relatedArtist.id
        }
      })
    })

    this.cy.layout({ name: 'circle' })
  }

  render() {
    return (
      <div style={{ width: '100%', height: '100%', overflow: 'hidden' }} id='cy' />
    )
  }
}

export default Graph
