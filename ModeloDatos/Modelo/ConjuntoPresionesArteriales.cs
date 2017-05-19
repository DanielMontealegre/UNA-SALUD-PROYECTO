using ModeloDatos.Database;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ModeloDatos.Modelo
{
    public class ConjuntoPresionesArteriales
    {
        public IEnumerable<PresionArterial> Obtener(String paciente)
        {
            IEnumerable<PresionArterial> presiones = Conexion.Open.PresionArterial.
                Where(x => x.Paciente == paciente).
                OrderBy(x => x.Fecha);
            return presiones;
        }

        public PresionArterial Agregar(PresionArterial presionArterial)
        {
            using (var cnx = Conexion.Open)
            {
                cnx.PresionArterial.InsertOnSubmit(presionArterial);
                cnx.SubmitChanges();
            }
            return presionArterial;
        }

        public PresionArterial ObtenerPresionArterial(int codigo)
        {

            PresionArterial presion = Conexion.Open.PresionArterial.FirstOrDefault(x => x.Codigo == codigo);
            return (presion != null) ? presion : new PresionArterial();
        }

        public PresionArterial EditarPresionArterial(PresionArterial presionArterial)
        {
            PresionArterial presionArterialAux;
            using (var cnx = Conexion.Open)
            {
                presionArterialAux = cnx.PresionArterial.FirstOrDefault(x => x.Codigo == presionArterial.Codigo);
                presionArterialAux.Sistolica = presionArterial.Sistolica;
                presionArterialAux.Diastolica = presionArterial.Diastolica;
                presionArterialAux.Pulso = presionArterial.Pulso;
                presionArterialAux.RitmoIrregular = presionArterial.RitmoIrregular;
                presionArterialAux.Detalle = presionArterial.Detalle;
                presionArterialAux.Fecha = presionArterial.Fecha;
                cnx.SubmitChanges();
            }

            return presionArterialAux;
        }

        public Boolean Remover(int codigo)
        {
            using (var cnx = Conexion.Open)
            {
                var obj = cnx.PresionArterial.FirstOrDefault(e => e.Codigo == codigo);
                cnx.PresionArterial.DeleteOnSubmit(obj);
                cnx.SubmitChanges();
                return true;
            }

        }
    }
}
