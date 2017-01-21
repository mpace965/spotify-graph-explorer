import React from 'react'
import cytoscape from 'cytoscape'

class Graph extends React.Component {
  let cy = null

  componentDidMount() {
    cy = cytoscape({
      container: document.getElementById('cy'),
      elements: []
    })
  }

  render() {
    return (
      <div style={{ width: '100%', height: '100%', overflow: 'hidden' }} id='cy' />
    )
  }
}

export default Graph
