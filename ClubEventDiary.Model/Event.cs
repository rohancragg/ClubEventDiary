using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace ClubWebDiary.Models
{
    public class Event
    {
        public int Id { get; set; }

        public DateTime EventDate { get; set; }

        [Required]
        public string Title { get; set; }

        public string ShortDescription { get; set; }

        public string FullDescription { get; set; }

        public virtual ICollection<Genre> Genres  { get; set; }
    }

    public class Genre
    {
        public int Id { get; set; }

        [Required]
        public string Title { get; set; }

        public virtual ICollection<Event> Events { get; set; }
    }
}