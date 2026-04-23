import { buildServicePath } from '../../constants/routes'
import Button from '../ui/Button'
import Card from '../ui/Card'
import PriceTag from '../ui/PriceTag'

function ServiceCard({ service }) {
  return (
    <Card className="h-full flex flex-col">
      <h3 className="text-lg font-bold text-ruk-navy mb-2">{service.title}</h3>
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{service.shortDescription}</p>
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-semibold bg-teal-50 text-teal-700">{service.deliveryDays} hari</span>
        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-semibold bg-gray-100 text-gray-600">{service.revisionCount} revisi</span>
      </div>
      <div className="mt-auto pt-4 border-t border-gray-100">
        <PriceTag prefix="Mulai" value={service.price} />
        <Button className="w-full mt-4 !px-4 !py-2.5 text-sm" to={buildServicePath(service.slug)} variant="outline">
          Lihat layanan
        </Button>
      </div>
    </Card>
  )
}

export default ServiceCard
