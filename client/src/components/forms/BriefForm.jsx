import { useState } from 'react'
import { useUiStore } from '../../store/uiStore'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Select from '../ui/Select'
import Textarea from '../ui/Textarea'
import AiBriefHelper from './AiBriefHelper'

function buildDraft(form) {
  return `Kami dari ${form.businessName || 'nama usaha'} ingin mempromosikan ${form.productName || 'produk utama'}.
Tujuan promosi: ${form.promotionGoal || 'meningkatkan penjualan atau awareness'}.
Target audiens: ${form.targetAudience || 'calon pembeli yang sesuai'}.
Budget: ${form.budgetRange || 'belum ditentukan'}.
Deadline: ${form.deadline || 'belum ditentukan'}.
Catatan: ${form.notes || 'konten dibuat sederhana, jelas, dan sesuai karakter usaha'}.`
}

function BriefForm() {
  const addToast = useUiStore((state) => state.addToast)
  const [form, setForm] = useState({
    businessName: '',
    businessCategory: '',
    productName: '',
    promotionGoal: '',
    targetAudience: '',
    budgetRange: '',
    deadline: '',
    notes: '',
  })
  const [draft, setDraft] = useState('')
  const update = (key, value) => setForm({ ...form, [key]: value })

  const handleSubmit = (event) => {
    event.preventDefault()
    addToast('Brief berhasil dikirim')
  }

  return (
    <form className="d-grid gap-4" onSubmit={handleSubmit}>
      <div className="ruk-surface p-4">
        <h2 className="h5 fw-bold mb-3">Isi kebutuhan promosi</h2>
        <Input helperText="Contoh: Kopi Sore" id="brief-business" label="Nama usaha" onChange={(event) => update('businessName', event.target.value)} value={form.businessName} />
        <Input id="brief-category" label="Kategori usaha" onChange={(event) => update('businessCategory', event.target.value)} value={form.businessCategory} />
        <Input helperText="Tulis produk utama yang ingin kamu promosikan." id="brief-product" label="Produk / jasa yang dipromosikan" onChange={(event) => update('productName', event.target.value)} value={form.productName} />
        <Input id="brief-goal" label="Tujuan promosi" onChange={(event) => update('promotionGoal', event.target.value)} placeholder="Contoh: menaikkan pesanan akhir pekan" value={form.promotionGoal} />
        <Input id="brief-audience" label="Target audiens" onChange={(event) => update('targetAudience', event.target.value)} placeholder="Contoh: pekerja muda di Bandung" value={form.targetAudience} />
        <Select helperText="Kisaran ini membantu kreator menyesuaikan penawaran." id="brief-budget" label="Budget" onChange={(event) => update('budgetRange', event.target.value)} value={form.budgetRange}>
          <option value="">Pilih kisaran budget</option>
          <option value="Di bawah Rp500 rb">Di bawah Rp500 rb</option>
          <option value="Rp500 rb - Rp1 jt">Rp500 rb - Rp1 jt</option>
          <option value="Rp1 jt - Rp2 jt">Rp1 jt - Rp2 jt</option>
          <option value="Di atas Rp2 jt">Di atas Rp2 jt</option>
        </Select>
        <Input id="brief-deadline" label="Deadline" onChange={(event) => update('deadline', event.target.value)} type="date" value={form.deadline} />
        <Textarea id="brief-notes" label="Catatan tambahan" onChange={(event) => update('notes', event.target.value)} value={form.notes} />
      </div>
      <AiBriefHelper draft={draft} onDraftChange={setDraft} onGenerate={() => setDraft(buildDraft(form))} />
      <Button className="justify-self-start" type="submit">Kirim brief</Button>
    </form>
  )
}

export default BriefForm
