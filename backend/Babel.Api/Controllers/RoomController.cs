﻿using System;
using System.Collections.Generic;
using System.Text.Json;
using System.Threading.Tasks;
using AutoMapper;
using Babel.Api.Base;
using Babel.Api.Dto.Room;
using Babel.Api.Extensions;
using Babel.Db.Models.Rooms;
using Babel.Db.Services;
using Microsoft.AspNetCore.Mvc;

namespace Babel.Api.Controllers
{
    /// <summary>
    /// Работа с комнатами
    /// </summary>
    [ApiController]
    [Route("room")]
    public class RoomController: Controller
    {
        private readonly RoomService _roomService;
        private readonly LevelService _levelService;
        private readonly IMapper _mapper;

        public RoomController(RoomService roomService,
            LevelService levelService,
            IMapper mapper)
        {
            _roomService = roomService;
            _levelService = levelService;
            _mapper = mapper;
        }

        /// <summary>
        /// Получить все добавленные комнаты
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public async Task<IActionResult> GetRooms()
        {
            var converted = _mapper.Map<List<RoomDto>>(await _roomService.Get());
            return JsonResponse.New(converted);
        }

        /// <summary>
        /// Добавить комнату
        /// </summary>
        /// <param name="room"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("")]
        public async Task<IActionResult> AddRoom(RoomDto room)
        {
            var level = await _levelService.Get(room.Level);
            if (level == null)
                return BadRequest("Попытка добавить на несуществующий этаж");

            var baseRoom = _mapper.Map<BaseRoom>(room);
            baseRoom.Id = Guid.NewGuid().ToString();
            var result = await _roomService.Create(baseRoom);

            return JsonResponse.New(_mapper.Map<RoomDto>(result));
        }

        /// <summary>
        /// Удалить комнату
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpDelete]
        [Route("{id:alpha}")]
        public async Task<IActionResult> RemoveRoom(string id)
        {
            await _roomService.Remove(id);
            return JsonResponse.New("ok");
        }

        /// <summary>
        /// Изменить комнату
        /// </summary>
        /// <param name="id"></param>
        /// <param name="room"></param>
        /// <returns></returns>
        [HttpPut, HttpPost]
        [Route("{id:alpha}")]
        public async Task<IActionResult> UpdateRoom(string id, RoomDto room)
        {
            var baseRoom = await _roomService.Get(id);
            baseRoom.CopyProperties(room);
            baseRoom.Id = id;
            await _roomService.Update(id, baseRoom);
            return JsonResponse.New(_mapper.Map<RoomDto>(baseRoom));
        }

        /// <summary>
        /// Указать фотографию для комнаты
        /// </summary>
        [HttpPut, HttpPost]
        [Route("photo/{id:alpha}")]
        public async Task<IActionResult> SetPhoto(string id, string photo)
        {
            var room = await _roomService.Get(id);
            room.Photo = photo;
            await _roomService.Update(id, room);
            return JsonResponse.New(_mapper.Map<RoomDto>(room));
        }
    }
}
