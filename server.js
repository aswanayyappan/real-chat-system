const socketIo=require('socket.io')
const http=require('http')
const express=require('express')
const app=express()
const server= http.createServer(app)
// initiate the html and attch this http this to the page
const io=socketIo(server)
//connect the page with the static page
app.use(express.static('public'))
const users=new Set()
io.on('connection',(Socket)=>{

    //handle user they will the join chat
    Socket.on('user',(user)=>{
        users.add(user)
        Socket.username=user
        //boardcast the that new user is joined
        io.emit('userJoined', user)

        //send the updated list to the client
        io.emit('UserList',Array.from(users))
    })
    //handle incoming  user message
    Socket.on("chatMessage",(message)=>{
        // boardcast all message received from the users to allusers
        io.emit("chatMessage",message);
    })


    //handle the disconncetion
    Socket.on("disconnect",()=>{

        users.forEach((user)=>{
            if(user===Socket.username){
                users.delete(user);
                io.emit('userLeft',user);
                io.emit('UserList',Array.from(users))
            }
        })
    })
})
const port=3000;
server.listen(port,()=>{
    console.log(`http://localhost:${port}`)
})