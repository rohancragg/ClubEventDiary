using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Data.Entity.ModelConfiguration.Conventions;
using ClubEventDiary.Model;

namespace ClubWebDiary.Models
{
    public class ClubDiaryDbContext : DbContext
    {
        public ClubDiaryDbContext()
            : base(nameOrConnectionString: "ClubDiary") {}

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();
            Database.SetInitializer(new DropCreateDatabaseIfModelChanges<ClubDiaryDbContext>());

            modelBuilder.Configurations.Add(new EventConfiguration());
        }

        public DbSet<Event> Events { get; set; }
    }
}