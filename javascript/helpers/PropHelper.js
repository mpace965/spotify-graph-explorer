import { cloneElement } from 'react'
import { render } from 'react-dom'

class PropHelper {
  static render(element, containerId) {
    const container = document.getElementById(containerId)
    const props = JSON.parse(container.attributes.getNamedItem('reactprops').value)
    const clone = cloneElement(element, props)

    render(clone, container)
  }
}

export default PropHelper
