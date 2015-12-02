var hebMonth;
var mainPage = {
    container:function(){
        return $('#welcomePage');
    },
    data:{
        date:{},
        heb_date:{},
        info:{}
    },
    init:function(){
        var self = this;
        self.setBackgroundheight();
        self.setInfoData();
        self.initlogo();
        self.setDonateBtn();
        self.setSize();
        self.getHebDate();
        self.designLogo();
        $("#hello_user").append("שלום" + "," + " " + coinz.getUser().firstname + " " +  coinz.getUser().lastname);
        $('#welcomePage').show();
        $('#BH').show();
        $('#mainIframe').attr('src', appData.main_page_url);
        pushNotify.init();

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
            //downloadImage.init();
        }
    },
    populateLogo:function(){
        if (localStorage.getItem('CoinzLogoImg') == null){
            if(coinz.getUser() != "undefined"){
                var Coinz_beitchabad = coinz.getUser().beit_chabad_site;
                var serviceURL = "http://bit2bemobilecoinzdb.co.nf/server/index.php?action=get_beit_chabad_site_details&beit_chabad_site="
                    + coinz.getUser().beit_chabad_site;
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
        $('#goToDonate').css('height', windowHeight * 0.1);

        $('#goToDonate').click(function(){
            coinz.goTo("payment.html");

        });
    },
    needUpdate: function(){
        var check = false;
        var currentTime = new Date();
        var lastUpdateTime = new Date(localStorage.getItem("YomYom_update_date"));

        var _MS_PER_DAY = 1000 * 60 * 60 * 24;

        // Discard the time and time-zone information.
        var utc1 = Date.UTC(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate());
        var utc2 = Date.UTC(lastUpdateTime.getFullYear(), lastUpdateTime.getMonth(), lastUpdateTime.getDate());

        var diff = Math.floor((utc1 - utc2) / _MS_PER_DAY);
        var updateTime = localStorage.getItem("YomYom_update_date");

        if (diff >= 1 || updateTime == null || updateTime == ""){
            check = true;
        }

        var updateAfter2000 = localStorage.getItem("YomYom_After_20:00_update");
        if (currentTime.getHours() > 19 || updateAfter2000 == null || updateAfter2000 != "done" ){
            localStorage.setItem("YomYom_After_20:00_update","not_done");
        }

        return check;
    },
    setText:function(heb_date){
        var updateAfter2000 =  localStorage.getItem("YomYom_After_20:00_update");

        if (this.needUpdate() ||  updateAfter2000 == "not_done" || localStorage.getItem("Coinz_YomYom") == "" || localStorage.getItem("Coinz_YomYom") == null){
            var self = this;
            var ajax_data = {hday:heb_date.hd,hmonth:heb_date.hm};

            coinz.ajax('get_yom_yom' , ajax_data , function(response){
                if(response!='yom yom not found.')    {
                    var stringData = response.yom_yom_text;
                    localStorage.setItem("Coinz_YomYom",stringData);
                    var updateDate = new Date();
                    localStorage.setItem("YomYom_update_date",updateDate);
                    localStorage.setItem("YomYom_After_20:00_update","done");

                    $("#yom_yom_text").append(localStorage.getItem("Coinz_YomYom"));
                    console.log("Yom Yom updated from server -------------------------");
                } else {
                    var title1 =  'יום יום';
                    var msg1 = 'בשל בעיה זמנית בשרת, טקסט היום יום אינו מוצג.';
                    var btnLabel1 = 'אשר';
                    navigator.notification.alert(
                        msg1,
                        null,         // callback
                        title1,            // title
                        btnLabel1                  // buttonName
                    );
                }
            });
        } else {
            $("#yom_yom_text").append(localStorage.getItem("Coinz_YomYom"));
            console.log("Yom Yom updated from localStorage -------------------------");
        }
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
                console.log("heb_date.hebrew = " + heb_date.hebrew);

                var hebSplit = heb_date.hebrew.split(" ");
                var hebDay = hebSplit[0];
                var hebMonth = hebSplit[1];


                var hebYear;
                if(heb_date.hm == "Adar I" || heb_date.hm == "Adar II"){
                    hebYear = hebSplit[3];
                } else {
                    hebYear = hebSplit[2];
                }

                hebMonth = self.replaceHebMonthToNoNikud(heb_date.hm);

                var cleanHebDate =  hebDay + " " + "ב" +hebMonth + " " + hebYear;
                localStorage.setItem("hebrewDate",cleanHebDate);
                $("#hebcalDate").text("  היום יום " + cleanHebDate);
                $("#hebcalDate").show();
            }
        });
    },
    replaceHebMonthToNoNikud: function(hebMonthRaw){
        switch (hebMonthRaw) {
            case "Elul":
                hebMonthRaw = "אלול";
                break;
            case "Tishrei":
                hebMonthRaw = "תשרי";
                break;
            case "Cheshvan":
                hebMonthRaw = "חשון";
                break;
            case "Kislev":
                hebMonthRaw = "כסלו";
                break;
            case "Tevet":
                hebMonthRaw = "טבת";
                break;
            case "Sh'vat":
                hebMonthRaw = "שבט";
                break;
            case "Adar":
                hebMonthRaw = "אדר";
                break;
            case "Adar I":
                hebMonthRaw = "אדר א׳";
                break;
            case "Adar II":
                hebMonthRaw = "אדר ב׳";
                break;
            case "Nisan":
                hebMonthRaw = "ניסן";
                break;
            case "Iyyar":
                hebMonthRaw = "אייר";
                break;
            case "Sivan":
                hebMonthRaw = "סיון";
                break;
            case "Tamuz":
                hebMonthRaw = "תמוז";
                break;
            case "Av":
                hebMonthRaw = "אלול";
                break;
        }
        return hebMonthRaw;
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
                            "מנהל המוסד" + ":" + " " +    beitchabad_owner_name,
                        null,         // callback
                        'פרטי המוסד לתרומה',            // title
                        'אשר'                  // buttonName
                    );
                });
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
        $('#hello_user').css('font-size', (windowHeight * 0.04) + 'px');
        $('#hebcalDate').css('font-size', (windowHeight * 0.035) + 'px');
        $('#yom_yom_text').css('font-size', (windowHeight * 0.03) + 'px');
        if (windowHeight < 500) {
            $('#goToDonateImg').css('top','69%');
            $('#hello_user').css('margin-left','8%');
            $('#headerLogoImg').css('top', '2%');
        }
    }
}