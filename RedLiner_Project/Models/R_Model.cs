using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace RedLiner_Project.Models
{
    public class R_Model
    {
       

        public int ProjectID { get; set; }
        [Required(ErrorMessage = "Name is required")]
        [MaxLength(10, ErrorMessage = "Name cannot be longer than 10 characters.")]
        public string Name { get; set; }
    
        public string  JSONString { get; set; }
    }
}