using ModeloDatos.Database;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace UNA_SALUD.Models
{
    public class AfeccionRegistro
    {
        public AfeccionRegistro()
        {

        }


        [Required]
        [DataType(DataType.EmailAddress)]
        [StringLength(80)]
        public string Paciente { get; set; }


        public long Codigo { get; set; }

        [Required]
        public int Estado { get; set; }

        [Required]
        public String EstadoString { get; set; }


        [Required]
        [DataType(DataType.Date)]
        [Display(Name = "Fecha de Inicio")]
        public DateTime FechaInicio { get; set; }


        [DataType(DataType.Date)]
        [Display(Name = "Fecha de Fin")]
        public DateTime FechaFin { get; set; }

        [Required]
        public string Nombre { get; set; }

        [Display(Name = "Notas")]
        public string Detalle { get; set; }

        public IEnumerable<SelectListItem> Estados { get; set; }
    }

    public class AlergiaRegistro {

        public AlergiaRegistro() {

        }

        [Required]
        [DataType(DataType.EmailAddress)]
        [StringLength(80)]
        public string Paciente { get; set; }


        public long Codigo { get; set; }

        [Required]
        [Display(Name ="Tipo Alergia")]
        public int Tipo { get; set; }


        [Required]
        [Display(Name = "Tipo Reacción")]
        public int Reaccion { get; set; }

        [Required]
        public string Tratamiento { get; set; }

        [Display(Name = "Notas")]
        public string Detalle { get; set; }

        public IEnumerable<SelectListItem> Tipos { get; set; }
        public IEnumerable<SelectListItem> Reacciones { get; set; }


    }

    public class VacunaRegistro
    {

        public long Codigo { get; set; }

        [Required]
        [DataType(DataType.EmailAddress)]
        [StringLength(80)]
        public string Paciente { get; set; }

        [Required]
        public string Nombre { get; set; }

        [Required]
        [DataType(DataType.Date)]
        [Display(Name = "Fecha de Recepcion")]
        public DateTime FechaRecepcion { get; set; }

        [Required]
        public int Administracion { get; set; }

        [Display(Name = "Numero de Secuencia")]
        public string NumeroSecuencia { get; set; }

        [Display(Name = "Efectos Secundarios")]
        public string EfectoSecundarios { get; set; }

        [Display(Name = "Parte del Cuerpo")]
        public string ParteCuerpo { get; set; }

        [Display(Name = "Notas")]
        public string Detalle { get; set; }

        public IEnumerable<SelectListItem> Administraciones { get; set; }

    }
    public class ResultadosLaboratorioRegistro
    {

        //----------------RESULTADOS LABORATORIO-------------///
        public int codigo { get; set; }

        [Display(Name = "Marca")]
        public int Marca { get; set; }

        [Display(Name = "Laboratorio")]
        public long Laboratorio { get; set; }

        [Display(Name = "Nombre")]
        public String Nombre { get; set; }

        [Display(Name = "Valor")]
        public String Valor { get; set; }

        [Display(Name = "Unidad")]
        public String Unidad { get; set; }

        public IEnumerable<SelectListItem> TiposMarcas { get; set; }

    }
    public class LaboratorioRegistro
    {



        [Required]
        [Display(Name = "Paciente")]
        public String Paciente { get; set; }

        [Display(Name = "Estado")]
        public int Estado { get; set; }


        [Required]
        [Display(Name = "Panel Laboratorio")]
        public String NombrePanelLaboratorio { get; set; }

        [Display(Name = "Solicitado")]
        public String Solicitado { get; set; }

        [Display(Name = "Laboratorio")]
        public String Laboratorio { get; set; }

        [Display(Name = "Numero Secuencia")]
        public String Unidad { get; set; }

        [Required]
        [Display(Name = "Fecha de Realización")]
        [DisplayFormat(DataFormatString = "{0:dd/MM/yyyy}", ApplyFormatInEditMode = true)]
        public DateTime Fecha { get; set; }

        public IEnumerable<SelectListItem> Estados { get; set; }
    }


    public class ModelAgregarResultadoLaboratorioRegistro
    {
        public LaboratorioRegistro laboratorioRegistro { get; set; }
        public ResultadosLaboratorioRegistro ResultadoLaboratorioRegistro { get; set; }
    }

    /////////////////////////////// Medicamentos

    public class MedicamentoRegistro
    {
        public MedicamentoRegistro()
        {

        }


        [Required]
        [DataType(DataType.EmailAddress)]
        [StringLength(80)]
        public string Paciente { get; set; }


        public long Codigo { get; set; }

        [Required]
        [Display(Name = "Concentración")]
        public int Concentracion { get; set; }

        [Required]
        public int Dosis { get; set; }

        [Required]
        [Display(Name = "Administración")]
        public int Administracion { get; set; }


        [Required]
        [DataType(DataType.Date)]
        [Display(Name = "Fecha de Inicio")]
        public DateTime FechaInicio { get; set; }


        [DataType(DataType.Date)]
        [Display(Name = "Fecha de Fin")]
        public DateTime FechaFin { get; set; }

        [Required]
        public string Nombre { get; set; }

        [Required]
        public string Frecuencia { get; set; }

        [Required]
        public string Motivo { get; set; }

        [Display(Name = "Notas")]
        public string Detalle { get; set; }

        public IEnumerable<SelectListItem> TiposConcentracion { get; set; }
        public IEnumerable<SelectListItem> TiposDosis { get; set; }
        public IEnumerable<SelectListItem> TiposAdministracion { get; set; }

        public MedicamentoRegistro(Medicamento medic)
        {
            Paciente = medic.Paciente;
            Codigo = medic.Codigo;
            Concentracion = medic.Concentracion;
            Dosis = medic.Dosis;
            Administracion = medic.Administracion;
            Nombre = medic.Nombre;
            Frecuencia = medic.Frecuencia;
            Motivo = medic.Motivo;
            FechaInicio = medic.FechaInicio;
            FechaFin = (DateTime)medic.FechaFin;
            Detalle = medic.Detalle;
        }
    }

    //////////////////// Fin de Medicamentos
}