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
    public class PresionArterialController : Controller
    {
        // GET: PresionArterial
        public ActionResult Index(string id)
        {
            var pacienteDB = pacientes.Obtener(id);
            var pacienteModelo = new PacienteRegistro(pacienteDB);
            ViewBag.Paciente = pacienteModelo;
            return View();
        }

        public JsonResult GetPresionesArteriales(string id)
        {
            if (id != null)
            {
                var listaPresionesBD = presionesArteriales.Obtener(id);
                var listaPresionesModelos = listaPresionesBD.Select(x => new PresionArterialModelo(x));
                return Json(listaPresionesModelos, JsonRequestBehavior.AllowGet);
            }
            return Json(true);
        }

        public JsonResult AgregarPresionArterial(PresionArterial presionArterial)
        {
            var presionDB = presionesArteriales.Agregar(presionArterial);
            return Json(new { Resultado = true, PresionArterial = new PresionArterialModelo(presionDB) });
        }

        public JsonResult ObtenerPresionArterial(int codigo)
        {
            PresionArterial presionDB = presionesArteriales.ObtenerPresionArterial(codigo);
            return Json(new PresionArterialModelo(presionDB), JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult EditarPresionArterial(PresionArterial presionArterial)
        {
            var presionEditadoDb = presionesArteriales.EditarPresionArterial(presionArterial);
            return Json(new { Resultado = true, PresionArterial = new PresionArterialModelo(presionEditadoDb) });
        }

        public JsonResult RemoverPresionArterial(int codigo)
        {
            presionesArteriales.Remover(codigo);
            return Json(true);
        }

        private ConjuntoPresionesArteriales presionesArteriales = new ConjuntoPresionesArteriales();
        private ConjuntoPacientes pacientes = new ConjuntoPacientes();

    }
}