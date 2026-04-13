import RequestStatusList from './RequestStatusList'

function IncomingRequestCard({ requests }) {
  return <RequestStatusList requests={requests} role="creator" />
}

export default IncomingRequestCard
