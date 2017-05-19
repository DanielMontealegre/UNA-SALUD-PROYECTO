using ModeloDatos.Database;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ModeloDatos.Modelo
{
    public class ConjuntoSeguros
    {
        public void AgregarSeguro(Seguro seguro) {
            using (var cnx = Conexion.Open)
            {
                cnx.Seguro.InsertOnSubmit(seguro);
                cnx.SubmitChanges();
            }
            
        }


        public IEnumerable<Seguro> GetSeguros(String email) {
            return Conexion.Open.Seguro.Where(x => x.Paciente == email).OrderByDescending(x => x.FechaFin) ;
        }

        public Seguro GetSeguro(long codigo) {
            return Conexion.Open.Seguro.FirstOrDefault(x => x.Codigo == codigo);
        }

        public Boolean Editar(Seguro seguro)
        {
            Seguro seguroAux;
            using (var cnx = Conexion.Open)
            {
                seguroAux = cnx.Seguro.FirstOrDefault(x => x.Codigo == seguro.Codigo);
                seguroAux.Cobertura = seguro.Cobertura;
                seguroAux.Detalle = seguro.Detalle;
                seguroAux.FechaInicio = seguro.FechaInicio;
                seguroAux.FechaFin = seguro.FechaFin;
                seguroAux.IdentificadorAbonado = seguro.IdentificadorAbonado;
                seguroAux.Principal = seguro.Principal;
                cnx.SubmitChanges();
            }

            return true;

        }

        public void RemoverSeguro(long codigo)
        {
            using (var cnx = Conexion.Open)
            {
                var obj = cnx.Seguro.FirstOrDefault(e => e.Codigo == codigo);
                cnx.Seguro.DeleteOnSubmit(obj);
                cnx.SubmitChanges();
            }
        }

        public IEnumerable<TipoCobertura> GetCoberturas() {
            return Conexion.Open.TipoCobertura;

        }

    }
}
