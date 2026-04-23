import { classNames } from '../../utils/classNames'

const alignmentClasses = {
  start: 'text-left',
  center: 'mx-auto text-center flex flex-col items-center',
  end: 'ml-auto text-right flex flex-col items-end',
}

function SectionHeader({ eyebrow, title, description, align = 'start' }) {
  return (
    <div className={classNames('mb-12 max-w-3xl', alignmentClasses[align] || alignmentClasses.start)}>
      {eyebrow && <span className="inline-block text-xs font-bold tracking-[0.2em] uppercase text-ruk-primary bg-teal-50 px-3 py-1.5 rounded-full mb-4 border border-teal-100">{eyebrow}</span>}
      <h2 className="text-3xl md:text-5xl font-black text-ruk-navy mb-5 tracking-tight leading-[1.15]">{title}</h2>
      {description && <p className="text-lg md:text-xl text-gray-500 mb-0 leading-relaxed max-w-2xl font-medium">{description}</p>}
    </div>
  )
}

export default SectionHeader
