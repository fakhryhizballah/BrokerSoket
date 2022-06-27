const { createServer } = require("http");
const { Server } = require("socket.io");

const httpServer = createServer();
const port = 3800;
const io = new Server(httpServer, {
    /* options */
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"]
    },

});
var user = 0;
io.on("connection", (socket) => {
    console.log(socket.id);
    user++;
    console.log("user online : " + user);
    io.emit("pesan", "user online " + user);

    socket.on("disconnect", (reason) => {
        user--;
        console.log(reason)
        console.log("user online : " + user);
        io.emit("pesan", "user online " + user);
    });
});

httpServer.listen(port, function () {
    console.log("socket.io run port : " + port)
});
module.exports = {
    io
}
