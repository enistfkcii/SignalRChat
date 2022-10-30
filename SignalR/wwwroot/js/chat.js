"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl(" https://localhost:7079/chatHub",
    { skipNegotation: true, transport: signalR.HttpTransportType.WebSockets }).withAutomaticReconnect([1000,1000,2000,3000,4000]).build();
// WithAutomaticReconnect -> bağlantı var lakin koptugunda sunucu sistemli şekilde yeniden bağlantı isteği yolluyor.

//Disable the send button until connection is established.
document.getElementById("sendButton").disabled = true;

connection.on("ReceiveMessage", function (message) {
    var li = document.createElement("li");
    document.getElementById("messagesList").appendChild(li);
    // We can assign user-supplied strings to an element's textContent because it
    // is not interpreted as markup. If you're assigning in any other way, you 
    // should be aware of possible script injection concerns.
    li.textContent = `${message}`;
});


const durum = $("#durum");
//Bağlantı hiç kullanılmadıgı durumlarda bu fonksiyonu kullanacagız.
async function start() {
    try {
        await connection.start();
    }
    catch (error) {
        setTimeout(() => start(),2000)
    }
}
function animation() {
    durum.fadeIn(2000, () => {
        setTimeout(() => { durum.fadeOut(2000); }, 2000)
    });
}

start().then(function () {
    document.getElementById("sendButton").disabled = false;
}).catch(function (err) {
    return console.error(err.toString());
});



connection.onreconnecting(error => {
    durum.css("background-color", "blue");
    durum.css("color", "white");
    durum.html("Bağlantı Kuruluyor ...");
    animation();

})
connection.onreconnected(connectionId => {
    durum.css("background-color", "green");
    durum.css("color", "white");
    durum.html("Bağlantı Kuruldu ...");
    animation();
})
connection.onclose(connectionId => {
    durum.css("background-color", "red");
    durum.css("color", "white");
    durum.html("Bağlantı Kurulamadı ...");
    animation();
})
connection.on("userJoined", connectionId => {
    durum.html(`${connectionId} bağlandı`);
    durum.css("background-color", "green");
    animation();
});
connection.on("userLeaved", connectionId => {
    durum.html(`${connectionId} ayrıldı`);
    durum.css("background-color", "red");
    animation();
});
connection.on("clients", clientsData => {
    let text = "";
    $.each(clientsData, (index, item) => {
        text += `<li>${item}</li>`;   
    });
    $("#clients").html(text);
});

document.getElementById("sendButton").addEventListener("click", function (event) {
    var message = document.getElementById("messageInput").value;
    connection.invoke("SendMessage",message).catch(function (err) {
        return console.error(err.toString());
    });
    event.preventDefault();
});

//onrecconnecting => yeniden bağlanma girişimleri başlamadan öncesinde fırlatılan event
//onreconneted => yeniden bağlantı gerçekleştiğinde tetiklenen fonksiyon
//onclose => yeniden bağlantı girişimi sonucsuz kaldıgı zaman tetiklenen fonksiyon