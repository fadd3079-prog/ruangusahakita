import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authService } from '../../services/authService'
import { useAuthStore } from '../../store/authStore'
import { useUiStore } from '../../store/uiStore'
import Button from '../ui/Button'
import Input from '../ui/Input'

function LoginForm() {
  const navigate = useNavigate()
  const setUser = useAuthStore((state) => state.setUser)
  const role = useAuthStore((state) => state.role)
  const addToast = useUiStore((state) => state.addToast)
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!form.email || !form.password) {
      setError('Lengkapi email dan kata sandi terlebih dahulu')
      return
    }

    const user = await authService.login(form)
    setUser(user)
    addToast('Berhasil masuk')
    navigate(role === 'creator' ? '/dashboard/kreator' : '/dashboard/umkm')
  }

  return (
    <form onSubmit={handleSubmit}>
      <Input
        error={error && !form.email ? error : ''}
        helperText="Gunakan email yang kamu daftarkan."
        id="email"
        label="Email"
        onChange={(event) => setForm({ ...form, email: event.target.value })}
        type="email"
        value={form.email}
      />
      <Input
        error={error && !form.password ? 'Kata sandi belum diisi' : ''}
        id="password"
        label="Kata sandi"
        onChange={(event) => setForm({ ...form, password: event.target.value })}
        type="password"
        value={form.password}
      />
      <Button className="w-100" type="submit">Masuk</Button>
      <div className="d-flex justify-content-between gap-3 mt-3 small">
        <Link to="/daftar">Daftar akun</Link>
        <Link to="/lupa-kata-sandi">Lupa kata sandi?</Link>
      </div>
    </form>
  )
}

export default LoginForm
