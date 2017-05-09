using ModeloDatos.Database;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ModeloDatos.Modelo
{
    public class ConjuntoAlergias
    {
        public IEnumerable<Alergia> Obtener(String paciente)
        {
            IEnumerable<Alergia> alergias = Conexion.Open.Alergia.
                Where(x => x.Paciente == paciente);
            return alergias;
        }

        public List<TipoAlergia> ObtenerTipos()
        {
            return Conexion.Open.TipoAlergia.ToList();
        }

        public List<TipoReacción> ObtenerReacciones()
        {
            return Conexion.Open.TipoReacción.ToList();
        }

        public Alergia Agregar(Alergia alergia)
        {
            using (var cnx = Conexion.Open)
            {
                cnx.Alergia.InsertOnSubmit(alergia);
                cnx.SubmitChanges();
            }
            return alergia;
        }
        public Alergia ObtenerAlergia(int codigo)
        {
            Alergia alergia = Conexion.Open.Alergia.FirstOrDefault(x => x.Codigo == codigo);
            return (alergia != null) ? alergia : new Alergia();
        }

        public Boolean EditarAlergia(Alergia alergia)
        {
            using (var cnx = Conexion.Open)
            {
                var alergiaAux = cnx.Alergia.FirstOrDefault(x => x.Codigo == alergia.Codigo);
                alergiaAux.Detalle = alergia.Detalle;
                alergiaAux.Paciente = alergia.Paciente;
                alergiaAux.Reaccion = alergia.Reaccion;
                alergiaAux.Tipo = alergia.Tipo;
                alergiaAux.Tratamiento = alergia.Tratamiento;
                cnx.SubmitChanges();
            }

            return true;
        }

        public Boolean RemoverAlergia(int codigo)
        {
            using (var cnx = Conexion.Open)
            {
                var obj = cnx.Alergia.FirstOrDefault(e => e.Codigo == codigo);
                cnx.Alergia.DeleteOnSubmit(obj);
                cnx.SubmitChanges();
                return true;
            }

        }
    }
}
