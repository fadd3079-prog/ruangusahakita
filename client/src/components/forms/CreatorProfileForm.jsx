import { useState } from 'react'
import { cityOptions, nicheOptions, platformOptions } from '../../constants/filters'
import { useUiStore } from '../../store/uiStore'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Select from '../ui/Select'
import Textarea from '../ui/Textarea'

function CreatorProfileForm() {
  const addToast = useUiStore((state) => state.addToast)
  const [form, setForm] = useState({ name: '', city: '', niche: '', platform: '', bio: '', priceFrom: '', photo: '', links: '' })
  const update = (key, value) => setForm({ ...form, [key]: value })

  const handleSubmit = (event) => {
    event.preventDefault()
    addToast('Profil kreator berhasil diperbarui')
  }

  return (
    <form className="ruk-surface p-4" onSubmit={handleSubmit}>
      <Input id="creator-name" label="Nama kreator / brand" onChange={(event) => update('name', event.target.value)} value={form.name} />
      <Select id="creator-city" label="Domisili" onChange={(event) => update('city', event.target.value)} value={form.city}>
        <option value="">Pilih kota</option>
        {cityOptions.map((item) => <option key={item} value={item}>{item}</option>)}
      </Select>
      <Select id="creator-niche" label="Niche" onChange={(event) => update('niche', event.target.value)} value={form.niche}>
        <option value="">Pilih niche</option>
        {nicheOptions.map((item) => <option key={item} value={item}>{item}</option>)}
      </Select>
      <Select id="creator-platform" label="Platform utama" onChange={(event) => update('platform', event.target.value)} value={form.platform}>
        <option value="">Pilih platform</option>
        {platformOptions.map((item) => <option key={item} value={item}>{item}</option>)}
      </Select>
      <Textarea id="creator-bio" label="Deskripsi singkat" onChange={(event) => update('bio', event.target.value)} value={form.bio} />
      <Input id="price-from" label="Harga mulai" onChange={(event) => update('priceFrom', event.target.value)} type="number" value={form.priceFrom} />
      <Input helperText="Untuk MVP, isi link foto atau media sosial." id="creator-photo" label="Upload foto / link foto" onChange={(event) => update('photo', event.target.value)} value={form.photo} />
      <Textarea id="creator-links" label="Link portofolio / media sosial" onChange={(event) => update('links', event.target.value)} value={form.links} />
      <Button type="submit">Simpan profil kreator</Button>
    </form>
  )
}

export default CreatorProfileForm
