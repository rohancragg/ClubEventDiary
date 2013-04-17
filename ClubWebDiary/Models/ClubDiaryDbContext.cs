using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Data.Entity.ModelConfiguration.Conventions;

namespace ClubWebDiary.Models
{
    public class ClubDiaryDbContext : DbContext
    {
        public ClubDiaryDbContext()
            : base(nameOrConnectionString: "ClubDiary") {}


    }
}