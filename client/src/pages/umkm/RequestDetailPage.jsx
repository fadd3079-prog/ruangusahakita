import { useParams } from 'react-router-dom'
import EmptyState from '../../components/common/EmptyState'
import DashboardHeader from '../../components/dashboard/DashboardHeader'
import Badge from '../../components/ui/Badge'
import { requestStatusLabels, requestStatusTone } from '../../constants/labels'
import { requests } from '../../data/mockData'
import { formatDate } from '../../utils/formatDate'

function RequestDetailPage() {
  const { requestId } = useParams()
  const request = requests.find((item) => item.id === requestId)

  if (!request) {
    return <EmptyState actionLabel="Kembali ke permintaan" actionTo="/dashboard/umkm/permintaan" description="Permintaan ini tidak tersedia." title="Permintaan tidak ditemukan" />
  }

  return (
    <>
      <DashboardHeader description="Detail brief yang dikirim ke kreator." title={request.title} />
      <article className="ruk-surface p-4">
        <Badge tone={requestStatusTone[request.status]}>{requestStatusLabels[request.status]}</Badge>
        <dl className="row mt-4 mb-0">
          <dt className="col-sm-3">Kreator</dt>
          <dd className="col-sm-9">{request.creatorName}</dd>
          <dt className="col-sm-3">Usaha</dt>
          <dd className="col-sm-9">{request.businessName}</dd>
          <dt className="col-sm-3">Produk</dt>
          <dd className="col-sm-9">{request.productName}</dd>
          <dt className="col-sm-3">Tujuan</dt>
          <dd className="col-sm-9">{request.promotionGoal}</dd>
          <dt className="col-sm-3">Target audiens</dt>
          <dd className="col-sm-9">{request.targetAudience}</dd>
          <dt className="col-sm-3">Budget</dt>
          <dd className="col-sm-9">{request.budgetRange}</dd>
          <dt className="col-sm-3">Deadline</dt>
          <dd className="col-sm-9">{formatDate(request.deadline)}</dd>
          <dt className="col-sm-3">Catatan</dt>
          <dd className="col-sm-9">{request.notes}</dd>
        </dl>
      </article>
    </>
  )
}

export default RequestDetailPage
