using Microsoft.AspNetCore.SignalR;
using SignalR.API.Hubs;

namespace SignalR.API.Business
{
    public class MyBusiness
    {
        readonly IHubContext<ChatHub> _hubContext; // Dolaylı yoldan websocket işlemlerini gerçekleştirebileceğiz.

        public MyBusiness(IHubContext<ChatHub> hubContext)
        {
            _hubContext = hubContext;
        }
        public async Task SendMessage(string message)
        {
            await _hubContext.Clients.All.SendAsync("ReceiveMessage", message);
        }
    }
}
    
