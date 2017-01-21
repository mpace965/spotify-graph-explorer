import React from 'react'
import cytoscape from 'cytoscape'
import $ from 'jquery'
import _ from 'lodash'

class Graph extends React.Component {
  cy = null

  componentDidMount() {
    let cy = cytoscape({
      container: document.getElementById('cy'),
      elements: [],
    })

    cy.layout({ name: 'circle' })

    this.cy = cy;

    this.getArtistAndRelated('kanye')
  }

  getArtistAndRelated(artist) {
    $.ajax({
      type: 'get',
      url: '/search',
      data: { artist },
      success: artistAndRelated => {
        const { artist, related_artists } = artistAndRelated

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
      },
      error: response => {
        console.log(response)
      }
    })
  }

  render() {
    return (
      <div style={{ width: '100%', height: '100%', overflow: 'hidden' }} id='cy' />
    )
  }
}

export default Graph
