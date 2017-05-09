using ModeloDatos.Database;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace UNA_SALUD.Models
{
    public class PacienteRegistro
    {
        [Required]
        [DataType(DataType.EmailAddress)]
        [StringLength(80)]
        public string Email { get; set; }




        [DataType(DataType.Date)]
        [Display(Name = "Tipo de sangre")]
        public DateTime TipoSangre { get; set; }

        [Required]
        public string Nombre { get; set; }

        [Required]
        [Display(Name = "Primer apellido")]
        public string Apellido1 { get; set; }

        [Display(Name = "Segundo apellido")]
        public string Apellido2 { get; set; }


        public string NombreCompleto{
            get {
                return Nombre + ' ' + Apellido1 + ' ' + Apellido2;
            }
          }

        public bool Sexo { get; set; }


        public PacienteRegistro(Paciente pacienteDB) {
            Email = pacienteDB.Email;
            TipoSangre = (DateTime)pacienteDB.TipoSangre;
            Nombre = pacienteDB.Nombre;
            Apellido1 = pacienteDB.Apellido1;
            Apellido2 = pacienteDB.Apellido2;
            Sexo = pacienteDB.Sexo;
        }



    }
}