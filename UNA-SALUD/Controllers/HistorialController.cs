using ModeloDatos.Database;
using ModeloDatos.Modelo;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using UNA_SALUD.Models;

namespace UNA_SALUD.Controllers
{
    public class HistorialController : Controller
    {
        // GET: Historial
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Afecciones(string id)
        {
            Paciente paciente = pacientes.Obtener("daniel@gmail.com");
            ViewBag.Paciente = paciente;
            IEnumerable<TipoEstadoAfeccion> estados = afecciones.ObtenerEstados();

            List<SelectListItem> items = new List<SelectListItem>();

            foreach (var estado in estados)
            {
                items.Add(new SelectListItem { Text = estado.Descripcion, Value = estado.Codigo.ToString() });
            }

            var vm = new AfeccionRegistro();
            vm.Estados = items;


            return View(vm);
        }




        public JsonResult GetAfecciones(string id)
        {
            IEnumerable<Afeccion> afeccionesBomba = afecciones.Obtener("daniel@gmail.com");
            return Json(afeccionesBomba.Select(x => new { x.Codigo, x.Nombre, x.Paciente, x.Detalle, Estado = x.TipoEstadoAfeccion.Descripcion, x.FechaInicio, x.FechaFin }), JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetEstadosAfeccion()
        {
            return Json(afecciones.ObtenerEstados().Select(x => new { x.Codigo, x.Descripcion }), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GuardarAfeccion(Afeccion afeccion)
        {
            var afeccionCodigo = afecciones.Agregar(afeccion).Codigo;
            return Json(new { Resultado = true, CodigoAfeccion = afeccionCodigo });
        }

        [HttpGet]
        public JsonResult ObtenerAfeccion(int codigo)
        {

            Afeccion registro = afecciones.ObtenerAfeccion(codigo);
            return Json(new
            {
                Codigo = registro.Codigo,
                Nombre = registro.Nombre,
                Paciente = registro.Paciente,
                Estado = registro.TipoEstadoAfeccion.Codigo,
                Detalle = registro.Detalle,
                FechaInicio = registro.FechaInicio,
                FechaFin = registro.FechaFin
            }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult EditarAfeccion(Afeccion afeccion)
        {
            afecciones.EditarAfeccion(afeccion);
            return Json(true);
        }

        public JsonResult RemoverAfeccion(int codigo)
        {
            afecciones.RemoverAfeccion(codigo);
            return Json(true);
        }



        //////////////////////////////////////////// ALERGIAS ////////////////////////////////////////////

        public ActionResult Alergias(string id) {
            ViewBag.Paciente = pacientes.Obtener("daniel@gmail.com");

            IEnumerable<TipoAlergia> tipos = alergias.ObtenerTipos();

            List<SelectListItem> itemsTipos = new List<SelectListItem>();

            foreach (var tipo in tipos)
            {
                itemsTipos.Add(new SelectListItem { Text = tipo.Descripcion, Value = tipo.Codigo.ToString() });
            }

            IEnumerable<TipoReacción> reacciones = alergias.ObtenerReacciones();

            List<SelectListItem> itemsReacciones = new List<SelectListItem>();

            foreach (var reaccion in reacciones)
            {
                itemsReacciones.Add(new SelectListItem { Text = reaccion.Descripcion, Value = reaccion.Codigo.ToString() });
            }

            var vm = new AlergiaRegistro();
            vm.Tipos = itemsTipos;
            vm.Reacciones = itemsReacciones;
            return View(vm);
        }

        public JsonResult GetAlergias(string id) {
            IEnumerable<Alergia> alergiasSinFiltro = alergias.Obtener("daniel@gmail.com");
            return Json(alergiasSinFiltro.Select(
                x => new {x.Codigo,x.Paciente,
                    Reaccion = new { x.TipoReacción.Codigo,x.TipoReacción.Descripcion },
                    Tipo = new { x.TipoAlergia.Codigo,x.TipoAlergia.Descripcion },
                    x.Tratamiento,x.Detalle}
                ),JsonRequestBehavior.AllowGet); //Mas ordenado y usar Modelos y ModelsView ver Mosh y favoritos
        }

        [HttpGet]
        public JsonResult GetTiposAlergias()
        {
            return Json(alergias.ObtenerTipos().Select(x => new { x.Codigo, x.Descripcion }), JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetTiposReacciones()
        {
            return Json(alergias.ObtenerReacciones().Select(x => new { x.Codigo, x.Descripcion }), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GuardarAlergia(Alergia alergia)
        {
            var alergiaCodigo = alergias.Agregar(alergia).Codigo;
            return Json(new { Resultado = true, CodigoAlergia = alergiaCodigo });
        }

        [HttpGet]
        public JsonResult ObtenerAlergia(int codigo)
        {

            Alergia registro = alergias.ObtenerAlergia(codigo);
            return Json(new
            {
                Codigo = registro.Codigo,
                Paciente = registro.Paciente,
                Tipo = registro.Tipo,
                Detalle = registro.Detalle,
                Reaccion = registro.Reaccion,
                Tratamiento = registro.Tratamiento
            }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult EditarAlergia(Alergia alergia)
        {
            alergias.EditarAlergia(alergia);
            return Json(true);
        }

        public JsonResult RemoverAlergia(int codigo)
        {
            alergias.RemoverAlergia(codigo);
            return Json(true);
        }

        /////////////////////////////////// VACUNAS  /////////////////////////////////////////////////////
        public ActionResult Vacunas(string id)
        {
            Paciente paciente = pacientes.Obtener("daniel@gmail.com");
            ViewBag.Paciente = paciente;
            IEnumerable<TipoAdministracionVacuna> administraciones = vacunas.ObtenerAdministraciones();

            List<SelectListItem> items = new List<SelectListItem>();

            foreach (var administracion in administraciones)
            {
                items.Add(new SelectListItem { Text = administracion.Descripcion, Value = administracion.Codigo.ToString() });
            }

            var vm = new VacunaRegistro();
            vm.Administraciones = items;


            return View(vm);
        }

        public JsonResult GetVacunas(string id)
        {
            IEnumerable<Vacuna> vacunasPaciente = vacunas.ObtenerVacunas("daniel@gmail.com");
            return Json(vacunasPaciente.Select(x => new { x.Codigo, x.Nombre, x.Paciente, x.Detalle, Administracion = x.TipoAdministracionVacuna.Descripcion, x.FechaRecepcion, x.NumeroSecuencia, x.ParteCuerpo, x.EfectoSecundarios }), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetAdministracionesVacuna()
        {
            return Json(vacunas.ObtenerAdministraciones().Select(x => new { x.Codigo, x.Descripcion }), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GuardarVacuna(Vacuna vacuna)
        {
            var vacunaCodigo = vacunas.Agregar(vacuna).Codigo;
            return Json(new { Resultado = true, CodigoVacuna = vacunaCodigo });
        }


        public JsonResult ObtenerVacuna(int codigo)
        {

            Vacuna registro = vacunas.ObtenerVacuna(codigo);
            return Json(new
            {
                Codigo = registro.Codigo,
                Nombre = registro.Nombre,
                Paciente = registro.Paciente,
                Administracion = registro.TipoAdministracionVacuna.Codigo,
                Detalle = registro.Detalle,
                FechaRecepcion = registro.FechaRecepcion,
                NumeroSecuencia = registro.NumeroSecuencia,
                ParteCuerpo = registro.ParteCuerpo,
                EfectoSecundarios = registro.EfectoSecundarios
            }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult EditarVacuna(Vacuna vacuna)
        {
            vacunas.EditarVacuna(vacuna);
            return Json(true);
        }

        public JsonResult RemoverVacuna(int codigo)
        {
            vacunas.RemoverVacuna(codigo);
            return Json(true);
        }

        /// /////////////////////////////////////// FIN VACUNAS ////////////////////////////////////////////
        /////////////////////////////////// RESULTADOS DE LABORATORIO /////////////////////////////////////////////////////




        public ActionResult AgregarResultadoLaboratorio(string id)
        {
            Paciente paciente = pacientes.Obtener(id);
            ViewBag.Paciente = paciente;
            IEnumerable<TipoMarca> tiposMarcas = resultadosLaboratorio.ObtenerTipoMarcas();

            List<SelectListItem> items = new List<SelectListItem>();

            foreach (var tipoMarca in tiposMarcas)
            {
                items.Add(new SelectListItem { Text = tipoMarca.Descripcion, Value = tipoMarca.Codigo.ToString() });
            }


            IEnumerable<TipoEstadoLaboratorio> EstadosLaboratorio = resultadosLaboratorio.ObtenerEstadosLaboratorio();

            List<SelectListItem> items2 = new List<SelectListItem>();

            foreach (var estado in EstadosLaboratorio)
            {
                items2.Add(new SelectListItem { Text = estado.Descripcion, Value = estado.Codigo.ToString() });
            }



            var vm = new ModelAgregarResultadoLaboratorioRegistro();
            vm.ResultadoLaboratorioRegistro = new ResultadosLaboratorioRegistro();
            vm.laboratorioRegistro = new LaboratorioRegistro();
            vm.ResultadoLaboratorioRegistro.TiposMarcas = items;
            vm.laboratorioRegistro.Estados = items2;
            return View(vm);
        }


        public ActionResult ResutaldosLaboratorio(string id)
        {
            Paciente paciente = pacientes.Obtener("daniel@gmail.com");
            ViewBag.Paciente = paciente;
            IEnumerable<TipoMarca> tiposMarcas = resultadosLaboratorio.ObtenerTipoMarcas();

            List<SelectListItem> items = new List<SelectListItem>();

            foreach (var tipoMarca in tiposMarcas)
            {
                items.Add(new SelectListItem { Text = tipoMarca.Descripcion, Value = tipoMarca.Codigo.ToString() });
            }


            IEnumerable<TipoEstadoLaboratorio> EstadosLaboratorio = resultadosLaboratorio.ObtenerEstadosLaboratorio();

            List<SelectListItem> items2 = new List<SelectListItem>();

            foreach (var estado in EstadosLaboratorio)
            {
                items2.Add(new SelectListItem { Text = estado.Descripcion, Value = estado.Codigo.ToString() });
            }



            var vm = new ModelAgregarResultadoLaboratorioRegistro();
            vm.ResultadoLaboratorioRegistro = new ResultadosLaboratorioRegistro();
            vm.laboratorioRegistro = new LaboratorioRegistro();
            vm.ResultadoLaboratorioRegistro.TiposMarcas = items;
            vm.laboratorioRegistro.Estados = items2;
            return View(vm);
        }


        [HttpPost]
        public JsonResult GuardarResultadoLaboratorio(FormCollection form)
        {
            ValueProviderResult a = form.GetValue("ResultadoLaboratorioRegistro.Laboratorio");
            long Laboratorio = (long)form.GetValue("ResultadoLaboratorioRegistro.Laboratorio").ConvertTo(typeof(long));
            int Marca = (int)form.GetValue("ResultadoLaboratorioRegistro.Marca").ConvertTo(typeof(int));
            String Nombre = (String)form.GetValue("ResultadoLaboratorioRegistro.Nombre").ConvertTo(typeof(String));
            String Valor = (String)form.GetValue("ResultadoLaboratorioRegistro.Valor").ConvertTo(typeof(String));
            String Unidad = (String)form.GetValue("ResultadoLaboratorioRegistro.Unidad").ConvertTo(typeof(String));


            ResultadoLaboratorio resultadoLaboratorio = new ResultadoLaboratorio();
            resultadoLaboratorio.Nombre = Nombre;
            resultadoLaboratorio.Marca = Marca;
            resultadoLaboratorio.Valor = Valor;
            resultadoLaboratorio.Unidad = Unidad;
            resultadoLaboratorio.Laboratorio = Laboratorio;
            resultadosLaboratorio.AgregarResultadoLaboratorio(resultadoLaboratorio);



            return Json(true);
        }


        [HttpGet]
        public JsonResult GetResutaldosLaboratorio(string id)
        {
            resultadosLaboratorio.Obtener(id);
            return Json(resultadosLaboratorio.Obtener(id).Select(x => new { x.Codigo, x.Nombre, Marca = x.TipoMarca.Descripcion, x.Laboratorio, x.Valor, x.Unidad }), JsonRequestBehavior.AllowGet);
        }


        [HttpGet]
        public JsonResult GetResultadosDelLaboratorio(long id)
        {
            return Json(resultadosLaboratorio.ObtenerResultadosLaboratorio(id).Select(x => new { x.Codigo, x.Nombre, Marca = x.TipoMarca.Descripcion, x.Laboratorio, x.Valor, x.Unidad }), JsonRequestBehavior.AllowGet);
        }

        public JsonResult RemoverResultadoLaboratorio(long codigo)
        {
            return Json(resultadosLaboratorio.RemoverResultadoLaboratorio(codigo));
        }







        [HttpGet]
        public JsonResult GetResultadoLaboratorio(long codigo)
        {
            ResultadoLaboratorio resultadoLaboratorio = resultadosLaboratorio.ObtenerResultadoLaboratorio(codigo);
            return Json(new
            {
                Nombre = resultadoLaboratorio.Nombre,
                Marca = resultadoLaboratorio.Marca,
                Valor = resultadoLaboratorio.Valor,
                Unidad = resultadoLaboratorio.Unidad,
            }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult EditarResultadoLaboratorio(FormCollection form)
        {

            int Marca = (int)form.GetValue("ResultadoLaboratorioRegistro.Marca").ConvertTo(typeof(int));
            long Codigo = (long)form.GetValue("CodigoResultadoLaboratorio").ConvertTo(typeof(long));
            String Nombre = (String)form.GetValue("ResultadoLaboratorioRegistro.Nombre").ConvertTo(typeof(String));
            String Valor = (String)form.GetValue("ResultadoLaboratorioRegistro.Valor").ConvertTo(typeof(String));
            String Unidad = (String)form.GetValue("ResultadoLaboratorioRegistro.Unidad").ConvertTo(typeof(String));
            ResultadoLaboratorio resultadoLaboratorio = new ResultadoLaboratorio();
            resultadoLaboratorio.Nombre = Nombre;
            resultadoLaboratorio.Marca = Marca;
            resultadoLaboratorio.Valor = Valor;
            resultadoLaboratorio.Unidad = Unidad;
            resultadoLaboratorio.Codigo = Codigo;
            Boolean resultado = resultadosLaboratorio.EditarResultadoLaboratorio(resultadoLaboratorio);
            return Json(true);
        }




        [HttpGet]
        public JsonResult GetTiposMarcas()
        {
            return Json(resultadosLaboratorio.ObtenerTipoMarcas().Select(x => new { x.Codigo, x.Descripcion }), JsonRequestBehavior.AllowGet);
        }


        /// /////////////////////////////////////// FIN  RESULTADOS DE LABORATORIO ////////////////////////////////////////////
        /// 


        /// /////////////////////////////////////// LABORATORIO ////////////////////////////////////////////
        /// 

        [HttpPost]
        public JsonResult GuardarLaboratorio(FormCollection form)
        {

            String paciente = (String)form.GetValue("LaboratorioRegistro.Paciente").ConvertTo(typeof(String));
            String NumeroSecuencia = (String)form.GetValue("LaboratorioRegistro.Unidad").ConvertTo(typeof(String));
            String Laboratorio = (String)form.GetValue("LaboratorioRegistro.Laboratorio").ConvertTo(typeof(String));
            String Solicitado = (String)form.GetValue("LaboratorioRegistro.Solicitado").ConvertTo(typeof(String));
            int Estado = (int)form.GetValue("LaboratorioRegistro.Estado").ConvertTo(typeof(int));
            DateTime Fecha = (DateTime)form.GetValue("LaboratorioRegistro.Fecha").ConvertTo(typeof(DateTime));
            String NombrePanelLaboratorio = (String)form.GetValue("LaboratorioRegistro.NombrePanelLaboratorio").ConvertTo(typeof(String));
            Laboratorio laboratorio = new Laboratorio();
            laboratorio.Paciente = paciente;
            laboratorio.NombrePanelLaboratorio = NombrePanelLaboratorio;
            laboratorio.NumeroSecuencia = NumeroSecuencia;
            laboratorio.Fecha = Fecha;
            laboratorio.Estado = Estado;
            laboratorio.Laboratorio1 = Laboratorio;
            laboratorio.Solicitado = Solicitado;

            ValueProviderResult ProviderCodigoLaboratorio = form.GetValue("CodigoLaboratorio");

            if (ProviderCodigoLaboratorio.AttemptedValue.Length > 0)
            {
                int codigoLaboratorio = (int)form.GetValue("CodigoLaboratorio").ConvertTo(typeof(int));
                laboratorio.Codigo = codigoLaboratorio;
                resultadosLaboratorio.EditarLaboratorio(laboratorio);
                return Json(new { Resultado = true, Codigo = codigoLaboratorio, Editar = true });
            }
            else
            {
                long codigo = resultadosLaboratorio.AgregarLaboratorio(laboratorio).Codigo;
                return Json(new { Resultado = true, Codigo = codigo, Editar = false });
            }

        }


        [HttpGet]
        public JsonResult GetLaboratorios(string id)
        {

            return Json(resultadosLaboratorio.ObtenerLaboratorios(id).Select(
                 laboratorio => new {
                     Codigo = laboratorio.Codigo,
                     Paciente = laboratorio.Paciente,
                     NombrePanelLaboratorio = laboratorio.NombrePanelLaboratorio,
                     NumeroSecuencia = laboratorio.NumeroSecuencia,
                     Fecha = laboratorio.Fecha,
                     Estado = laboratorio.TipoEstadoLaboratorio.Descripcion,
                     Laboratorio1 = laboratorio.Laboratorio1,
                     Solicitado = laboratorio.Solicitado
                 }), JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetLaboratorio(long codigo)
        {

            Laboratorio laboratorio = resultadosLaboratorio.ObtenerLaboratorio(codigo);
            return Json(new
            {
                Codigo = laboratorio.Codigo,
                Paciente = laboratorio.Paciente,
                NombrePanelLaboratorio = laboratorio.NombrePanelLaboratorio,
                NumeroSecuencia = laboratorio.NumeroSecuencia,
                Fecha = laboratorio.Fecha,
                Estado = laboratorio.TipoEstadoLaboratorio.Codigo,
                Laboratorio1 = laboratorio.Laboratorio1,
                Solicitado = laboratorio.Solicitado
            }, JsonRequestBehavior.AllowGet);
        }



        /// /////////////////////////////////////// FIN LABORATORIO ////////////////////////////////////////////

        //////////////////////////////////// MEDICAMENTOS //////////////////////////////////////////////////

        public ActionResult Medicamentos(String id)
        {
            ViewBag.Paciente = pacientes.Obtener(id);

            IEnumerable<TipoAdministracion> tipoAdministracion = medicamentos.ObtenerTipoAdministracion();

            List<SelectListItem> itemsTipos = new List<SelectListItem>();

            foreach (var tipo in tipoAdministracion)
            {
                itemsTipos.Add(new SelectListItem { Text = tipo.Descripcion, Value = tipo.Codigo.ToString() });
            }

            IEnumerable<TipoConcentracion> tipoConcentracion = medicamentos.ObtenerConcentraciones();

            List<SelectListItem> itemsConcentraciones = new List<SelectListItem>();

            foreach (var reaccion in tipoConcentracion)
            {
                itemsConcentraciones.Add(new SelectListItem { Text = reaccion.Descripcion, Value = reaccion.Codigo.ToString() });
            }

            IEnumerable<TipoDosis> tiposDosis = medicamentos.ObtenerTiposDosis();

            List<SelectListItem> itemstiposDosis = new List<SelectListItem>();

            foreach (var reaccion in tiposDosis)
            {
                itemstiposDosis.Add(new SelectListItem { Text = reaccion.Descripcion, Value = reaccion.Codigo.ToString() });
            }



            var vm = new MedicamentoRegistro();
            vm.TiposAdministracion = itemsTipos;
            vm.TiposConcentracion = itemsConcentraciones;
            vm.TiposDosis = itemstiposDosis;
            return View(vm);
        }

        public JsonResult GetTiposConcentracion()
        {
            return Json(medicamentos.ObtenerConcentraciones().Select(x => new { x.Codigo, x.Descripcion }), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetTiposDosis()
        {
            return Json(medicamentos.ObtenerTiposDosis().Select(x => new { x.Codigo, x.Descripcion }), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetTiposAdministracion()
        {
            return Json(medicamentos.ObtenerTipoAdministracion().Select(x => new { x.Codigo, x.Descripcion }), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetMedicamentos(string id)
        {
            IEnumerable<Medicamento> medicamentosSinFiltro = medicamentos.Obtener(id);
            return Json(medicamentosSinFiltro.Select(
                x => new {
                    x.Codigo,
                    x.Paciente,
                    Concentracion = new { x.TipoConcentracion.Codigo, x.TipoConcentracion.Descripcion },
                    Dosis = new { x.TipoDosis.Codigo, x.TipoDosis.Descripcion },
                    Administracion = new { x.TipoAdministracion.Codigo, x.TipoAdministracion.Descripcion },
                    x.Nombre,
                    x.Frecuencia,
                    x.Motivo,
                    x.FechaInicio,
                    x.FechaFin,
                    x.Detalle
                }
                ), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GuardarMedicamento(Medicamento medicamento)
        {
            var medicamentoCodigo = medicamentos.Agregar(medicamento).Codigo;
            return Json(new { Resultado = true, CodigoMedicamento = medicamentoCodigo });
        }

        public JsonResult ObtenerMedicamento(int codigo)
        {

            Medicamento registro = medicamentos.ObtenerMedicamento(codigo);
            return Json(new
            {
                Codigo = registro.Codigo,
                Paciente = registro.Paciente,
                Concentracion = registro.Concentracion,
                Dosis = registro.Dosis,
                Administracion = registro.Administracion,
                Nombre = registro.Nombre,
                Frecuencia = registro.Frecuencia,
                Motivo = registro.Motivo,
                FechaInicio = registro.FechaInicio,
                FechaFin = registro.FechaFin,
                Detalle = registro.Detalle
            }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult EditarMedicamento(Medicamento medicamento)
        {
            medicamentos.EditarMedicamento(medicamento);
            return Json(true);
        }

        public JsonResult RemoverMedicamento(int codigo)
        {
            medicamentos.RemoverMedicamento(codigo);
            return Json(true);
        }

        /////////////////////////////////// FIN MEDICAMENTOS /////////////////////////////////////////////

        //////////////////////////////////// PROCEDIMIENTOS //////////////////////////////////////////////////

        public ActionResult Procedimientos(String id)
        {
            var pacienteDB = pacientes.Obtener(id);
            var pacienteModelo = new PacienteRegistro(pacienteDB);
            ViewBag.Paciente = pacienteModelo;
            return View();
        }

        public JsonResult GetProcedimientos(string id)
        {
            if (id != null)
            {
                var listaProcedimientosBD = procedimientos.Obtener(id);
                var listaProcedimientosModelos = listaProcedimientosBD.Select(x => new ProcedimientoRegistro(x));
                return Json(listaProcedimientosModelos, JsonRequestBehavior.AllowGet);
            }
            return Json(true);
        }

        public JsonResult AgregarProcedimiento(Procedimiento procedimiento)
        {
            var procedimientoDB = procedimientos.Agregar(procedimiento);
            return Json(new { Resultado = true, Procedimiento = new ProcedimientoRegistro(procedimientoDB) });
        }

        public JsonResult ObtenerProcedimiento(int codigo)
        {
            Procedimiento procedimientoDB = procedimientos.ObtenerProcedimiento(codigo);
            return Json(new ProcedimientoRegistro(procedimientoDB), JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult EditarProcedimiento(Procedimiento procedimiento)
        {
            var procedimientoEditadoDb = procedimientos.EditarProcedimiento(procedimiento);
            return Json(new { Resultado = true, Procedimiento = new ProcedimientoRegistro(procedimientoEditadoDb) });
        }

        public JsonResult RemoverProcedimiento(int codigo)
        {
            procedimientos.Remover(codigo);
            return Json(true);
        }

        /////////////////////////////////// FIN PROCEDIMIENTOS /////////////////////////////////////////////

        ConjuntoAlergias alergias = new ConjuntoAlergias();
        ConjuntoAfecciones afecciones = new ConjuntoAfecciones();
        ConjuntoPacientes pacientes = new ConjuntoPacientes();
        ConjuntoVacunas vacunas = new ConjuntoVacunas();
        ConjuntoResultadosLaboratorio resultadosLaboratorio = new ConjuntoResultadosLaboratorio();
        ConjuntoMedicamentos medicamentos = new ConjuntoMedicamentos();
        ConjuntoProcedimientos procedimientos = new ConjuntoProcedimientos();
    }
}