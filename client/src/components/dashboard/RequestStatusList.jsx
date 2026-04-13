import { Link } from 'react-router-dom'
import { requestStatusLabels, requestStatusTone } from '../../constants/labels'
import { buildCreatorRequestPath, buildUmkmRequestPath } from '../../constants/routes'
import { formatDate } from '../../utils/formatDate'
import Badge from '../ui/Badge'

function RequestStatusList({ requests, role = 'umkm' }) {
  return (
    <div className="d-grid gap-3">
      {requests.map((request) => (
        <article className="border rounded-3 p-3" key={request.id}>
          <div className="d-flex flex-column flex-md-row justify-content-between gap-2">
            <div>
              <h3 className="h6 fw-bold mb-1">{request.title}</h3>
              <p className="small ruk-muted mb-0">
                {role === 'umkm' ? request.creatorName : request.businessName} • {formatDate(request.createdAt)}
              </p>
            </div>
            <div className="d-flex align-items-center gap-2">
              <Badge tone={requestStatusTone[request.status]}>{requestStatusLabels[request.status]}</Badge>
              <Link to={role === 'umkm' ? buildUmkmRequestPath(request.id) : buildCreatorRequestPath(request.id)}>
                Lihat detail
              </Link>
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}

export default RequestStatusList
