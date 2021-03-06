var balanceSumValue = 0;
var kupaSum = 0;
var clicked = false;
var coinSound;
var donateBtnClicked = false;
var owner_papypal_email;
var owner_pelepay_email;
var doantionNoteText = '';

var donatePage = {
    container:function(){
        return $('#donatePage');
    },
    init:function(){
        var self = this;
        self.initlogo();
        self.setSize();
        self.populateLocation();
        self.initDragDrop();
        self.initOther();
        self.updateKupaCounter();
        self.setInfoData();
        self.setUserInfo();
        self.paymentBtnClicked();
        self.note();

        $("#balanceSum").text("0");

        $("#approveBtn").click(function(){
            if (!donateBtnClicked){
                donateBtnClicked = true;

                if(balanceSumValue == 0){
                    var title =  'בעיה בתרומה';
                    var msg = 'הקופה כרגע ריקה. אנא גרור מטבעות מתאים ולחץ אשר שוב.';
                    var btnLabel = 'אשר';
                    navigator.notification.alert(
                        msg,
                        null,         // callback
                        title,            // title
                        btnLabel                  // buttonName
                    );
                    donateBtnClicked = false;
                } else {
                    self.donate(balanceSumValue);

                    balanceSumValue = 0;
                    $("#balanceSum").text(balanceSumValue);
                }
            }
        });

        $('#donationNote').click(function () {
            $('#donatePage').hide();
            $('#notePage').css('visibility','visible');
        });

        //For media play enable
        document.addEventListener("deviceready", self.onDeviceReady, false);
    },
    updateKupaCounter: function(){
        var self = this;
        var user_id = coinz.getUser();
        coinz.ajax('get_donations_byUser' , user_id , function(response){
            //update paypal hidden form
            if(response[0].total_donations_unpaid == null){
                $('#kupaTotal').append("0");
                localStorage.setItem("total_donations_unpaid",0);
            } else {
                $('#kupaTotal').append(response[0].total_donations_unpaid);
                localStorage.setItem("total_donations_unpaid",response[0].total_donations_unpaid);
            }
        });
    },
    paymentBtnClicked: function(){
        //alert(appData.user_iCreditToken);
        //alert(appData.owner_pelepay_email);
        //alert(appData.owner_papypal_email);
        var self = this;
        var data = {};
        data.user_id = coinz.getUser().user_id;

        $("#sendKupaToPayment").click(function(){

            if (localStorage.getItem("total_donations_unpaid") < 8){
                var title =   'סכום נמוך בקופה';
                var msg = 'הסכום בקופה נמוך מ8 ש״ח, לכן לא ניתן לבצע עדיין תשלום.';
                var btnLabel = 'תודה';
                navigator.notification.alert(
                    msg,          //massage
                    null,         // callback
                    title,        // title
                    btnLabel      // buttonName
                );
            } else if (appData.user_iCreditToken != null){
                var title =   'בקשה לתשלום';
                var msg = 'תודה על תרומתך. הסכום הועבר לסליקה באמצעות פרטי האשראי שמסרת לנו טלפונית';
                var btnLabel = 'תודה';
                navigator.notification.alert(
                    msg,          //massage
                    null,         // callback
                    title,        // title
                    btnLabel      // buttonName
                );

                data.payment_status = "please_pay_with_icredit";
                coinz.ajax('update_payment_status' , data , function(response){
                    coinz.goTo("main.html");
                });
            } else if (appData.owner_pelepay_email !=""){
                self.pelepayTransaction();
                coinz.goTo("main.html");
            } else if (appData.owner_papypal_email !=""){
                self.paypalTransaction();
                coinz.goTo("main.html");
            } else {
                var title =   'אין אמצעי תשלום';
                var msg = 'תודה על בקשתך. אנו ניצור עמך קשר טלפוני בימים הקרובים';
                var btnLabel = 'תודה';
                navigator.notification.alert(
                    msg,          //massage
                    null,         // callback
                    title,        // title
                    btnLabel      // buttonName
                );
                data.payment_status = "no_payment_method_please_call_me";
                coinz.ajax('update_payment_status' , data , function(response){
                    coinz.goTo("main.html");
                });
            }
        });
    },
    onDeviceReady: function() {
        //for android
        var src = "/android_asset/www/sounds/newCoinDrop.wav";
        //for iPhone
        //var src = "sounds/newCoinDrop.wav";
        coinSound = new Media(src);
    },
    initlogo: function(){
        if(localStorage.getItem('CoinzLogoImgUrl') == null){
            this.populateLogo();
        } else {
            var logoImg = $('#headerLogoImg');
            logoImg.css('background-image' ,'url('+ localStorage.getItem('CoinzLogoImgUrl') + ')');
        }
    },
    getPhoneGapPath: function(){
        var path = window.location.pathname;
        var phoneGapPath = path.substring(0, path.lastIndexOf('/') + 1);
        return phoneGapPath;
    },
    populateLogo:function(){
        if (localStorage.getItem('CoinzLogoImg') == null){
            if(coinz.getUser() != "undefined"){
                var Coinz_beitchabad = coinz.getUser().beit_chabad_site;
                var serviceURL = "http://bit2bemobilecoinzdb.co.nf/server/index.php?action=get_beit_chabad_site_details&beit_chabad_site="
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
        $('#donationNote, #moneyType').css('font-size', (windowHeight * 0.025) + 'px');
        $('#pickCoinText').css('font-size', (windowHeight * 0.025) + 'px');
        $('#balanceSum').css('font-size', (windowHeight * 0.032) + 'px');
        $('#kupaTotal').css('font-size', (windowHeight * 0.032) + 'px');
        $('#beitChabadLabel').css('font-size', (windowHeight * 0.03) + 'px');
        $('#kupaTotal').css('font-size', (windowHeight * 0.032) + 'px');
        $('#noteHolder').css('height', '260px');
        //CSS for iPhone4 and small screens
        if (windowHeight < 500) {
            //$('#donationNote').css('right','15%');
            //$('#donationNote').css('text-indent','0.3em');
            //$('#donationNote').css('padding-top','0.9%');
            //$('#donationNote').css('padding-bottom','1.5%');
            //$('#donationNote').css('padding-left','1%');
            //$('#donationNote').css('padding-right','1%');
            //$('#donationNote').css('height','5%');
            //$('#donationNote').css('width','70%');
            //$('#donationNote').css('background-size','100% 100%');
            $('#donationNote, #moneyType').css('font-size', '87%');
            $('#confirmDonate').css('top','86%');
            $('#confirmDonate').css('right','26%');
            $('#contentImg').css('top','18%');
            $('#beitChabadLabel').css('font-size', (windowHeight * 0.035) + 'px');
            $('#headerLogoImg').css('top', '1.2%');
            $('#headerLogoImg').css('width', '15%');
            $('#headerLogoImg').css('height', '7.5%');
            $('#headerLogoImg').css('right', '-2%');
            $('#cashierWrap').css('height', '26%');
            $('#cashierWrap').css('top', '59%');
            $('#noteHolder').css('height', '160px');
        }
    },
    populateLocation:function(){
        var self = this;

        if (localStorage.getItem('CoinzLocationTitle') == null){
            if(coinz.getUser() != "undefined" ){
                var location = coinz.getUser().beit_chabad_site;
                self.designLogo(location);
                localStorage.setItem('CoinzLocationTitle',location);
            } else {
                //Do nothing
            }
        } else {
            var locationFromLocalStorage = localStorage.getItem('CoinzLocationTitle');
            self.designLogo(locationFromLocalStorage);
        }
    },
    initDragDrop:function(){
        //var coinSound = new Media(srcSound);
        var self = this;
        $('.coinToDrop').each(function(){
            var value = $(this).attr('value');
            $(this).draggable({ revert: true });
        });
        $('.donationArea').droppable({
            drop:function(event , ui){
                var coin = ui.draggable;
                var value = coin.attr('value');
                coin.hide();

                coinSound.play();

                $("#charityImg").jrumble({
                    x: 0,
                    y: 0,
                    rotation: 6,
                    speed:90
                });
                $("#charityImg").trigger('startRumble');

                setTimeout(function(){
                    balanceSumValue += Number(value);
                    balanceSumValue = (Math.round(balanceSumValue * 100) / 100);
                    $("#balanceSum").text(balanceSumValue);
                    $("#charityImg").trigger('stopRumble');
                    coin.show();
                }, 500);
            }
        });
    },
    initOther:function(){
        selfOther = this;
        $("#coin_other").click(function(){
            //var coinSound = new Media(srcSound);
            //var self = this;

            //var valueFromUser = prompt("הכנס סכום אחר לתרומה");
            navigator.notification.prompt(
                'אנא הכנס את הסכום לתרומה',  // message
                selfOther.onOtherAmountPrompt,                    // callback to invoke
                'סכום אחר',                  // title
                ['אשר','בטל']             // buttonLabels
            );
        });
    },
    onOtherAmountPrompt: function (results) {
        var valueFromUser = results.input1;
        if (results.buttonIndex != 2) {
            if (valueFromUser != null || valueFromUser != 0) {
                //Check if user typed undefined number
                if (isNaN(valueFromUser) || valueFromUser < 0) {
                    donateBtnClicked = false;
                    var title1 = 'בעיה בתרומה';
                    var msg1 = 'אנא הכנס מספרים בלבד ובעלי ערך חיובי';
                    var btnLabel1 = 'אשר';
                    navigator.notification.alert(
                        msg1,
                        null,         // callback
                        title1,            // title
                        btnLabel1                  // buttonName
                    );
                } else {

                    //Take the number from user
                    donateBtnClicked = false;
                    var value = valueFromUser;
                    balanceSumValue += Number(value);
                    balanceSumValue = (Math.round(balanceSumValue * 100) / 100);
                    $("#balanceSum").text("₪" + balanceSumValue);
                    if (valueFromUser != 0) {
                        coinSound.play();
                    }
                }
            }
        }
    },
    getHebDate:function(callback){
        var hebDate = localStorage.getItem("hebrewDate");
        callback(hebDate);
    },
    donate:function(donationSum){
        var self = this;

        self.getHebDate(function(heb_date){
            var donationNote = doantionNoteText;
            donationData = {donation_sum:donationSum,donation_note:donationNote,heb_date:heb_date,eng_date:"none"};

            var title =  'אישור תרומה';
            var msg = "אנא אשר תרומה בסך" + " " + donationSum + " " + 'ש"ח';
            var buttonsArray =['ביטול','אישור'];

            navigator.notification.confirm(
                msg,                                           // message
                function(buttonIndex){
                    self.startDbAction(buttonIndex);
                },              // callback to invoke with index of button pressed
                title,                                         // title
                buttonsArray                                   // buttonLabels
            );
        });
    },
    startDbAction: function(button){
        var self = this;
        if (button != 1){
            self.addToDB(donationData , function(){
                donateBtnClicked = false;
                coinz.goTo("donate.html");
            });
        }
    },
    addToDB:function(donationData , callBack){
        coinz.ajax('add_donation' , donationData , function(response){
            callBack();
        });
    },
    setInfoData: function(){
        var self = this;

        var serviceURL = "http://bit2bemobilecoinzdb.co.nf/server/index.php?action=get_beit_chabad_site_details_by_id&beit_chabad_id="
            + appData.beit_chabad_id;
        $.ajax({
            type: 'GET',
            async: false,
            url: serviceURL,
            dataType : 'json',
            success : function(data) {
                var beitchabad_name = data[0].beit_chabad_site;
                var beitchabad_address = data[0].beitchabad_address;
                var beitchabad_phone = data[0].beitchabad_phone;
                var beitchabad_owner_name = data[0].beitchabad_owner_name;
                appData.owner_papypal_email = data[0].business_email;
                appData.owner_pelepay_email = data[0].pelepay_email;

                $("#info").click(function(){
                    navigator.notification.alert(
                        "שם המוסד" + ":" + " " + beitchabad_name + "\n" +
                            "כתובת" + ":" + " " +     beitchabad_address + "\n" +
                            "טלפון" + ":" + " " +     beitchabad_phone + "\n" +
                            "מנהל המוסד" + ":" + " " +    beitchabad_owner_name,
                        null,         // callback
                        'פרטי המוסד לתרומה',            // title
                        'אשר'                  // buttonName
                    );
                });
            }
        });
    },
    setUserInfo: function(){
        var self = this;

        var serviceURL = "http://bit2bemobilecoinzdb.co.nf/server/index.php?action=get_user_info&user_id="
            + coinz.getUser().user_id;
        $.ajax({
            type: 'GET',
            async: false,
            url: serviceURL,
            dataType : 'json',
            success : function(data) {
                appData.user_iCreditToken = data.icredit_token;
            }
        });
    },
    paypalTransaction: function(){
        //document.forms["paypalForm"].submit();
        var sum = localStorage.getItem("total_donations_unpaid");
        var first_name = coinz.getUser().firstname;
        var last_name = coinz.getUser().lastname;
        var email = coinz.getUser().email;
        var return_link = "http://bit2bemobilecoinzdb.co.nf/server/index.php?" +
            "action=update_payment_status_paypalOnly&payment_coinz=Payment_completed_with_PayPal&user_id="+coinz.getUser().user_id;

        navigator.app.loadUrl('https://www.paypal.com/cgi-bin/webscr?cmd=_donations&lc=IL&charset=UTF-8' +
            '&currency_code=ILS&no_note=0'+
            '&cn='+
            'תרומה דרך אפליקציית CoinZ' +
            '&no_shipping=2&bn=PP-DonationsBF:btn_donateCC_LG.gif:NonHosted&rm=2' +
            '&business=' + appData.owner_papypal_email +
            '&amount=' + sum +
            '&first_name=' + first_name +
            '&last_name=' + last_name +
            '&email=' + email +
            '&return_link=' + return_link, { openExternal:true } );
    },
    pelepayTransaction: function(){
        //document.forms["pelepayform"].submit();
        //var ref = window.open('https://www.pelepay.co.il/pay/paypage.aspx?business=chabadkatamon@012.net.il&amount=1&description=_donation', '_system');
        var sum_pelepay = localStorage.getItem("total_donations_unpaid");
        var first_name_pelepay = coinz.getUser().firstname;
        var last_name_pelepay = coinz.getUser().lastname;
        var email_pelepay = coinz.getUser().email;
        //var return_link_pelepay = 'http://bit2bemobilecoinzdb.co.nf/server/index.php?' +
        //    'action=update_payment_status_paypalOnly&payment_coinz=Payment_completed_with_PelePay&user_id='+coinz.getUser().user_id;
        var return_link_pelepay = 'http://bit2bemobilecoinzdb.co.nf/server/actions/update_payment_status_pelepayOnly.php';


        navigator.app.loadUrl('https://www.pelepay.co.il/pay/paypage.aspx?' +
            'business=' + appData.owner_pelepay_email +
            '&amount=' + sum_pelepay +
            '&Firstname=' + first_name_pelepay +
            '&lastname=' + last_name_pelepay +
            '&email=' + email_pelepay +
            '&description=_donation' +
            '&custom=' + coinz.getUser().user_id +
            '&success_return=' + return_link_pelepay, { openExternal:true } );

    },
    note: function () {
        $('#saveNote').click(function () {
            doantionNoteText = $('#noteHolder').val();
            $('#goBack').click();
        });

        $('#goBack').click(function () {
            $('#donatePage').show();
            $('#notePage').css('visibility', 'hidden');
        });
    }
}