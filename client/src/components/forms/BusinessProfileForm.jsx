import { useState } from 'react'
import { cityOptions, nicheOptions } from '../../constants/filters'
import { useUiStore } from '../../store/uiStore'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Select from '../ui/Select'
import Textarea from '../ui/Textarea'

function BusinessProfileForm() {
  const addToast = useUiStore((state) => state.addToast)
  const [form, setForm] = useState({
    businessName: '',
    category: '',
    city: '',
    description: '',
    product: '',
    target: '',
    contact: '',
  })

  const update = (key, value) => setForm({ ...form, [key]: value })

  const handleSubmit = (event) => {
    event.preventDefault()
    addToast('Profil usaha berhasil diperbarui')
  }

  return (
    <form className="ruk-surface p-4" onSubmit={handleSubmit}>
      <Input helperText="Contoh: Kopi Sore" id="business-name" label="Nama usaha" onChange={(event) => update('businessName', event.target.value)} value={form.businessName} />
      <Select id="business-category" label="Kategori usaha" onChange={(event) => update('category', event.target.value)} value={form.category}>
        <option value="">Pilih kategori</option>
        {nicheOptions.map((item) => <option key={item} value={item}>{item}</option>)}
      </Select>
      <Select id="business-city" label="Domisili" onChange={(event) => update('city', event.target.value)} value={form.city}>
        <option value="">Pilih kota</option>
        {cityOptions.map((item) => <option key={item} value={item}>{item}</option>)}
      </Select>
      <Textarea helperText="Ceritakan usaha dengan singkat." id="business-description" label="Deskripsi singkat" onChange={(event) => update('description', event.target.value)} value={form.description} />
      <Input helperText="Contoh: kue kering rumahan, kopi literan, atau jasa laundry" id="product" label="Produk utama" onChange={(event) => update('product', event.target.value)} value={form.product} />
      <Input id="target" label="Target promosi" onChange={(event) => update('target', event.target.value)} value={form.target} />
      <Input id="contact" label="Kontak" onChange={(event) => update('contact', event.target.value)} value={form.contact} />
      <Button type="submit">Simpan profil usaha</Button>
    </form>
  )
}

export default BusinessProfileForm
