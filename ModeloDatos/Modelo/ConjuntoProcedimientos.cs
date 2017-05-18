using ModeloDatos.Database;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ModeloDatos.Modelo
{
    public class ConjuntoProcedimientos
    {
        public IEnumerable<Procedimiento> Obtener(String paciente)
        {
            IEnumerable<Procedimiento> procedimientos = Conexion.Open.Procedimiento.
                Where(x => x.Paciente == paciente).
                OrderBy(x => x.Fecha);
            return procedimientos;
        }

        public Procedimiento Agregar(Procedimiento procedimientoA)
        {
            using (var cnx = Conexion.Open)
            {
                cnx.Procedimiento.InsertOnSubmit(procedimientoA);
                cnx.SubmitChanges();
            }
            return procedimientoA;
        }

        public Procedimiento ObtenerProcedimiento(int codigo)
        {

            Procedimiento procedimiento = Conexion.Open.Procedimiento.FirstOrDefault(x => x.Codigo == codigo);
            return (procedimiento != null) ? procedimiento : new Procedimiento();
        }

        public Procedimiento EditarProcedimiento(Procedimiento procedimiento)
        {
            Procedimiento procedimientoAux;
            using (var cnx = Conexion.Open)
            {
                procedimientoAux = cnx.Procedimiento.FirstOrDefault(x => x.Codigo == procedimiento.Codigo);
                procedimientoAux.Procedimiento1 = procedimiento.Procedimiento1;
                procedimientoAux.Detalle = procedimiento.Detalle;
                procedimientoAux.Motivo = procedimiento.Motivo;
                procedimientoAux.UbicacionAnatomica = procedimiento.UbicacionAnatomica;
                procedimientoAux.Fecha = procedimiento.Fecha;
                cnx.SubmitChanges();
            }

            return procedimientoAux;
        }

        public Boolean Remover(int codigo)
        {
            using (var cnx = Conexion.Open)
            {
                var obj = cnx.Procedimiento.FirstOrDefault(e => e.Codigo == codigo);
                cnx.Procedimiento.DeleteOnSubmit(obj);
                cnx.SubmitChanges();
                return true;
            }

        }
    }
}
