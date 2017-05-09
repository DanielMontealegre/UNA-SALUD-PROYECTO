using ModeloDatos.Database;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ModeloDatos.Modelo
{
    public class ConjuntoAfecciones
    {
        public IEnumerable<Afeccion> Obtener(String paciente)
        {   
            IEnumerable<Afeccion> afecciones = Conexion.Open.Afeccion.
                Where(x => x.Paciente == paciente).
                OrderBy(x => x.FechaInicio);
            return afecciones;
        }

        public List<TipoEstadoAfeccion> ObtenerEstados() {
            return Conexion.Open.TipoEstadoAfeccion.ToList();
        }

        public Afeccion Agregar(Afeccion afeccion)
        {
            using (var cnx = Conexion.Open)
            {
                cnx.Afeccion.InsertOnSubmit(afeccion);
                cnx.SubmitChanges();
            }
            return afeccion;
        }
        public Afeccion ObtenerAfeccion(int codigo)
        {
            Afeccion afeccion = Conexion.Open.Afeccion.FirstOrDefault(x => x.Codigo == codigo);
            return (afeccion != null) ? afeccion : new Afeccion();
        }

        public Boolean EditarAfeccion(Afeccion afeccion)
        {
            using (var cnx = Conexion.Open)
            {
                var afeccionAux = cnx.Afeccion.FirstOrDefault(x => x.Codigo == afeccion.Codigo);
                afeccionAux.Nombre = afeccion.Nombre;
                afeccionAux.Estado = afeccion.Estado;
                afeccionAux.Detalle = afeccion.Detalle;
                afeccionAux.FechaInicio = afeccion.FechaInicio;
                afeccionAux.FechaFin = afeccion.FechaFin;
                cnx.SubmitChanges();
            }

            return true;
        }

        public Boolean RemoverAfeccion(int codigo)
        {
            using (var cnx = Conexion.Open)
            {
                var obj = cnx.Afeccion.FirstOrDefault(e => e.Codigo == codigo);
                cnx.Afeccion.DeleteOnSubmit(obj);
                cnx.SubmitChanges();
                return true;
            }

        }



    }
}
