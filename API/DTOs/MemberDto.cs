using System;
using System.Collections.Generic;

namespace API.Data.DTOs
{
    public class MemberDto
    {
        public int Id { get; set; }
        public string Username{get;set;}
        public string PhotoUrl{get;set;}
        public int Age {get;set;}
        public string IsKnownAs{get;set;}
        public DateTime Created{get;set;}
        public DateTime LastActive{get;set;}
        public string Gender{get;set;}
        public string interduction{get;set;}
        public string LookingFor{get;set;}
        public string Intests{get;set;}
        public string City{get;set;}
        public string Country{get;set;}
        public ICollection<PhotoDto> Photos{get;set;}
    }
}