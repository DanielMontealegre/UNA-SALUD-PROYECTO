using ModeloDatos.Database;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ModeloDatos.Modelo
{
    public class ConjuntoPesos
    {
        public IEnumerable<Peso> Obtener(String paciente)
        {
            IEnumerable<Peso> pesos = Conexion.Open.Peso.
                Where(x => x.Paciente == paciente).
                OrderBy(x=>x.Fecha);
            return pesos;
        }

        public Peso Agregar(Peso pesoA)
        {
            using (var cnx = Conexion.Open)
            {
                cnx.Peso.InsertOnSubmit(pesoA);
                cnx.SubmitChanges();
            }
            return pesoA;
        }

        public Peso ObtenerPeso(int codigo)
        {

            Peso peso = Conexion.Open.Peso.FirstOrDefault(x => x.Codigo == codigo);
            return (peso != null) ? peso : new Peso();
        }

        public Peso EditarPeso(Peso peso)
        {
            Peso pesoAux;
            using (var cnx = Conexion.Open)
            {
                pesoAux = cnx.Peso.FirstOrDefault(x => x.Codigo == peso.Codigo);
                pesoAux.Peso1 = peso.Peso1;
                pesoAux.Detalle = peso.Detalle;
                pesoAux.Fecha = peso.Fecha;
                cnx.SubmitChanges();
            }

            return pesoAux;
        }

        public Boolean Remover(int codigo)
        {
            using (var cnx = Conexion.Open)
            {
                var obj = cnx.Peso.FirstOrDefault(e => e.Codigo == codigo);
                cnx.Peso.DeleteOnSubmit(obj);
                cnx.SubmitChanges();
                return true;
            }

        }

    }
}
