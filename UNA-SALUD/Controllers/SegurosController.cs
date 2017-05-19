using ModeloDatos.Database;
using ModeloDatos.Modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using UNA_SALUD.Models;

namespace UNA_SALUD.Controllers
{
    public class SegurosController : Controller
    {
        // GET: Seguros
        public ActionResult Paciente(string id)
        {
            var pacienteDB = pacientes.Obtener(id);
            var pacienteModelo = new PacienteRegistro(pacienteDB);
            ViewBag.Paciente = pacienteModelo;
            IEnumerable<TipoCobertura> coberturas = seguros.GetCoberturas();
            List<SelectListItem> itemsTipos = new List<SelectListItem>();

            foreach (var cobertura in coberturas)
            {
                itemsTipos.Add(new SelectListItem { Text = cobertura.Descripcion, Value = cobertura.Codigo.ToString() });
            }
            var vm = new SeguroModelo();
            vm.Coberturas = itemsTipos;
            return View(vm);
        }

        [HttpPost]
        public JsonResult AgregarSeguro(Seguro seguro) {
            seguros.AgregarSeguro(seguro);
            return Json(new { Resultado = true });
        }

        [HttpPost]
        public JsonResult EditarSeguro(Seguro seguro) {
             var resultado = seguros.Editar(seguro);
           


            return Json(new { Resultado = true });
        }

        [HttpGet]
        public JsonResult GetSeguros(String id)
        {
            if (id != null)
            {
                var listaSegurosBD = seguros.GetSeguros(id);
                var listaSegurosModelo = listaSegurosBD.Select(x => new SeguroModelo(x));
                return Json(listaSegurosModelo, JsonRequestBehavior.AllowGet);
            }
            return Json(true);
        }


        [HttpGet]
        public JsonResult ObtenerSeguro(int codigo)
        {
            Seguro seguroBD = seguros.GetSeguro(codigo);
            return Json(new SeguroModelo(seguroBD), JsonRequestBehavior.AllowGet);
        }


        public JsonResult RemoverSeguro(int codigo)
        {
            seguros.RemoverSeguro(codigo);
            return Json(true);
        }


        private ConjuntoPacientes pacientes = new ConjuntoPacientes();
        private ConjuntoSeguros seguros = new ConjuntoSeguros();
    }

}