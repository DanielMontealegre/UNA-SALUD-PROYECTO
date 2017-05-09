using ModeloDatos.Database;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ModeloDatos.Modelo
{
    public class ConjuntoVacunas
    {
        public IEnumerable<Vacuna> ObtenerVacunas(String paciente)
        {
            return Conexion.Open.Vacuna.
                Where(x => x.Paciente == paciente).
                OrderBy(x => x.FechaRecepcion);
        }

        public IEnumerable<TipoAdministracionVacuna> ObtenerAdministraciones()
        {
            return Conexion.Open.TipoAdministracionVacuna;
        }

        public Vacuna Agregar(Vacuna vacuna)
        {
            using (var cnx = Conexion.Open)
            {
                cnx.Vacuna.InsertOnSubmit(vacuna);
                cnx.SubmitChanges();
            }
            return vacuna;
        }
        public Vacuna ObtenerVacuna(int codigo)
        {
            Vacuna vacuna = Conexion.Open.Vacuna.FirstOrDefault(x => x.Codigo == codigo);
            return (vacuna != null) ? vacuna : new Vacuna();
        }

        public Boolean EditarVacuna(Vacuna vacuna)
        {
            using (var cnx = Conexion.Open)
            {
                var vacunaAux = cnx.Vacuna.FirstOrDefault(x => x.Codigo == vacuna.Codigo);
                vacunaAux.Nombre = vacuna.Nombre;
                vacunaAux.Administracion = vacuna.Administracion;
                vacunaAux.Detalle = vacuna.Detalle;
                vacunaAux.FechaRecepcion = vacuna.FechaRecepcion;
                vacunaAux.NumeroSecuencia = vacuna.NumeroSecuencia;
                vacunaAux.ParteCuerpo = vacuna.ParteCuerpo;
                vacunaAux.EfectoSecundarios = vacuna.EfectoSecundarios;
                cnx.SubmitChanges();
            }

            return true;
        }

        public Boolean RemoverVacuna(int codigo)
        {
            using (var cnx = Conexion.Open)
            {
                var obj = cnx.Vacuna.FirstOrDefault(e => e.Codigo == codigo);
                cnx.Vacuna.DeleteOnSubmit(obj);
                cnx.SubmitChanges();
                return true;
            }

        }

    }
}
