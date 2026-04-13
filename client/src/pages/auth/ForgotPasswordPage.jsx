import { useState } from 'react'
import { authService } from '../../services/authService'
import { useUiStore } from '../../store/uiStore'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'

function ForgotPasswordPage() {
  const addToast = useUiStore((state) => state.addToast)
  const [email, setEmail] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    await authService.requestPasswordReset(email)
    addToast('Instruksi reset akan dikirim jika email terdaftar')
  }

  return (
    <div className="row justify-content-center">
      <div className="col-md-7 col-lg-5">
        <form className="ruk-surface p-4" onSubmit={handleSubmit}>
          <h1 className="fw-bold">Lupa kata sandi</h1>
          <p className="ruk-muted">Masukkan email akunmu. Fitur reset penuh akan disambungkan setelah MVP.</p>
          <Input id="reset-email" label="Email" onChange={(event) => setEmail(event.target.value)} type="email" value={email} />
          <Button className="w-100" type="submit">Kirim instruksi</Button>
        </form>
      </div>
    </div>
  )
}

export default ForgotPasswordPage
