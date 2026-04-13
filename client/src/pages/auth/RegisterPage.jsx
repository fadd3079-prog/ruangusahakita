import RegisterForm from '../../components/forms/RegisterForm'

function RegisterPage() {
  return (
    <div className="row justify-content-center">
      <div className="col-md-8 col-lg-6">
        <div className="ruk-surface p-4">
          <h1 className="fw-bold">Daftar</h1>
          <p className="ruk-muted">Buat akun singkat, lalu pilih peran yang paling sesuai.</p>
          <RegisterForm />
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
