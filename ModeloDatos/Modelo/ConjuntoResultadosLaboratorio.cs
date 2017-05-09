using ModeloDatos.Database;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ModeloDatos.Modelo
{
    public class ConjuntoResultadosLaboratorio
    {


        public IEnumerable<TipoMarca> ObtenerTipoMarcas()
        {
            return Conexion.Open.TipoMarca;
        }

        public IEnumerable<TipoEstadoLaboratorio> ObtenerEstadosLaboratorio()
        {
            return Conexion.Open.TipoEstadoLaboratorio;
        }

        public IEnumerable<ResultadoLaboratorio> Obtener(string paciente)
        {
            return Conexion.Open.ResultadoLaboratorio.Where(x => x.Laboratorio1.Paciente == paciente);

        }

        public IEnumerable<ResultadoLaboratorio> ObtenerResultadosLaboratorio(long laboratorio)
        {
            return Conexion.Open.ResultadoLaboratorio.Where(x => x.Laboratorio == laboratorio);

        }

        public IEnumerable<Laboratorio> ObtenerLaboratorios(string paciente)
        {
            return Conexion.Open.Laboratorio.Where(x => x.Paciente == paciente);

        }

        public Laboratorio ObtenerLaboratorio(long codigo)
        {
            return Conexion.Open.Laboratorio.FirstOrDefault(x => x.Codigo == codigo);
        }


        public ResultadoLaboratorio ObtenerResultadoLaboratorio(long codigo)
        {
            return Conexion.Open.ResultadoLaboratorio.FirstOrDefault(x => x.Codigo == codigo);
        }


        public ResultadoLaboratorio AgregarResultadoLaboratorio(ResultadoLaboratorio resultadoLaboratorio)
        {
            using (var cnx = Conexion.Open)
            {
                cnx.ResultadoLaboratorio.InsertOnSubmit(resultadoLaboratorio);
                cnx.SubmitChanges();
            }
            return resultadoLaboratorio;
        }

        public Boolean EditarResultadoLaboratorio(ResultadoLaboratorio resultadoLaboratorio)
        {
            using (var cnx = Conexion.Open)
            {
                var ResultadolaboratorioAux = cnx.ResultadoLaboratorio.FirstOrDefault(x => x.Codigo == resultadoLaboratorio.Codigo);
                ResultadolaboratorioAux.Nombre = resultadoLaboratorio.Nombre;
                ResultadolaboratorioAux.Marca = resultadoLaboratorio.Marca;
                ResultadolaboratorioAux.Valor = resultadoLaboratorio.Valor;
                ResultadolaboratorioAux.Unidad = resultadoLaboratorio.Unidad;
                cnx.SubmitChanges();
            }
            return true;

        }


        public Laboratorio AgregarLaboratorio(Laboratorio laboratorio)
        {
            using (var cnx = Conexion.Open)
            {
                cnx.Laboratorio.InsertOnSubmit(laboratorio);
                cnx.SubmitChanges();
            }
            return laboratorio;
        }

        public Boolean EditarLaboratorio(Laboratorio laboratorio)
        {
            using (var cnx = Conexion.Open)
            {
                var laboratorioAux = cnx.Laboratorio.FirstOrDefault(x => x.Codigo == laboratorio.Codigo);
                laboratorioAux.Paciente = laboratorio.Paciente;
                laboratorioAux.NombrePanelLaboratorio = laboratorio.NombrePanelLaboratorio;
                laboratorioAux.NumeroSecuencia = laboratorio.NumeroSecuencia;
                laboratorioAux.Fecha = laboratorio.Fecha;
                laboratorioAux.Estado = laboratorio.Estado;
                laboratorioAux.Laboratorio1 = laboratorio.Laboratorio1;
                laboratorioAux.Solicitado = laboratorio.Solicitado;
                cnx.SubmitChanges();
            }
            return true;

        }

        public Boolean RemoverResultadoLaboratorio(long codigo)
        {
            using (var cnx = Conexion.Open)
            {
                var obj = cnx.ResultadoLaboratorio.FirstOrDefault(e => e.Codigo == codigo);
                cnx.ResultadoLaboratorio.DeleteOnSubmit(obj);
                cnx.SubmitChanges();
                return true;
            }

        }



    }


}


