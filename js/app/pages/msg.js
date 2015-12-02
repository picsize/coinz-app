var messagePage = {
    container:function(){
        return $('#msgPage');
    },
    init:function(){
        this.initlogo();
        this.setSize();
        this.setList();
        this.messageDetailsEvents();
        this.back();
        this.setInfoData();
        this.designLogo();
        this.goOutside();

        window.addEventListener("orientationchange", this.cahangeOreintation);
        var orientation = "portrait";

        $('#clickForFullScreen').hide();

    },
    cahangeOreintation: function(){

    switch (window.orientation) {
        case 0:
            // portrait, home bottom
            $('#vidContainer').css('margin-top','14%');
            $("#header").show();
            $("#footer").show();
            $("#stripContainer").show();
            $("#msgContent").show();
            $("#decoLine").show();
            $("#dummySpace").show();
           break;
        case 180:
            // portrait, home top
            $('#vidContainer').css('margin-top','14%');
            $("#header").show();
            $("#footer").show();
            $("#stripContainer").show();
            $("#msgContent").show();
            $("#decoLine").show();
            $("#dummySpace").show();
            break;
        case -90:
            // landscape, home left
            $('#vidContainer').css('margin-top','-14%');
            $("#header").hide();
            $("#footer").hide();
            $("#stripContainer").hide();
            $("#msgContent").hide();
            $("#decoLine").hide();
            $("#dummySpace").hide();
            break;
        case 90:
            // landscape, home right
            $('#vidContainer').css('margin-top','-14%');
            $("#header").hide();
            $("#footer").hide();
            $("#stripContainer").hide();
            $("#msgContent").hide();
            $("#decoLine").hide();
            $("#dummySpace").hide();
        break;
    }
    },
    goOutside: function(){
        $("a").click(function(){
            $("#header").show();
            $("#footer").show();
            $("#stripContainer").show();
            $("#msgContent").show();
            $("#decoLine").show();
            $("#dummySpace").show();
            //screen.lockOrientation('portrait');
            navigator.screenOrientation.set('portrait');
        });
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
        $('#msgContent').css('font-size', (windowHeight * 0.045) + 'px');
        $('#msgPage').css('font-size', (windowHeight * 0.025) + 'px');
        $('#title').css('font-size', (windowHeight * 0.03) + 'px');
        $('#text').css('font-size', (windowHeight * 0.03) + 'px');
        $('#beitChabadLabel').css('font-size', (windowHeight * 0.035) + 'px');
        //CSS for iPhone4 and small screens
        if (windowHeight < 500) {
            $('img').css('height','240px');
            $('img').css('margin-top','2%');
            $('#goBack').css('top','33%');
            $('#stripContainer').css('height','10%');
            $('#headerLogoImg').css('top', '2%');
        }
    },
    setDetailPageSize: function(){
        var windowHeight = $(window).height();
        var message_detailsHeight = $('#message_details').height();
        console.log("message_detailsHeight ="+ message_detailsHeight);
        //$('#message_details').css('height', message_detailsHeight * 0.6 + 'px');
    },
    back:function(){
        $("#goBack").click(function(){
            //screen.lockOrientation('portrait');
            navigator.screenOrientation.set('portrait');
            $('#clickForFullScreen').hide();
            location.reload();
        });
    },
    messageDetailsEvents:function(){
       var container = this.container();
       $('a' , container).click(function(){
            $('#message_details').fadeOut(500 , function(){
                $('ul' , container).fadeIn();
            });
        });
    },
    getList:function(callback){
		//init params for spinner
    	var target = document.getElementById('spinner');
    	var spinner = new Spinner(coinz.initSpiner());
    	spinner.spin(target);
				
    	var Coinz_beitchabad = coinz.getUser().beit_chabad_site;
        var serviceURL = "http://bit2bemobilecoinzdb.co.nf/server/index.php?beit_chabad=" + Coinz_beitchabad + "&action=get_note";
        $.getJSON(serviceURL,function(data) {
            callback(data);
           	$("#spinner").hide();
            spinner.stop();	
        });
    },
    appendList:function(data){

        var self = this;
        $.each(data, function(index,item) {
            var li = $("<li>" + item.note_title + "</li>");
            self.container().find('.message_list').append(li);
            $(li).click(function(){
                self.showMessage(item);
            });
        });
        //Add deco line
        var liDeco = $('<li class="decoLine"></li>');
        self.container().find('.message_list').append(liDeco);
    },
    setList:function(){
        var self = this;
       
        this.getList(function(data){
            self.appendList(data);
        });
    },
    showMessage:function(item){
        var container = this.container();
        if (item.media_type == "image"){
            $('#message_details img' , container).attr('src' , item.image_url);
            $('#vidContainer').hide();
            $('#imgContainer').show();
        } else if (item.media_type == "video") {
            //screen.unlockOrientation();
            navigator.screenOrientation.set('fullSensor');
            //alert(item.video_url);
            $('#videoIframe', container).attr('src', item.video_url);
            $('#vidContainer').show();
            $('#imgContainer').hide();
            $('#clickForFullScreen').show();

            $("#clickForFullScreen").click(function () {
               // window.open(item.video_url,'_system','location=yes');
                navigator.app.loadUrl(item.video_url, { openExternal: true });
            });

            $("#videoIframe").click(function () {
                navigator.app.loadUrl(item.video_url);
            });


        } else if (item.media_type == "text") {
            $('#vidContainer').hide();
            $('#imgContainer').hide();
        }

        $('#titleOfMsg' , container).html(item.note_title);
        var textToShow = item.note;
        textToShow = textToShow.replace(/\\/g, '');
        $('#text' , container).html(textToShow);
        $('ul' , container).fadeOut(500 , function(){
           $('#message_details').fadeIn(500);
            $('#goBack').show();
        });
        this.setDetailPageSize();
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