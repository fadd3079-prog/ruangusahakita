function ServiceDescription({ service }) {
  return (
    <section className="py-0">
      <h2 className="h4 fw-bold mb-3">Deskripsi layanan</h2>
      <p className="mb-0">{service.description}</p>
    </section>
  )
}

export default ServiceDescription
