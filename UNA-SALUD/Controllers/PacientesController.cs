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
    public class PacientesController : Controller
    {
        // GET: Pacientes
        public ActionResult Index()
        {
            return View();
        }
        [HttpGet]
        public JsonResult GetPacientes() {
            var pacientesLista = pacientes.Listar();
            return Json(pacientesLista.Select(x => new {  Email= x.Email , Nombre=x.Nombre , Apellido1=x.Apellido1 ,Apellido2= x.Apellido2 ,Sexo = x.Sexo , TipoSangre = x.TipoSangre }),JsonRequestBehavior.AllowGet);
        }


        public ActionResult Agregar() {
            return View();
        }

        [HttpPost]
        public JsonResult Guardar(ModeloDatos.Database.Paciente paciente) {
            pacientes.Agregar(paciente);
            return Json(true);
        }

        [HttpPost]
        public JsonResult Remover(String email)
        {
            pacientes.Remover(email);
            return Json(true);
        }

        [HttpPost]
        public JsonResult Editar(Paciente paciente)
        {
            pacientes.Editar(paciente);
            return Json(true);
        }

        [HttpGet]
        public JsonResult Obtener(String email)
        {

            Paciente registro = pacientes.Obtener(email);
            return Json(new
            {
                Nombre = registro.Nombre,
                Email = registro.Email,
                Apellido1 = registro.Apellido1,
                Apellido2 = registro.Apellido2,
                Sexo = registro.Sexo,
                TipoSangre = registro.TipoSangre
            }, JsonRequestBehavior.AllowGet);
        }

        public ActionResult Dashboard(string id) {
            var paciente = pacientes.Obtener("daniel@gmail.com");
            return View("Dashboard",paciente);
        }

        private ConjuntoPacientes pacientes = new ConjuntoPacientes();
    }
}