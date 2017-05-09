using ModeloDatos.Database;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ModeloDatos.Modelo
{
    public class ConjuntoMedicamentos
    {
        public IEnumerable<Medicamento> Obtener(String paciente)
        {
            IEnumerable<Medicamento> medicamentos = Conexion.Open.Medicamento.
                Where(x => x.Paciente == paciente);
            return medicamentos;
        }

        public List<TipoConcentracion> ObtenerConcentraciones()
        {
            return Conexion.Open.TipoConcentracion.ToList();
        }

        public List<TipoDosis> ObtenerTiposDosis()
        {
            return Conexion.Open.TipoDosis.ToList();
        }

        public List<TipoAdministracion> ObtenerTipoAdministracion()
        {
            return Conexion.Open.TipoAdministracion.ToList();
        }

        public Medicamento Agregar(Medicamento medicamento)
        {
            using (var cnx = Conexion.Open)
            {
                cnx.Medicamento.InsertOnSubmit(medicamento);
                cnx.SubmitChanges();
            }
            return medicamento;
        }

        public Medicamento ObtenerMedicamento(int codigo)
        {
            Medicamento medicamento = Conexion.Open.Medicamento.FirstOrDefault(x => x.Codigo == codigo);
            return (medicamento != null) ? medicamento : new Medicamento();
        }

        public Boolean EditarMedicamento(Medicamento medicamento)
        {
            using (var cnx = Conexion.Open)
            {
                var medicamentoAux = cnx.Medicamento.FirstOrDefault(x => x.Codigo == medicamento.Codigo);
                medicamentoAux.Paciente = medicamento.Paciente;
                medicamentoAux.Concentracion = medicamento.Concentracion;
                medicamentoAux.Dosis = medicamento.Dosis;
                medicamentoAux.Administracion = medicamento.Administracion;
                medicamentoAux.Nombre = medicamento.Nombre;
                medicamentoAux.Frecuencia = medicamento.Frecuencia;
                medicamentoAux.Motivo = medicamento.Motivo;
                medicamentoAux.FechaInicio = medicamento.FechaInicio;
                medicamentoAux.FechaFin = medicamento.FechaFin;
                medicamentoAux.Detalle = medicamento.Detalle;
                cnx.SubmitChanges();
            }

            return true;
        }

        public Boolean RemoverMedicamento(int codigo)
        {
            using (var cnx = Conexion.Open)
            {
                var obj = cnx.Medicamento.FirstOrDefault(e => e.Codigo == codigo);
                cnx.Medicamento.DeleteOnSubmit(obj);
                cnx.SubmitChanges();
                return true;
            }

        }
    }
}
