using Microsoft.AspNetCore.SignalR;
using SignalR.API.Interfaces;

namespace SignalR.API.Hubs
{
    public class ChatHub : Hub<IMessageClient>
    {
        static List<string> clients = new List<string>();

        //public async Task SendMessage(string message)
        //{
        //    await Clients.All.SendAsync("ReceiveMessage", message);
        //}
        public override async Task OnConnectedAsync()
        {
            //Sisteme bir baglantı gerçekleştiğinde bu method tetiklenecek
            clients.Add(Context.ConnectionId);
            //await Clients.All.SendAsync("clients", clients);
            //await Clients.All.SendAsync("userJoined",Context.ConnectionId);
            await Clients.All.Clients(clients); // Strongly Type Hubs kullanarak bu hale çevirdik
            await Clients.All.UserJoined(Context.ConnectionId);

        }
        public override async Task OnDisconnectedAsync(Exception exception)
        {
            //Bir bağlantı varken bu baglantı koptugunda bu method tetiklenecek.
            clients.Remove(Context.ConnectionId);
            await Clients.All.Clients(clients);
            await Clients.All.UserLeaved(Context.ConnectionId);
        }
    }
}
