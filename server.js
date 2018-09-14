//Include express
const express = require('express');
//Include path
const path = require('path');
//Create app variable as express
const app = express();
//Create the server 
const server = require('http').createServer(app);
//Include the socket.io 
const io = require('socket.io').listen(server);
//Set the port
const port = 3000;

//Create an empty array of users
let users  = [];


//VIew engine setup
app.set('views', path.join(__dirname,'views'));
app.set('view engine','pug');


//Setting the static path
app.use(express.static(path.join(__dirname, 'public')));



//Socket.io connect
io.sockets.on('connection', (socket) => {
    //Set the username ie the data which we r getting
    socket.on('set user',(data, callback)=>{

        //check if the username exists in the array
        if(users.indexOf(data)  != -1){
            callback(false);        
        
        }else{                      
            callback(true); 
            socket.username = data;
            users.push(socket.username);
            updateUsers();
        }
    });

    socket.on('send message', (data) => {
        io.sockets.emit('show message', {msg: data, user:socket.username});
        
    });



    socket.on('disconnect', (data)=>{
        if(!socket.username) 
            return;
        //splice is used to remove the element from the last of the array       
        users.splice(users.indexOf(socket.username) , 1);
        updateUsers();
    });


    //to create back and forth communication we did this 
    function updateUsers(){  //users ie 2nd argument is the array
        io.sockets.emit('users', users); //this will emit the name back to the client

    }
});




//Index route
app.get('/' ,(req,res,next) => {
    //res.send('test');
    res.render('index');
});


//It will indefintely listen to this port
server.listen(port, () =>{
    console.log("Server started at port "+ port);
});