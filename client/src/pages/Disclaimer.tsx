import React from 'react'
import Container from '@material-ui/core/Container'

const Disclaimer = () => {
  return (
    <Container maxWidth="md">
      <br />
      <br />
      <h1>Disclaimer</h1>
      <p>
        Explorevent is not an official website. Explorevent is not a real company. This website is built for
        demonstration purposes only and should be treated as such.
      </p>
      <p>
        The code used to build Explorevent can be found on Leon's Github:{' '}
        <a href="https://github.com/leonyanagida/explorevent">Link</a>
      </p>
    </Container>
  )
}

export default Disclaimer
