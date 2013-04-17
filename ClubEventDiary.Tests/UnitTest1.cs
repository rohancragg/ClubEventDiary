using System;
using System.Linq;

using ClubWebDiary.Models;

using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace ClubEventDiary.Tests
{
    [TestClass]
    public class UnitTest1
    {
        [TestMethod]
        public void TestMethod1()
        {
            using (var db = new ClubDiaryDbContext())
            {
                Console.WriteLine(db.Events.Count());
                db.Events.Add(new Event { Title = "Test 1", EventDate = DateTime.Now });
                db.SaveChanges();
                Console.WriteLine(db.Events.Count());
            }
            
        }
    }
}
