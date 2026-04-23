import LoginForm from '../../components/forms/LoginForm'

function LoginPage() {
  return (
    <div className="flex justify-center">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 relative">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-ruk-primary to-teal-400 rounded-t-3xl"></div>
          <h1 className="text-2xl font-black text-ruk-navy tracking-tight mb-2">Masuk</h1>
          <p className="text-slate-500 font-medium mb-8">Lanjutkan mengelola profil, brief, dan permintaan kerja sama.</p>
          <LoginForm />
        </div>
      </div>
    </div>
  )
}

export default LoginPage
