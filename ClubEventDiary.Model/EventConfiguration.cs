using System;
using System.Collections.Generic;
using System.Data.Entity.ModelConfiguration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ClubWebDiary.Models;

namespace ClubEventDiary.Model
{
    public class EventConfiguration: EntityTypeConfiguration<Event>
    {
        public EventConfiguration()
        {
            HasMany(e => e.Genres)
                .WithMany(g => g.Events)
                .Map(a => a.ToTable("EventGenre")
                    .MapLeftKey("EventId")
                    .MapRightKey("GenreId"));
        }
    }
}
