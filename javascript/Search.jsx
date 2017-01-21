import React from 'react'
import { FormGroup, FormControl } from 'react-bootstrap'

class Search extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      term: ''
    }
  }

  handleChange(e) {
    this.setState({ term: e.target.value })
  }

  onSearch(e) {
    const { getArtistAndRelated } = this.props
    e.preventDefault()

    getArtistAndRelated(this.state.term)
  }

  render() {
    return (
      <form onSubmit={e => this.onSearch(e)} style={{ width: '400px' }}>
        <FormGroup style={{ paddingTop: '12px', marginBottom: '0px' }}>
          <FormControl
            type='text'
            value={this.state.term}
            placeholder='Search for an artist'
            onChange={e => this.handleChange(e)}
          />
        </FormGroup>
      </form>
    )
  }
}

export default Search
