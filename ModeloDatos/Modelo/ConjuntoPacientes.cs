using ModeloDatos.Database;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ModeloDatos.Modelo
{
    public class ConjuntoPacientes
    {
        public void Agregar(Paciente paciente) {
            using (var cnx = Conexion.Open)
            {
                cnx.Paciente.InsertOnSubmit(paciente);
                cnx.SubmitChanges();
            }
        }

        public IEnumerable<Paciente> Listar()
        {
            return Conexion.Open.Paciente.
                OrderBy(e => e.Apellido1).
                ThenBy(e => e.Apellido2).
                ThenBy(e => e.Nombre);
        }

        public void Remover(String email)
        {
            using (var cnx = Conexion.Open)
            {
                var obj = cnx.Paciente.FirstOrDefault(e => e.Email == email);
                cnx.Paciente.DeleteOnSubmit(obj);
                cnx.SubmitChanges();
            }
        }

        public Boolean Editar(Paciente paciente)
        {
            using (var cnx = Conexion.Open)
            {
                var pacienteAux = cnx.Paciente.FirstOrDefault(x => x.Email == paciente.Email);
                pacienteAux.Nombre = paciente.Nombre;
                pacienteAux.Apellido1 = paciente.Apellido1;
                pacienteAux.Apellido2 = paciente.Apellido2;
                pacienteAux.Sexo = paciente.Sexo;
                pacienteAux.TipoSangre = paciente.TipoSangre;
                cnx.SubmitChanges();
            }

            return true;

        }

        public Paciente Obtener(String email)
        {
            Paciente paciente = null;
            paciente = Conexion.Open.Paciente.FirstOrDefault(x => x.Email == email);
            return paciente;

        }


    }
}
