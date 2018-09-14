$(document).ready(function(){
    
    //Setting up
    let messages = [];
    let socket = io.connect('http://localhost:3000/');
    let chatForm = $('#chatForm');
    let message = $('#chatInput');
    let chatWindow = $('#chatWindow');
    let userForm = $('#userForm');
    let username = $('#username');
    let users = $('#users');
    let errors = $('#error');


    userForm.on('submit', (e)=>{
       // console.log('HERE');
       socket.emit('set user', username.val() , (data) => {
            if(data){
                $('#userFormWrap').hide();
                $('#mainWrap').show();
            
            }else{
                error.html('Username is already taken, Please try another');
            }
       });
        e.preventDefault();
    });


    //Submit the chatForm
    chatForm.on('submit', (e)=>{
        socket.emit('send message', message.val());
        message.val('');    //clear the message
        e.preventDefault();
    });


    //Show the message
    socket.on('show message', (data) => {
        chatWindow.append('<strong>'+data.user+'</strong>: '+data.msg+'<br> ')
    });


    //Display the username
    socket.on('users', (data) => {
        let toBeAppended = '';
        for(i=0; i<data.length; i++){
            toBeAppended += '<li class="list-group-item">'+data[i]+'</li>';
        }
        users.html(toBeAppended);
    })


});