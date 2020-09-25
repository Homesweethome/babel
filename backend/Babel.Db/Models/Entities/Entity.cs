﻿using Babel.Db.Base;

namespace Babel.Db.Models.Entities
{
    public class Entity: BaseModel
    {
        public Vector Position { get; set; }
        public string Description { get; set; }
        public string BaseId { get; set; }
        public string Type { get; set; }
        public string Photo { get; set; }
        public string LevelId { get; set; }
    }
}
