import { useState } from 'react'
import { platformOptions } from '../../constants/filters'
import { useUiStore } from '../../store/uiStore'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Select from '../ui/Select'
import Textarea from '../ui/Textarea'

function ServiceForm({ initialService }) {
  const addToast = useUiStore((state) => state.addToast)
  const [form, setForm] = useState({
    title: initialService?.title || '',
    description: initialService?.description || '',
    price: initialService?.price || '',
    deliveryDays: initialService?.deliveryDays || '',
    revisionCount: initialService?.revisionCount || '',
    platform: initialService?.platforms?.[0] || '',
    outputs: initialService?.outputs?.join('\n') || '',
  })
  const update = (key, value) => setForm({ ...form, [key]: value })

  const handleSubmit = (event) => {
    event.preventDefault()
    addToast('Layanan berhasil ditambahkan')
  }

  return (
    <form className="ruk-surface p-4" onSubmit={handleSubmit}>
      <Input id="service-title" label="Nama layanan" onChange={(event) => update('title', event.target.value)} value={form.title} />
      <Textarea id="service-description" label="Deskripsi layanan" onChange={(event) => update('description', event.target.value)} value={form.description} />
      <Input id="service-price" label="Harga" onChange={(event) => update('price', event.target.value)} type="number" value={form.price} />
      <Input id="service-delivery" label="Estimasi pengerjaan" onChange={(event) => update('deliveryDays', event.target.value)} type="number" value={form.deliveryDays} />
      <Input id="service-revision" label="Jumlah revisi" onChange={(event) => update('revisionCount', event.target.value)} type="number" value={form.revisionCount} />
      <Select id="service-platform" label="Platform publikasi" onChange={(event) => update('platform', event.target.value)} value={form.platform}>
        <option value="">Pilih platform</option>
        {platformOptions.map((item) => <option key={item} value={item}>{item}</option>)}
      </Select>
      <Textarea helperText="Satu output per baris." id="service-outputs" label="Output yang didapat" onChange={(event) => update('outputs', event.target.value)} value={form.outputs} />
      <Button type="submit">Simpan layanan</Button>
    </form>
  )
}

export default ServiceForm
