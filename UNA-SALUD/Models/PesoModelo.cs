using ModeloDatos.Database;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace UNA_SALUD.Models
{
    public class PesoModelo
    {
        public long Codigo { get; set; }

        [Required]
        public string Paciente { get; set; }

        [Required]
        [Display (Name="Peso")]
        public double Peso1 { get; set; }

        [Required]
        [DisplayFormat(ApplyFormatInEditMode = true, DataFormatString = "{0:dd/MM/yyyy}")]
        public DateTime Fecha { get; set; }

        public string Detalle { get; set; }

        public PesoModelo(Peso peso) {
            Codigo = peso.Codigo;
            Paciente = peso.Paciente;
            Fecha = peso.Fecha;
            Peso1 = peso.Peso1;
            Detalle = peso.Detalle;
        }
    }
}