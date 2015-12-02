var balanceSumValue = 0.0;
var clicked = false;
var srcSound = "/android_asset/www/sounds/newCoinDrop.wav";

var donatePage = {
    container:function(){
        return $('#donatePage');
    },
    init:function(){
        this.initlogo();
        this.setFontSize();
        this.initCoinDrop();
        this.initApproveDonate();
        this.initResetDonate();
        this.setInfoData();
        this.designLogo();
        this.initCoins();
        $("#balanceSum").text("0");
        var windowWidth = window.width();
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
                var Coinz_beitchabad = appData.beitchabad_name;
                var serviceURL = "http://bit2bemobilecoinzdb.co.nf/contentMangement//php/get_beit_chabad_site_details.php?beit_chabad_site="
                    +appData.beitchabad_name;
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
    setFontSize: function(){
        var windowHeight = $(window).height();
        $('#donationNote').css('font-size', (windowHeight * 0.035) + 'px');
        $('#pickCoinText').css('font-size', (windowHeight * 0.035) + 'px');
        $('#balanceSum').css('font-size', (windowHeight * 0.035) + 'px');
    },
    initCoinDrop: function(){
        var self = this;

        //$(".coinToDrop").click(function(){
        $('.coinToDrop').on('touchstart', function(event) {
            event.preventDefault();

            var coinSound = new Media(srcSound);

            //Get value clicked by user
            var valueClicked = $(this).attr('value');
            //Save the element address clicked
            var clickedCoinElement = $(this);

            //Handle "other coin" option first
            if (valueClicked == "-1"){
                var valueFromUser = prompt("הכניסו סכום אחר לתרומה");
                if(valueFromUser != null){

                    //Check if user typed undefined number
                    while (isNaN(valueFromUser)){
                        navigator.notification.alert(
                            "אנא הקלד מספר בלבד",
                            null,         // callback
                            'בעיה בתרומה',            // title
                            'אשר'                  // buttonName
                        );

                        valueFromUser = prompt("הכניסו סכום אחר לתרומה");
                    }

                    //Take the number from user
                    valueClicked = valueFromUser;

                    //Run animation
                    self.runCoinDrop(valueClicked,clickedCoinElement,coinSound);
                }   else {
                    //DO NOTHiNG - user canceled donation.
                }

            } else {
            //Run animation for coins 0.1, 0.5, 1, 2 ,5 and 10
            self.runCoinDrop(valueClicked,clickedCoinElement,coinSound);
            }
        });
    },
    runCoinDrop: function(value,element,coinSound){
        self = this;
        //Check before running animation if user is not double clicking

        if(!clicked){
        clicked = true;

            $targetBeforeCashier = $("#donateTargetOne");
            $cashier = $("#charityImg");

            //Calculate balance and prepare number
            balanceSumValue += Number(value);
            balanceSumValue = (Math.round(balanceSumValue * 10) / 10);

            //Get elements positions
            var cashierPosition = $cashier.position();
            var targetBeforeCashierPosition = $targetBeforeCashier.position();
            coinPosition = element.position();

            //Calc delta to chashier
            var topDeltaToTemp = Math.abs(targetBeforeCashierPosition.top - coinPosition.top);
            var leftDeltaToTemp = Math.abs(targetBeforeCashierPosition.left - coinPosition.left);

            //element.removeAttr('style');
            var width = element.width();

            if ( value == 1 || value == 5 || value == 10){
                element.animate({
                    "top" : topDeltaToTemp/2,
                    "left" : leftDeltaToTemp*1.5,
                    "width" : width/2
                },500 , function() {
                    element.animate({
                        "top" : $cashier.offset().top/2.6,
                        "left" : $cashier.offset().left*1.4
                    },500, function() {
                        element.hide();
                        coinSound.play(srcSound);
                        $cashier.jrumble({
                            x: 0,
                            y: 0,
                            rotation: 6,
                            speed:70
                        });
                        $cashier.trigger('startRumble');
                        element.hide();

                        setTimeout(function(){
                            $("#balanceSum").text(balanceSumValue);
                            $cashier.trigger('stopRumble');

                            element.animate({
                                "top" : coinPosition.top,
                                "left" : coinPosition.left,
                                "width" : width
                            },10, function(){
                                element.show();
                                clicked = false;
                            });
                        }, 500);
                    });
                });
            } else if (value == 0.1 || value == 0.5 || value == 2){

                element.animate({
                    "top" : topDeltaToTemp/2,
                    "left" : leftDeltaToTemp*1.5,
                    "width" : width/2
                },500 , function() {
                    element.animate({
                        "top" : $cashier.offset().top/2.6,
                        "left" : $cashier.offset().left*1.4
                    },500, function() {
                        coinSound.play(srcSound);
                        $cashier.jrumble({
                            x: 0,
                            y: 0,
                            rotation: 6,
                            speed:70
                        });
                        $cashier.trigger('startRumble');
                        element.hide();

                        setTimeout(function(){
                            $("#balanceSum").text(balanceSumValue);
                            $cashier.trigger('stopRumble');

                                element.animate({
                                    "top" : coinPosition.top,
                                    "left" : coinPosition.left,
                                    "width" : width
                                },10, function(){
                                element.show();
                                clicked = false;
                                });
                            }, 500);
                    });
                });

            } else  {
                //separate animation type for "other coin"
                element.animate({
                    "top" : 22 + "%",
                    "left" : 45 + "%",
                    "width" : width/2
                },500, function() {
                    element.hide();
                    coinSound.play(srcSound);
                    $cashier.jrumble({
                        x: 0,
                        y: 0,
                        rotation: 6,
                        speed:70
                    });
                    $cashier.trigger('startRumble');
                    element.hide();

                    setTimeout(function(){
                        $("#balanceSum").text(balanceSumValue);
                        $cashier.trigger('stopRumble');

                        element.animate({
                            "top" : coinPosition.top,
                            "left" : coinPosition.left,
                            "width" : width
                        },10, function(){
                            element.show();
                            clicked = false;
                        });
                    }, 500);
                });
            }
        }

    },
    initApproveDonate: function(){
        var self = this;
        $("#confirmDonate").click(function(){
            if(localStorage.getItem("CoinzCashierValue") == "0"){
                navigator.notification.alert(
                    "סכום התרומה הינו אפס. אנא גרור את המטבעות המתאימים לקופה ולחץ אישור.",
                    null,         // callback
                    'תרומה לא בוצעה',            // title
                    'אשר'                  // buttonName
                );
            } else {
                self.donate(localStorage.getItem("CoinzCashierValue"));
                localStorage.setItem("CoinzCashierValue",0);
            }
        });
    },
    initResetDonate: function(){
        $("#resetBtn").click(function(){
            balanceSumValue = 0.0;
            $("#balanceSum").text(balanceSumValue);
        });
    },
    addToDB:function(donationData , callBack){
    	coinz.ajax('add_donation' , donationData , function(response){
    		 callBack();
    	});
    },
    getHebDate:function(callback){
        var self = this;
        var currentTime = new Date();
        var dData = {
            month:currentTime.getMonth() + 1,
            day:currentTime.getDate(),
            year:currentTime.getFullYear()
        };
        $.ajax({
            type: "GET",
            url: "http://www.hebcal.com/converter/",
            data: "cfg=json"+"&gy="+dData.year+"&gm="+dData.month+"&gd"+dData.day+"&g2h=1",
            dataType:'json',
            success: function(date_result){
                var heb_date = date_result.hebrew;
                callback(heb_date);
            }
        });
    },
    donate:function(donationSum){
        var self = this;

        this.getHebDate(function(heb_date){
            var donationNote = $("#donationNote").val();
            var donationData = {donation_sum:donationSum,donation_note:donationNote,heb_date:heb_date};

            navigator.notification.confirm(
                "אנא אשר תרומה בסך" + " " + donationSum + " " + 'ש"ח',  // message
                 self.donateSuccess(donationData),              // callback to invoke with index of button pressed
                'אישור תרומה',            // title
                'ביטול,אישור'          // buttonLabels
            );
        });
    },
    donateSuccess: function(donationData){
        self.addToDB(donationData , function(){
                navigator.notification.alert(
                    "תודה רבה על תרומתכם. קבלה על התרומה תשלח על יד" + " " +
                        appData.titleOne + " " +
                        "בסוף כל חודש קלנדרי על כלל התרומות בחודש זה.",
                    null,         // callback
                    'תרומה בוצעה בהצלחה',            // title
                    'אשר'                  // buttonName
                );
                coinz.goTo("main.html");
        });
    },
    messageDetailsEvents:function(){
        var container = this.container();
        $('a' , container).click(function(){
            $('#message_details').fadeOut(300 , function(){
                $('h2 #goBack').hide();
                $('ul' , container).fadeIn();
            });
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
    
}