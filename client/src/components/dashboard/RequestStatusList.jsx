import { Link } from 'react-router-dom'
import { requestStatusLabels, requestStatusTone } from '../../constants/labels'
import { buildCreatorRequestPath, buildUmkmRequestPath } from '../../constants/routes'
import { formatDate } from '../../utils/formatDate'
import Badge from '../ui/Badge'

function RequestStatusList({ requests, role = 'umkm' }) {
  return (
    <div className="grid gap-4">
      {requests.map((request) => (
        <article className="border border-slate-200 rounded-xl p-5 hover:border-ruk-primary/30 hover:shadow-md transition-all bg-white" key={request.id}>
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
              <h3 className="text-lg font-bold text-ruk-navy mb-1">{request.title}</h3>
              <p className="text-sm text-slate-500 font-medium mb-0">
                {role === 'umkm' ? request.creatorName : request.businessName} • {formatDate(request.createdAt)}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Badge tone={requestStatusTone[request.status]}>{requestStatusLabels[request.status]}</Badge>
              <Link className="text-sm font-bold text-ruk-primary hover:text-teal-700" to={role === 'umkm' ? buildUmkmRequestPath(request.id) : buildCreatorRequestPath(request.id)}>
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
