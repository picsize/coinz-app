var loginForm = {
    container:function(){
        return $('#login');
    },
    init:function(){
        this.setFontSize();
        this.registerEvent();
        this.setSubmitEvent();
        this.setEmailReminder();
    },
    setFontSize: function(){
        var windowHeight = $(window).height();
        $('#headerReg').css('font-size', (windowHeight * 0.035) + 'px');
        $('input').css('font-size', (windowHeight * 0.035) + 'px');
        $('#goToRegister').css('font-size', (windowHeight * 0.035) + 'px');
        $('#password_reminder').css('font-size', (windowHeight * 0.035) + 'px');
    },
    registerEvent:function(){
        $("#goToRegister").click(function(){
            coinz.goTo('register.html');
        });
    },
    setEmailReminder:function(){
        var self = this;
        $("#password_reminder").click(function(){
            var emailFromUser = prompt("אנא הכנס את האימייל שאיתו נרשמת לאפליקציה:");
            var url = "http://coinz-admin.co.il/php/email_password_reminder_byChabadID.php?email=" + emailFromUser + "&beit_chabad_id=" +
                appData.beit_chabad_id;
            $.ajax({
                type: "POST",
                url: url,
                processData: false,
                contentType: false,
                success: function(html){
                    if(html=="Message has been sent")    {
                        var title =  'תזכורת נשלחה';
                        var msg = 'שלחנו אליך תזכורת, אנא בדוק את תיבת האימייל שלך.';
                        var btnLabel = 'אישור';
                        navigator.notification.alert(
                            msg,
                            null,         // callback
                            title,            // title
                            btnLabel                  // buttonName
                        );
                    } else {
                        var title =  'שליחה לא בוצעה';
                        var msg = 'הפעולה לא בוצעה. אנא צור קשר עם מנהל האפליקציה, כתובת האימייל מופיע בחנות האפליקציות';
                        var btnLabel = 'אישור';
                        navigator.notification.alert(
                            msg,
                            null,         // callback
                            title,            // title
                            btnLabel                  // buttonName
                        );
                    }
                }
            });
        });
    },
    setSubmitEvent:function(){
        var self = this;
        $(document).on('submit', '#loginForm', function () {            
            event.preventDefault();
            var form = $(this);
            var ajax_data = coinz.dataFromForm(form);
            ajax_data.beit_chabad_id = appData.beit_chabad_id;
            var validForm = self.validate(ajax_data);
            if (validForm) {
                self.submit(ajax_data);
            }
        });

        //$("#loginForm").on("submit", function(event){
         
        //});
    },
    validEmail:function(email){
        atpos = email.indexOf("@");
        dotpos = email.lastIndexOf(".");
        var valid_email = !(atpos < 1 || ( dotpos - atpos < 2 ));
        return valid_email;
    },
    validate:function(formData){
        var valid_email = this.validEmail(formData.email);
        if (!valid_email){
            //alert('אנא הכנס כתובת אימייל תקינה');
            var title =  'תקלה בכניסה';
            var msg = 'אנא הכנס כתובת אימייל תקינה';
            var btnLabel = 'אישור';
            navigator.notification.alert(
                msg,
                null,         // callback
                title,            // title
                btnLabel                  // buttonName
            );
        }
        return valid_email;
    },
    submit:function(loginData){
    	var self = this;
    	coinz.ajax('login_multi_users', loginData , function(userData){
    		 var error_exists = typeof(userData.error)=='string';
    		 if (!error_exists){
    			 coinz.setUser(userData);
                 coinz.goTo('main.html');
    		 } else {
    			 //alert('כניסה נכשלה') ;
                 var title =  'כניסה נכשלה';
                 var msg = 'אנא בדוק את פרטיך והכנס שנית';
                 var btnLabel = 'אישור';
                 navigator.notification.alert(
                     msg,
                     null,         // callback
                     title,            // title
                     btnLabel                  // buttonName
                 );
    		 }
    	})
    }
}