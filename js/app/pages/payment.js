var paymentPage = {
    container:function(){
        return $('#paymentPage');
    },
    data:{
        date:{},
        heb_date:{},
        info:{}
    },
    init:function(){
        var self = this;
        self.setInfoData();
        self.setBackgroundheight();
        self.initlogo();
        self.setSize();
        self.populateLocation();
        self.callMeBtn();
        self.creditCardBtn();
        self.pelepayBtn();
        self.paypalBtn();

        //For splash screen plugin sync
        document.addEventListener("deviceready", this.onDeviceReady, false);
    },
    onDeviceReady: function() {
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
    setBackgroundheight: function(){
        var windowHeight = $(window).height();
        var footerHeight = $("#footer").height();
        $('#content').css('height', windowHeight * 0.87);
    },
    setDonateBtn: function(){
        var footerHeight = $("#footer").height();
        var windowHeight = $(window).height();
        $('#goToDonate').css('height', windowHeight * 0.2);
    },
    setSize: function(){
        var windowHeight = $(window).height();
        $('#title').css('font-size', (windowHeight * 0.045) + 'px');
        $('#balance').css('font-size', (windowHeight * 0.04) + 'px');
        $('#beitChabadLabel').css('font-size', (windowHeight * 0.03) + 'px');
        if (windowHeight < 500) {
            $('#goToDonateImg').css('top','68.5%');
            $('#beitChabadLabel').css('font-size', (windowHeight * 0.035) + 'px');
            $('#headerLogoImg').css('top', '2%');
        }
    },
    designLogo: function(fullname){
        var windowHeight = $(window).height();
        var nameArray = fullname.split(",");
        var lineOne = nameArray[0];
        var lineTwo = nameArray[1];

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
    updatePaymentCounter: function(){
        var self = this;
        var user_id = coinz.getUser();
        coinz.ajax('get_donations_byUser' , user_id , function(response){
            //update paypal hidden form
            if(response[0].total_donations_unpaid == null){
                $('#balanceSum').append("0" + " " + 'ש״ח');
                localStorage.setItem("total_donations_unpaid",0);
            } else {
                $('#balanceSum').append(response[0].total_donations_unpaid  + " " + 'ש״ח');
                localStorage.setItem("total_donations_unpaid",response[0].total_donations_unpaid);
            }
        });
    },
    callMeBtn: function(){
        var data = {};
        data.payment_status = "Please_call_me_to_receive_the_donation";
        data.user_id = coinz.getUser().user_id;

        $("#callMeBtn").click(function(){
            if (localStorage.getItem("total_donations_unpaid") == 0){
                var title =   'אין כסף בקופה';
                var msg = 'אנא בצע תרומה בעמוד תרומות ולאחר מכן תוכל לרוקן את הקופה ולשלם בדרך הנוחה לך.';
                var btnLabel = 'אשר';
                navigator.notification.alert(
                    msg,          //massage
                    null,         // callback
                    title,        // title
                    btnLabel      // buttonName
                );
            } else {
                coinz.ajax('update_payment_status' , data , function(response){
                    var title =   'בקשה לתשלום בטלפון';
                    var msg = 'בקשתך לתשלום בטלפון נרשמה בהצלחה. מנהל המוסד יצור איתך קשר בימים הקרובים.';
                    var btnLabel = 'אשר';
                    navigator.notification.alert(
                        msg,          //massage
                        null,         // callback
                        title,        // title
                        btnLabel      // buttonName
                    );
                    coinz.goTo("main.html");
                });
            }
        })
    },
    creditCardBtn: function(){
        var data = {};
        data.payment_status = "Please_charge_my_credit_card";
        data.user_id = coinz.getUser().user_id;

        $("#useMyCreditCardBtn").click(function(){
            if (localStorage.getItem("total_donations_unpaid") == 0){
                var title =   'אין כסף בקופה';
                var msg = 'אנא בצע תרומה בעמוד תרומות ולאחר מכן תוכל לרוקן את הקופה ולשלם בדרך הנוחה לך.';
                var btnLabel = 'אשר';
                navigator.notification.alert(
                    msg,          //massage
                    null,         // callback
                    title,        // title
                    btnLabel      // buttonName
                );
            } else {
                coinz.ajax('update_payment_status' , data , function(response){
                    alert(response);
                    var title =   'בקשה לחיוב האשראי התקבלה';
                    var msg = 'בקשתך לחייב את כרטיס האשראי התקבלה בהצלחה. מנהל המוסד יבצע את החיוב עם הפרטים שמסרת לו באשראי שלך.';
                    var btnLabel = 'אשר';
                    navigator.notification.alert(
                        msg,          //massage
                        null,         // callback
                        title,        // title
                        btnLabel      // buttonName
                    );
                    coinz.goTo("main.html");
                });
            }
        })
    },
    pelepayBtn: function(){
        var self = this;
        $("#pelepay").click(function(){
            if (localStorage.getItem("total_donations_unpaid") == 0){
                var title =   'אין כסף בקופה';
                var msg = 'אנא בצע תרומה בעמוד תרומות ולאחר מכן תוכל לרוקן את הקופה ולשלם בדרך הנוחה לך.';
                var btnLabel = 'אשר';
                navigator.notification.alert(
                    msg,          //massage
                    null,         // callback
                    title,        // title
                    btnLabel      // buttonName
                );
            } else {
                var beit_chabad_pelepay_email = localStorage.getItem("beit_chabad_pelepay_email");
                if (beit_chabad_pelepay_email != "") {
                    self.pelepayTransaction();
                } else {
                    var title =   'לא ניתן לבצע תשלום';
                    var msg = 'מנהל המוסד שלך טרם הסדיר שיטת תשלום זאת, לכן לא ניתן לבצע תשלום.';
                    var btnLabel = 'אשר';
                    navigator.notification.alert(
                        msg,          //massage
                        null,         // callback
                        title,        // title
                        btnLabel      // buttonName
                    );
                }
            }
        });
    },
    paypalTransaction: function(){
        //document.forms["paypalForm"].submit();
        var sum = localStorage.getItem("total_donations_unpaid");
        var business_email = localStorage.getItem("beit_chabad_business_email");
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
            '&business=' + business_email +
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
        var business_email_pelepay = localStorage.getItem("beit_chabad_pelepay_email");
        var first_name_pelepay = coinz.getUser().firstname;
        var last_name_pelepay = coinz.getUser().lastname;
        var email_pelepay = coinz.getUser().email;
        //var return_link_pelepay = 'http://bit2bemobilecoinzdb.co.nf/server/index.php?' +
        //    'action=update_payment_status_paypalOnly&payment_coinz=Payment_completed_with_PelePay&user_id='+coinz.getUser().user_id;
        var return_link_pelepay = 'http://bit2bemobilecoinzdb.co.nf/server/actions/update_payment_status_pelepayOnly.php';


        navigator.app.loadUrl('https://www.pelepay.co.il/pay/paypage.aspx?' +
            'business=' + business_email_pelepay +
            '&amount=' + sum_pelepay +
            '&Firstname=' + first_name_pelepay +
            '&lastname=' + last_name_pelepay +
            '&email=' + email_pelepay +
            '&description=_donation' +
            '&custom=' + coinz.getUser().user_id +
            '&success_return=' + return_link_pelepay, { openExternal:true } );

    },
    paypalBtn: function(){
        var self = this;
        $("#goToPaypal").click(function(){
            if (localStorage.getItem("total_donations_unpaid") == 0){
                var title =   'אין כסף בקופה';
                var msg = 'אנא בצע תרומה בעמוד תרומות ולאחר מכן תוכל לרוקן את הקופה ולשלם בדרך הנוחה לך.';
                var btnLabel = 'אשר';
                navigator.notification.alert(
                    msg,          //massage
                    null,         // callback
                    title,        // title
                    btnLabel      // buttonName
                );
            } else {
                var beit_chabad_business = localStorage.getItem("beit_chabad_business_email");
                if (beit_chabad_business != "") {
                    self.paypalTransaction();
                } else {
                    var title =   'לא ניתן לבצע תשלום';
                    var msg = 'מנהל המוסד שלך טרם הסדיר שיטת תשלום זאת, לכן לא ניתן לבצע תשלום.';
                    var btnLabel = 'אשר';
                    navigator.notification.alert(
                        msg,          //massage
                        null,         // callback
                        title,        // title
                        btnLabel      // buttonName
                    );
                }
            }
        });
    },
    getHebDate:function(){

        //First get greg date:
        var currentTime = new Date();

        if(currentTime.getHours() > 19){
            currentTime.setDate(currentTime.getDate() + 1);
            this.data.date.day = currentTime.getDate();
            this.data.date.month = currentTime.getMonth()+1;
            this.data.date.year = currentTime.getFullYear();
        } else {
            this.data.date.day = currentTime.getDate();
            this.data.date.month = currentTime.getMonth()+1;
            this.data.date.year = currentTime.getFullYear();
        }

        //Then convert it to hebrew date
        var self = this;
        var dData = self.data.date;

        $.ajax({
            type: "GET",
            url: "http://www.hebcal.com/converter/",
            dataType:'json',
            data: "cfg=json"+"&gy="+dData.year+"&gm="+dData.month+"&gd="+dData.day+"&g2h=1",
            success: function(heb_date){
                self.setText(heb_date);
                var hebDateEng =  heb_date.hd + " " + heb_date.hm + ", " + heb_date.hy;
                localStorage.setItem("hebrewDateEng",hebDateEng);
                $("#hebcalDate").text("Hayom Yom " + hebDateEng);
                $("#hebcalDate").show();
            }
        });
    },
    setInfoData: function(){
        var self = this;
        var Coinz_beitchabad;

        if (localStorage.getItem('CoinzLocationTitle') == null){
            localStorage.setItem('CoinzLocationTitle',coinz.getUser().beit_chabad_site);
        }
        var serviceURL = "http://bit2bemobilecoinzdb.co.nf/server/index.php?action=get_beit_chabad_site_details&beit_chabad_site="
            + localStorage.getItem('CoinzLocationTitle');
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

                //Get paypal url for payment page only
                var beitchabad_paypal_url = data[0].paypal_url;
                localStorage.setItem("beit_chabad_paypal_url",beitchabad_paypal_url);

                var owner_papypal_email = data[0].business_email;
                localStorage.setItem("beit_chabad_business_email",owner_papypal_email);

                var owner_pelepay_email = data[0].pelepay_email;
                localStorage.setItem("beit_chabad_pelepay_email",owner_pelepay_email);

                self.updatePaymentCounter();

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
    }
}