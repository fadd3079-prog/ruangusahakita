import { ROUTES } from '../../constants/routes'
import Button from '../ui/Button'
import PriceTag from '../ui/PriceTag'

function ServiceHero({ service }) {
  return (
    <section className="mt-8">
      <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-100 p-8 md:p-12 relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-ruk-primary to-teal-400"></div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-7">
            <h1 className="text-3xl md:text-4xl font-black text-ruk-navy tracking-tight mb-4">{service.title}</h1>
            <p className="text-xl text-slate-500 font-medium leading-relaxed mb-6">{service.shortDescription}</p>
            <div className="flex flex-wrap gap-2 mb-6">
              {service.platforms.map((platform) => <span className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 text-xs font-bold text-slate-600 border border-slate-200" key={platform}>{platform}</span>)}
            </div>
            <p className="text-slate-600 leading-relaxed font-medium m-0">{service.description}</p>
          </div>
          <div className="lg:col-span-5 w-full">
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
              <PriceTag prefix="Harga" value={service.price} />
              <div className="h-px bg-slate-200 my-4"></div>
              <p className="mb-2 text-slate-600 font-medium"><strong className="text-ruk-navy">Estimasi:</strong> {service.deliveryDays} hari</p>
              <p className="mb-6 text-slate-600 font-medium"><strong className="text-ruk-navy">Revisi:</strong> {service.revisionCount} kali</p>
              <Button className="w-full shadow-[0_4px_14px_0_rgba(22,113,99,0.39)]" to={ROUTES.newBrief}>Ajukan brief</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ServiceHero
