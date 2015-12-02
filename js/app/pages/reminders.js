var spinner;
var windowHeight = $(window).height();
var remindersPage = {
    container:function(){
        return $('#remindersPage');
    },
    init:function(){
        this.initlogo();
        this.setSize();
        this.setList();
        this.setInfoData();
        this.designLogo();

    },
    initlogo: function(){
        if(localStorage.getItem('CoinzLogoImgUrl') == null){
            this.populateLogo();
        } else {
            var logoImg = $('#headerLogoImg');
            logoImg.css('background-image' ,'url('+ localStorage.getItem('CoinzLogoImgUrl') + ')');
        }
    },
    populateLogo:function(){
        self = this;
        if (localStorage.getItem('CoinzLogoImg') == null){
            if(coinz.getUser() != "undefined"){
                var Coinz_beitchabad = coinz.getUser().beit_chabad_site;
                var serviceURL = "http://bit2bemobilecoinzdb.co.nf/contentMangement/php/get_beit_chabad_site_details.php?beit_chabad_site="
                    +coinz.getUser().beit_chabad_site;
                $.ajax({
                    type: 'GET',
                    async: false,
                    url: serviceURL,
                    dataType : 'json',
                    success : function(data) {
                        if(typeof(data[0]) != "undefined"){
                            var logo_url = data[0].logo_url;
                            $('#headerLogoImg').css('background-image' , 'url('+ logo_url + ')');
                            //Save image to localStorage
                            localStorage.setItem("CoinzLogoImgUrl", logo_url);
                        }
                    }
                });
            }
        } else {
            $('#headerLogoImg').css('background-image' , localStorage.getItem("CoinzLogoImg"));
        }
    },
    designLogo: function(fullname){
        var windowHeight = $(window).height();
        var lineOne = appData.titleOne;
        var lineTwo = appData.titleTwo;

        this.container().find('.locationTop').html(lineOne);
        this.container().find('.locationBottom').html(lineTwo);

        $('#beitChabadLabelTop').css('font-size', (windowHeight * 0.030) + 'px');
        $('#beitChabadLabelBottom').css('font-size', (windowHeight * 0.025) + 'px');
        if (windowHeight < 500) {
            $('#beitChabadLabelTop').css('font-size', (windowHeight * 0.035) + 'px');
            $('#beitChabadLabelBottom').css('font-size', (windowHeight * 0.030) + 'px');
            $('#beitChabadLabelTop').css('top', '13%');
            $('#beitChabadLabelBottom').css('top', '44%');
        }
    },
    setSize: function(){
        var windowHeight = $(window).height();
        $('#remindersTab').css('font-size', (windowHeight * 0.035) + 'px');
        $('#donationsTab').css('font-size', (windowHeight * 0.035) + 'px');
        //CSS for iPhone4 and small screens
        if (windowHeight < 500) {
            $('.reminders_list').css('padding-top','29%');
            $('#headerLogoImg').css('top', '2%');
        }
        //CSS for Samasung S5 screens
        if (windowHeight > 590) {
            $('.reminders_list').css('margin-right','0.5%');
            $('.reminders_list').css('width','99.9%');
        }
    },
    appendList:function(data){
        var self = this;
        var target = document.getElementById('spinner');
		spinner = new Spinner(coinz.initSpiner()).spin(target);

        var item_list = self.container().find('.reminders_list');
        if (typeof(data)=='object' && data.length>0){
        	$.each(data, function(index,item) {
                self.addItem(item_list , index , item);
            });
        } else {
            var reminder_item = $("<li>" +
                "לא קיימות עדיין תזכורות בפרופיל שלך"
                + "</li>");
            reminder_item.css('min-height',(windowHeight * 0.058) + 'px');
            reminder_item.css("text-align", "center");
            reminder_item.css("background-size", 13+"%");
            reminder_item.css('font-size', (windowHeight * 0.030) + 'px');
            reminder_item.css('width', 85.7 +"%");
            reminder_item.css('padding-left', 2 + "%");
            reminder_item.css('padding-top', 6 + "%");
            item_list.append(reminder_item);
            }
        spinner.stop();
    },
    addItem:function(item_list , index , item){
        var self = this;
        var reminderNote = item.reminder_note;
        if (reminderNote == null){
            reminderNote = "";
        } else {
            reminderNote = reminderNote + " ";
        }

        var reminder_item = $("<li><div id='removeCell' class='remove'></div>" + item.reminder_heb + " "  + item.heb_type + " " + reminderNote + "</li>");
        item_list.append(reminder_item);
        $('.remove' , reminder_item).click(function(){
            self.removeFromDB(item.reminder_id , function(){
                self.removeFromList(reminder_item);
            });
        });

        reminder_item.css('font-size', (windowHeight * 0.030) + 'px');
        reminder_item.css('min-height',(windowHeight * 0.058) + 'px');
        reminder_item.css("background-image", "url('../images/Profile/close.png')");
        reminder_item.css("background-position", "left center");
        reminder_item.css("background-size", 13+"%");
    },
    removeFromDB:function(reminder_id , callback){
    	var data = {reminder_id:reminder_id};
    	coinz.ajax('remove_reminder' , data , function(){
    		callback();
    	});
    },
    removeFromList:function(item){
        console.log(item);
        $(item).slideUp(400 , function(){
            item.remove();
        })
    },
    setList:function(){
     	//init params for spinner
    	var target = document.getElementById('spinner');
    	var spinner = new Spinner(coinz.initSpiner());
    	spinner.spin(target);
    	
        var self = this;		
        coinz.ajax('get_reminders' , {} , function(list){
        	self.appendList(list);
        	$("#spinner").hide();
            spinner.stop();	
    	});
    },
    setInfoData: function(){
        var beitchabad_name = appData.beitchabad_name;
        var beitchabad_address = appData.beitchabad_address;
        var beitchabad_phone = appData.beitchabad_phone;
        var beitchabad_owner_name = appData.beitchabad_owner_name;

        $("#info").click(function(){
            navigator.notification.alert(
                "שם המוסד" + ":" + " " + beitchabad_name + "\n" +
                    "כתובת" + ":" + " " +     beitchabad_address + "\n" +
                    "טלפון" + ":" + " " +     beitchabad_phone + "\n" +
                    "שם מנהל המוסד" + ":" + " " +    beitchabad_owner_name,
                null,         // callback
                'פרטי המוסד',            // title
                'אשר'                  // buttonName
            );
        });
    }
};