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
      <article className="bg-white rounded-2xl p-6 md:p-8 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
        <Badge tone={requestStatusTone[request.status]}>{requestStatusLabels[request.status]}</Badge>
        <dl className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-8 mb-0">
          <dt className="text-slate-500 font-medium">Kreator</dt>
          <dd className="sm:col-span-3 font-bold text-ruk-navy">{request.creatorName}</dd>
          <dt className="text-slate-500 font-medium">Usaha</dt>
          <dd className="sm:col-span-3 font-bold text-ruk-navy">{request.businessName}</dd>
          <dt className="text-slate-500 font-medium">Produk</dt>
          <dd className="sm:col-span-3 font-bold text-ruk-navy">{request.productName}</dd>
          <dt className="text-slate-500 font-medium">Tujuan</dt>
          <dd className="sm:col-span-3 font-bold text-ruk-navy">{request.promotionGoal}</dd>
          <dt className="text-slate-500 font-medium">Target audiens</dt>
          <dd className="sm:col-span-3 font-bold text-ruk-navy">{request.targetAudience}</dd>
          <dt className="text-slate-500 font-medium">Budget</dt>
          <dd className="sm:col-span-3 font-bold text-ruk-navy">{request.budgetRange}</dd>
          <dt className="text-slate-500 font-medium">Deadline</dt>
          <dd className="sm:col-span-3 font-bold text-ruk-navy">{formatDate(request.deadline)}</dd>
          <dt className="text-slate-500 font-medium">Catatan</dt>
          <dd className="sm:col-span-3 font-bold text-ruk-navy leading-relaxed">{request.notes}</dd>
        </dl>
      </article>
    </>
  )
}

export default RequestDetailPage
