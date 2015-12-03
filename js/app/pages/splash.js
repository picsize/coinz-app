var splashPage = {
    container:function(){
        return $('#splash');
    },
    setHeight:function(){
        var window_height = $(window).height();
        this.container().height(window_height);
    },
    data:{
        date:{},
        heb_date:{}
    },
    init:function(){
        var self = this;
        
        self.setHeight();
        alert('after setHeight');
        self.offlineCheck();
        alert('after offlineCheck');
        self.setDate(function(){
            self.setHebDate(function(){
                setTimeout(function(){
                    //pushNotify.init();
                    self.redirect();
                }, 1000);
            });
        });
        alert('after setDate');
    },
    offlineCheck: function(){
        window.offLineHandler = function(){
            var title1 =  'No Internet Connection';
            var msg1 = 'This app requires a stable internet connection. Please close the app, connect and open the app again.';
            var btnLabel1 = 'OK';
            navigator.notification.alert(
                msg1,
                null,         // callback
                title1,            // title
                btnLabel1                  // buttonName
            );
        }
    },
    getHebDate:function(callback){
        var self = this;
        var dData = self.data.date;

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

        $.ajax({
            type: "GET",
            url: "http://www.hebcal.com/converter/",
            dataType:'json',
            data: "cfg=json"+"&gy="+dData.year+"&gm="+dData.month+"&gd="+dData.day+"&g2h=1",
            success: function(heb_date){
                localStorage.setItem("hebrewDate", heb_date.hebrew);
                callback(heb_date);
            }
        });
    },
    setHebDate:function(callback){
        var self = this;
        self.getHebDate(function(heb_date){
            var hebrew = heb_date.hebrew;
            var hebrewArray = hebrew.split(" ");
            var hebrewDay = hebrewArray[0];
            var hebrewMonthStart = hebrewArray[1];
            var hebrewMonthEnd = hebrewArray[2];
            if (hebrewMonthEnd.length > 2){
                hebrewMonthEnd = "none";
            }
            hebrewDay = hebrewDay.replace(/״/g, '');
            hebrewMonthEnd = hebrewMonthEnd.replace(' \' ','');
            heb_date.texts = {hebrewDay:hebrewDay,hebrewMonthStart:hebrewMonthStart,hebrewMonthEnd:hebrewMonthEnd};
            self.data.heb_date = heb_date;
            callback();
        })
    },
    setDate:function(callback){
        var self = this;
        //Get hebrew date today
        var currentTime = new Date();
        this.data.date.month = currentTime.getMonth() + 1;
        this.data.date.day = currentTime.getDate();
        this.data.date.year = currentTime.getFullYear();
        callback();
    },
    redirect:function(){
        setTimeout(function(){
            var user_exists = typeof(localStorage.getItem("CoinzUser")) == "string";
            //var page_url = (user_exists ? "main.html" : "register.html");
            var page_url = (user_exists ? "main.html" : "main.html");
            coinz.goTo(page_url);
        }, 0);
    }
};