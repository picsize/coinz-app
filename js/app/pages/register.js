var registerForm = {
    container:function(){
        return $('#register');
    },
    init:function(){
        this.setFontSize();
        this.termsEvent();
        this.loginEvent();
        this.loadList();
        //this.setOnFocusChange();
        this.setSubmitEvent();
        this.backBtnEvent();
        $("#title").append(appData.beitchabad_name);
    },
    setFontSize: function(){
        var windowHeight = $(window).height();
        $('#headerReg').css('font-size', (windowHeight * 0.035) + 'px');
        $('#title').css('font-size', (windowHeight * 0.035) + 'px');
        $('#titleTerms').css('font-size', (windowHeight * 0.035) + 'px');
        $('#subTitle').css('font-size', (windowHeight * 0.035) + 'px');
        $('input').css('font-size', (windowHeight * 0.035) + 'px');
        $('select').css('font-size', (windowHeight * 0.035) + 'px');
        $('#termsText').css('font-size', (windowHeight * 0.025) + 'px');
        $('#loginText').css('font-size', (windowHeight * 0.025) + 'px');
        $('#bgImg').css('top','19%');
        //CSS for iPhone4 and small screens
        if (windowHeight < 500) {
            $('#bgImg').css('top','19%');
            $('#termsText').css('left','37%');
            $('#termsText').css('top','111%');
            $('#chkSelect').css('top','-50%');
            $('#subTitle').css('top','14%');
            $('form').css('top','21%');
        }
    },
    backBtnEvent: function(){
        $("#goBack").click(function(){
            location.reload();
        });
    },
    setSubmitEvent:function(){
        var self = this;
        $("#registerFormOne").on("submit", function(event){
            event.preventDefault();
            var form = $(this);
            var ajax_data = coinz.dataFromForm(form);
            var validForm = self.validate(ajax_data);
            if (validForm){
                ajax_data.beit_chabad_id = appData.beit_chabad_id;
                self.submit(ajax_data);
            }
        });
    },
    setOnFocusChange: function(){
    	var self = this;
    	//$("#phone").click(function(){
    	//	$("#register").animate({
    	//		'marginTop' : "-25px"
    	//	});
    	//});
    	//$("#password").click(function(){
    	//	$("#register").animate({
    	//		'marginTop' : "-45px"
    	//	});
    	//});
    	$("#email").click(function(){
    		$("#register").animate({
    			'marginTop' : "-120px"
    		});    		
    	});
    	$("#owner_beit_chabad").click(function(){
    		$("#register").animate({
    			'marginTop' : "0px"
    		});    		
    	});
    },
    termsEvent:function(){
        $("#goToTerms").click(function(){
            $('#register').fadeOut(300 , function(){
                $('#appterms').fadeIn(300 , function(){
                   $("#appterms a").one('click' , function(){
                       $('#appterms').fadeOut(300 , function(){
                          $('#register').fadeIn(300);
                       });
                   });
                });
            });
        });
    },
    loginEvent:function(){
        $("#goToLogin").click(function(){
            coinz.goTo('login.html');
        });
    },
    loadList:function(){
        var selobj = $('select#owner_beit_chabad');
        var url = coinz.serverUrl+'get_beit_chabad_sites.php';
        var nameattr = 'beit_chabad_site';
        coinz.ajax('get_beit_chabad_sites' , {}, function(sites_data){
        	$.each(sites_data, function(i,site_data){
                var site_name = site_data.site_name;
                var site_id = site_data.site_id;
                var option = "<option value='" + site_id + "'>" + site_name + "</option>";
                $(selobj).append(option);
            });
        });
    },
    validEmail:function(email){
        atpos = email.indexOf("@");
        dotpos = email.lastIndexOf(".");
        var valid_email = !(atpos < 1 || ( dotpos - atpos < 2 ));
        return valid_email;
    },
    validate:function(formData){
        var valid_password = (formData.password.length > 5);
        var valid_phone = (formData.phone.length > 6);
        var valid_firstName = (formData.firstname.length > 1);
        var valid_lastName = (formData.lastname.length > 1);
        var valid_terms = (formData.terms == 'on');
        var valid_email = this.validEmail(formData.email);
        if (valid_terms){
            if (valid_email){
                    if(valid_password){
                        if(valid_firstName){
                            if(valid_lastName){
                                if(valid_phone){
                                    return true;
                                } else {
                                    var title =  "פרטים חסרים";
                                    var msg = 'אנא מלא מספר טלפון';
                                    var btnLabel = 'אשר';
                                    navigator.notification.alert(
                                        msg,
                                        null,         // callback
                                        title,            // title
                                        btnLabel                  // buttonName
                                    );
                                }
                            } else {
                                var title =  "פרטים חסרים";
                                var msg = 'אנא מלא שם משפחה';
                                var btnLabel = 'אשר';
                                navigator.notification.alert(
                                    msg,
                                    null,         // callback
                                    title,            // title
                                    btnLabel                  // buttonName
                                );
                            }
                        } else {
                            var title =  "פרטים חסרים";
                            var msg = 'אנא מלא את שמך הפרטי';
                            var btnLabel = 'אשר';
                            navigator.notification.alert(
                                msg,
                                null,         // callback
                                title,            // title
                                btnLabel                  // buttonName
                            );
                        }
                    } else {
                        var title =  "פרטים חסרים";
                        var msg = 'אנא בחר סיסמה בת 6 תווים לפחות';
                        var btnLabel = 'אשר';
                        navigator.notification.alert(
                            msg,
                            null,         // callback
                            title,            // title
                            btnLabel                  // buttonName
                        );
                    }
                    } else {
                        var title =  "פרטים חסרים";
                        var msg = 'אנא הכנס כתובת אימייל תקינה';
                        var btnLabel = 'אשר';
                        navigator.notification.alert(
                            msg,
                            null,         // callback
                            title,            // title
                            btnLabel                  // buttonName
                        );
                    }
                    } else {
                        var title =  "פרטים חסרים";
                        var msg = 'אנא אשר את תנאי השימוש בשירות';
                        var btnLabel = 'אשר';
                        navigator.notification.alert(
                            msg,
                            null,         // callback
                            title,            // title
                            btnLabel                  // buttonName
                        );
                    }
                    return false;
    },
    submit:function(ajax_data){
        var target = document.getElementById('spinner');
        var spinner = new Spinner(coinz.initSpiner());
        spinner.spin(target);

        this.register(ajax_data , function(user){
            coinz.setUser(user);
            $("#spinner").hide();
            spinner.stop();
            //alert("פרטיך נקלטו בהצלחה! תוכל כעת להשתמש באפליקציה. מנהל המוסד יצור איתך קשר בימים הקרובים לאימות הפרטים.")
            var title =  'ההרשמה בוצעה בהצלחה!';
            var msg = 'תוכל כעת להשתמש באפליקציה. מנהל המוסד יצור איתך קשר בימים הקרובים לאימות הפרטים.';
            var btnLabel = 'אישור';
            navigator.notification.alert(
                msg,
                null,         // callback
                title,            // title
                btnLabel                  // buttonName
            );
            coinz.goTo('main.html');
        });
    },
    register:function(userForm,callBack){
    	coinz.ajax('register_multi_users' , userForm , function(response){
    		if (typeof(response.error)=='string'){
                if (response.error=='allready registered'){
                    //alert('כתובת האימייל כבר קיימת במאגר, נסה שנית או בצע כניסה אם הינך רשום');
                    var title =  'תקלה בתהליך ההרשמה';
                    var msg = 'הנך כבר רשום למוסד זה. עבור למסך כניסה.';
                    var btnLabel = 'אישור';
                    navigator.notification.alert(
                        msg,
                        null,         // callback
                        title,            // title
                        btnLabel                  // buttonName
                    );
                    $("#spinner").hide();
                    spinner.stop();
                }
            } else {
                var userDB = response;
                callBack(userDB);
            }
    	});
    }
};