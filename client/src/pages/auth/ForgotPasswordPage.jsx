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
    <div className="flex justify-center">
      <div className="w-full max-w-md">
        <form className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 relative" onSubmit={handleSubmit}>
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-ruk-primary to-teal-400 rounded-t-3xl"></div>
          <h1 className="text-2xl font-black text-ruk-navy tracking-tight mb-2">Lupa kata sandi</h1>
          <p className="text-slate-500 font-medium mb-8">Masukkan email akunmu. Fitur reset penuh akan disambungkan setelah MVP.</p>
          <div className="mb-6">
            <Input id="reset-email" label="Email" onChange={(event) => setEmail(event.target.value)} type="email" value={email} />
          </div>
          <Button className="w-full" type="submit">Kirim instruksi</Button>
        </form>
      </div>
    </div>
  )
}

export default ForgotPasswordPage
