import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authService } from '../../services/authService'
import { useAuthStore } from '../../store/authStore'
import { useUiStore } from '../../store/uiStore'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Select from '../ui/Select'

function RegisterForm() {
  const navigate = useNavigate()
  const setRole = useAuthStore((state) => state.setRole)
  const addToast = useUiStore((state) => state.addToast)
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'umkm' })
  const [error, setError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!form.name || !form.email || !form.password) {
      setError('Lengkapi data utama terlebih dahulu')
      return
    }
    if (form.password !== form.confirmPassword) {
      setError('Konfirmasi kata sandi belum sama')
      return
    }

    await authService.register(form)
    setRole(form.role)
    addToast('Akun berhasil dibuat')
    navigate('/daftar/pilih-peran')
  }

  return (
    <form onSubmit={handleSubmit}>
      <Input id="name" label="Nama" onChange={(event) => setForm({ ...form, name: event.target.value })} value={form.name} />
      <Input id="email" label="Email" onChange={(event) => setForm({ ...form, email: event.target.value })} type="email" value={form.email} />
      <Input id="password" label="Kata sandi" onChange={(event) => setForm({ ...form, password: event.target.value })} type="password" value={form.password} />
      <Input
        error={error.includes('Konfirmasi') ? error : ''}
        id="confirm-password"
        label="Konfirmasi kata sandi"
        onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })}
        type="password"
        value={form.confirmPassword}
      />
      <Select id="role" label="Peran awal" onChange={(event) => setForm({ ...form, role: event.target.value })} value={form.role}>
        <option value="umkm">UMKM</option>
        <option value="creator">Kreator</option>
      </Select>
      {error && !error.includes('Konfirmasi') && <p className="text-danger small">{error}</p>}
      <Button className="w-100" type="submit">Daftar</Button>
      <p className="small mt-3 mb-0">Sudah punya akun? <Link to="/masuk">Masuk</Link></p>
    </form>
  )
}

export default RegisterForm
