using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ClubWebDiary.Models
{
    public class Event
    {
        public int Id { get; set; }

        public DateTime EventDate { get; set; }

        public string Title { get; set; }

        public string ShortDescription { get; set; }

        public string FullDescription { get; set; }
    }
}