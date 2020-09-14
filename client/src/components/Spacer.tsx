import React from 'react'
// Example of how we would use this component: <Spacer height={'2em'} />
const Spacer = ({ height }: { height: string }) => {
  return <div style={{ marginBottom: height }} />
}
export default Spacer
