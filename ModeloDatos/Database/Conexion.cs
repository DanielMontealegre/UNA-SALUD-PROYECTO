using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ModeloDatos.Database
{
    public static class Conexion
    {
        public static ConexionDataContext Open
        {
            get { return new ConexionDataContext(); }
        }
    }
}
