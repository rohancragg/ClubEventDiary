using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

using Breeze.WebApi;

using ClubWebDiary.Models;

namespace ClubWebDiary.Web.Controllers
{
    [BreezeController]
    public class BreezeController : ApiController
    {
        readonly EFContextProvider<ClubDiaryDbContext> _contextProvider =
            new EFContextProvider<ClubDiaryDbContext>();

        [HttpGet]
        public string MetaData()
        {
            return _contextProvider.Metadata();
        }

        [HttpGet]
        public IQueryable<Event> Events()
        {
            return _contextProvider.Context.Events;
        }
    }
}