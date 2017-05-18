using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using ModeloDatos.Database;
using System.Web;

namespace UNA_SALUD.Models
{
    public class AlturaModelo
    {
        public long Codigo { get; set; }

        [Required]
        public string Paciente { get; set; }

        [Required]
        [Display(Name = "Altura(Cm)")]
        public double Altura1 { get; set; }

        [Required]
        [DisplayFormat(ApplyFormatInEditMode = true, DataFormatString = "{0:dd/MM/yyyy}")]
        public DateTime Fecha { get; set; }

        [DataType(DataType.MultilineText)]
        public string Detalle { get; set; }

        public AlturaModelo(Altura altura)
        {
            Codigo = altura.Codigo;
            Paciente = altura.Paciente;
            Fecha = altura.Fecha;
            Altura1 = altura.Altura1;
            Detalle = altura.Detalle;
        }




    }
}