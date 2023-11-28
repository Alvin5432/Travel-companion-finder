var nodemailer =require ('nodemailer');

//var StudentEmail=document.querySelector('#student-email').value;


var transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:'jesse.richard@strathmore.edu',
        pass:'owzk madf tbpr hbgx'
    }

});

var mailOptions ={
    from:'jesse.richard@strathmore.edu',
    to:'jesse11richard@gmail.com',
    subject:'This just a test',
    text:'it worked'
};

transporter.sendMail(mailOptions,function(error,info){
    if(error){
        console.log(error);
    }
    else{
        console.log("Email sent"+info.response);
    }
});
