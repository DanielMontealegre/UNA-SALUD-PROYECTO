using ModeloDatos.Database;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace UNA_SALUD.Models
{
    public class PresionArterialModelo
    {
        public long Codigo { get; set; }

        [Required]
        public string Paciente { get; set; }

        [Required]
        [Display(Name = "Sistolica(mmHg)")]
        public double Sistolica { get; set; }

        [Required]
        [Display(Name = "Diastolica(mmHg)")]
        public double Diastolica { get; set; }

        [Required]
        [Display(Name = "Pulso(Ipm)")]
        public double Pulso { get; set; }

        [Required]
        [Display(Name = "Ritmo Irregular")]
        public bool RitmoIrregular { get; set; }

        [Required]
        [DisplayFormat(ApplyFormatInEditMode = true, DataFormatString = "{0:dd/MM/yyyy}")]
        public DateTime Fecha { get; set; }



        [DataType(DataType.MultilineText)]
        public string Detalle { get; set; }

        public PresionArterialModelo(PresionArterial presion)
        {
            Codigo = presion.Codigo;
            Paciente = presion.Paciente;
            Fecha = presion.Fecha;
            Sistolica = presion.Sistolica;
            Diastolica = presion.Diastolica;
            Pulso = presion.Pulso;
            RitmoIrregular = presion.RitmoIrregular;
            Detalle = presion.Detalle;
        }
    }
}