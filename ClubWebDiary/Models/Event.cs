using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ClubWebDiary.Models
{
    public class Event
    {
        public DateTime EventDate { get; set; }

        public string Title { get; set; }

        public string Description { get; set; }
    }
}