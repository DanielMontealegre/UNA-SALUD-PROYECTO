using ModeloDatos.Database;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace UNA_SALUD.Models
{
    public class SeguroModelo
    {

        public long Codigo { get; set; }

        [Required]
        public String Paciente { get; set; }

        [Required]
        [Display(Name = "Cobertura")]
        public String Cobertura { get; set; }

        [Required]
        [Display(Name = "Primario")]
        public Boolean Principal { get; set; }

        [DataType(DataType.MultilineText)]
        public String IdentificadorAbonado { set; get; }


        [DataType(DataType.MultilineText)]
        public String Detalle { set; get; }


        [Required]
        [DisplayFormat(ApplyFormatInEditMode = true, DataFormatString = "{0:dd/MM/yyyy}")]
        public DateTime FechaInicio { get; set; }

        [Required]
        [DisplayFormat(ApplyFormatInEditMode = true, DataFormatString = "{0:dd/MM/yyyy}")]
        public DateTime FechaFin { get; set; }

        public IEnumerable<SelectListItem> Coberturas { get; set; }

        public int CodigoCobertura { get; set; }

        public SeguroModelo(Seguro seguro) {
            
            if (seguro.TipoCobertura != null)
            {
                Cobertura = seguro.TipoCobertura.Descripcion;
                CodigoCobertura = seguro.TipoCobertura.Codigo;
            }

            else {
                Cobertura = Coberturas.FirstOrDefault(x => int.Parse(x.Value) == seguro.Cobertura).Text;
                CodigoCobertura = int.Parse(Coberturas.FirstOrDefault(x => int.Parse(x.Value) == seguro.Cobertura).Value);
            }
            Codigo = seguro.Codigo;
            Principal = seguro.Principal;
            IdentificadorAbonado = seguro.IdentificadorAbonado;
            FechaInicio = (DateTime) seguro.FechaInicio;
            FechaFin = (DateTime) seguro.FechaFin;
            Detalle = seguro.Detalle;
        }



        public SeguroModelo() {

        }
    }
}