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
    public class PesosController : Controller
    {
        // GET: Pesos
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Paciente(string id) {
            var pacienteDB = pacientes.Obtener(id);
            var pacienteModelo = new PacienteRegistro(pacienteDB);
            ViewBag.Paciente = pacienteModelo;
            return View();
        }

        public JsonResult GetPesos(string id) {
            if (id != null)
            {
                var listaPesosBD = pesos.Obtener(id);
                var listaPesosModelos = listaPesosBD.Select(x => new PesoModelo(x));
                return Json(listaPesosModelos,JsonRequestBehavior.AllowGet);
            }
            return Json(true);
        }

        public JsonResult AgregarPeso(Peso peso) {
            var pesoDB = pesos.Agregar(peso);
            return Json(new { Resultado=true,Peso = new PesoModelo(pesoDB)});
        }

        public JsonResult ObtenerPeso(int codigo)
        {
            Peso pesoDB = pesos.ObtenerPeso(codigo);
            return Json(new PesoModelo(pesoDB), JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult EditarPeso(Peso peso)
        {
            var pesoEditadoDb =pesos.EditarPeso(peso);
            return Json(new{Resultado= true,Peso= new PesoModelo(pesoEditadoDb) });
        }

        public JsonResult RemoverPeso(int codigo) {
            pesos.Remover(codigo);
            return Json(true);
        }

        private ConjuntoPesos pesos = new ConjuntoPesos();
        private ConjuntoPacientes pacientes = new ConjuntoPacientes();
    }
}