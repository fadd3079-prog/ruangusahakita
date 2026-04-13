import { useState } from 'react'
import { platformOptions } from '../../constants/filters'
import { useUiStore } from '../../store/uiStore'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Select from '../ui/Select'
import Textarea from '../ui/Textarea'

function PortfolioForm({ initialItem }) {
  const addToast = useUiStore((state) => state.addToast)
  const [form, setForm] = useState({
    title: initialItem?.title || '',
    thumbnailUrl: initialItem?.thumbnailUrl || '',
    category: initialItem?.category || '',
    platform: initialItem?.platform || '',
    caption: initialItem?.caption || '',
  })
  const update = (key, value) => setForm({ ...form, [key]: value })

  const handleSubmit = (event) => {
    event.preventDefault()
    addToast('Portofolio berhasil ditambahkan')
  }

  return (
    <form className="ruk-surface p-4" onSubmit={handleSubmit}>
      <Input id="portfolio-title" label="Judul portofolio" onChange={(event) => update('title', event.target.value)} value={form.title} />
      <Input helperText="Untuk MVP, gunakan link gambar." id="portfolio-image" label="Thumbnail" onChange={(event) => update('thumbnailUrl', event.target.value)} value={form.thumbnailUrl} />
      <Input id="portfolio-category" label="Kategori" onChange={(event) => update('category', event.target.value)} value={form.category} />
      <Select id="portfolio-platform" label="Platform" onChange={(event) => update('platform', event.target.value)} value={form.platform}>
        <option value="">Pilih platform</option>
        {platformOptions.map((item) => <option key={item} value={item}>{item}</option>)}
      </Select>
      <Textarea id="portfolio-caption" label="Caption" onChange={(event) => update('caption', event.target.value)} value={form.caption} />
      <Button type="submit">Simpan portofolio</Button>
    </form>
  )
}

export default PortfolioForm
