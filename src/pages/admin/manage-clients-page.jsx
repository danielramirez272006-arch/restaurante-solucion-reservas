import { useState } from 'react';
import ClientsTable from '../../features/admin-clients/components/clients-table';
import ClientHistoryModal from '../../features/admin-clients/components/client-history-modal';
import { useAdminClients } from '../../features/admin-clients/use-admin-clients';
import { useAdminReservations } from '../../features/admin-reservations/use-admin-reservations';

export default function ManageClientsPage() {
  const { clients, loading, error, reload } = useAdminClients();
  const { reservations } = useAdminReservations();
  const [selected, setSelected] = useState(null);

  return (
    <main className="page">
      <header className="page-heading">
        <div>
          <span className="eyebrow">Donde Ray · Administración</span>
          <h1>Directorio de <em>comensales.</em></h1>
          <p className="lede">
            Consulta la base histórica de clientes, su frecuencia de visita y detalles de contacto.
          </p>
        </div>
        <div className="dashboard-actions">
          <button className="button button--outline" type="button" onClick={reload}>
            ↻ Actualizar
          </button>
        </div>
      </header>

      <section className="panel">
        <div className="panel-heading">
          <div>
            <span className="eyebrow">Registro Oficial</span>
            <h2>{clients.length} <em>clientes registrados</em></h2>
          </div>
        </div>
        <ClientsTable clients={clients} loading={loading} error={error} onView={setSelected} />
      </section>

      {selected && (
        <ClientHistoryModal client={selected} reservations={reservations} onClose={() => setSelected(null)} />
      )}
    </main>
  );
}
