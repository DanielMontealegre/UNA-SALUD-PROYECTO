using ModeloDatos.Database;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace ModeloDatos.Modelo
{
    public class ConjuntoAlturas
    {
        public IEnumerable<Altura> Obtener(String paciente)
        {
            IEnumerable<Altura> pesos = Conexion.Open.Altura.
                Where(x => x.Paciente == paciente).
                OrderBy(x => x.Fecha);
            return pesos;
        }

        public Altura Agregar(Altura altura)
        {
            using (var cnx = Conexion.Open)
            {
                cnx.Altura.InsertOnSubmit(altura);
                cnx.SubmitChanges();
            }
            return altura;
        }

        public Altura ObtenerPeso(int codigo)
        {

            Altura altura = Conexion.Open.Altura.FirstOrDefault(x => x.Codigo == codigo);
            return (altura != null) ? altura : new Altura();
        }

        public Altura EditarPeso(Altura altura)
        {
            Altura alturaAux;
            using (var cnx = Conexion.Open)
            {
                alturaAux = cnx.Altura.FirstOrDefault(x => x.Codigo == altura.Codigo);
                alturaAux.Altura1 = altura.Altura1;
                alturaAux.Detalle = altura.Detalle;
                alturaAux.Fecha = altura.Fecha;
                cnx.SubmitChanges();
            }

            return alturaAux;
        }

        public Boolean Remover(int codigo)
        {
            using (var cnx = Conexion.Open)
            {
                var obj = cnx.Altura.FirstOrDefault(e => e.Codigo == codigo);
                cnx.Altura.DeleteOnSubmit(obj);
                cnx.SubmitChanges();
                return true;
            }

        }
    }
}
