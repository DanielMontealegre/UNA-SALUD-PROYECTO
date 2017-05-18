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
    public class AlturasController : Controller
    {

        public ActionResult Paciente(string id)
        {
            var pacienteDB = pacientes.Obtener(id);
            var pacienteModelo = new PacienteRegistro(pacienteDB);
            ViewBag.Paciente = pacienteModelo;
            return View();
        }

        public JsonResult GetAlturas(string id)
        {
            if (id != null)
            {
                var listaAlturasBD = alturas.Obtener(id);
                var listaAlturasModelos = listaAlturasBD.Select(x => new AlturaModelo(x));
                return Json(listaAlturasModelos, JsonRequestBehavior.AllowGet);
            }
            return Json(true);
        }

        public JsonResult AgregarAltura(Altura altura)
        {
            var alturaBD = alturas.Agregar(altura);
            return Json(new { Resultado = true, Altura = new AlturaModelo(alturaBD) });
        }

        public JsonResult ObtenerAltura(int codigo)
        {
            Altura alturaBD = alturas.ObtenerPeso(codigo);
            return Json(new AlturaModelo(alturaBD), JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult EditarAltura(Altura altura)
        {
            var alturaEditaBD = alturas.EditarPeso(altura);
            return Json(new { Resultado = true, Altura = new AlturaModelo(alturaEditaBD) });
        }

        public JsonResult RemoverAltura(int codigo)
        {
            alturas.Remover(codigo);
            return Json(true);
        }

        private ConjuntoAlturas alturas = new ConjuntoAlturas();
        private ConjuntoPacientes pacientes = new ConjuntoPacientes();
    }
}
