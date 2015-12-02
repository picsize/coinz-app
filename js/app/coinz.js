var coinz = {
    serverUrl: 'http://bit2bemobilecoinzdb.co.nf/server/index.php',
    init: function () {
        var self = this;
        self.goToEvent();
        self.setFontSize();
        self.initHeader();
        self.initFooter();
        self.setDynamicHeight();
        self.showPage();
        self.selectDonation();
        self.goToDonate();
    },
    setFontSize: function () {
        var windowHeight = $(window).height();
        $('#beitChabadLabel').css('font-size', (windowHeight * 0.035) + 'px');
    },
    autoLogin: function (callback) {
        var userData = this.getUser();
        if (userData != false) {
            this.ajax('login', userData, function (response) {
                response ? coinz.setUser(response) : coinz.removeUser();
                callback();
            })
        } else {
            callback();
        }
    },
    ajax: function (action, data, callback) {
        var self = this;
        data.action = action;
        data.current_user_id = this.getUserId();
        $.ajax({
            url: self.serverUrl,
            data: data,
            success: function (response) {
                try {
                    response = JSON.parse(response);
                } catch (e) { }
                if (typeof (callback) == 'function') {
                    callback(response);
                }
            }
        })
    },
    initSpiner: function () {
        var opts = {
            lines: 11, // The number of lines to draw
            length: 8, // The length of each line
            width: 8, // The line thickness
            radius: 16, // The radius of the inner circle
            corners: 1, // Corner roundness (0..1)
            rotate: 26, // The rotation offset
            direction: 1, // 1: clockwise, -1: counterclockwise
            color: '#08588B', // #rgb or #rrggbb or array of colors
            speed: 1.1, // Rounds per second
            trail: 62, // Afterglow percentage
            shadow: true, // Whether to render a shadow
            hwaccel: false, // Whether to use hardware acceleration
            className: 'spinner', // The CSS class to assign to the spinner
            zIndex: 2e9, // The z-index (defaults to 2000000000)
            top: '50%', // Top position relative to parent
            left: '55%' // Left position relative to parent
        };
        var target = document.getElementById('spinner');
        return opts;
    },
    showPage: function () {
        $('.coinzPage').fadeIn();
    },
    hidePage: function (callback) {
        $('.coinzPage').fadeOut(300, function () {
            callback();
        });
    },
    setDynamicHeight: function () {
        $('.dynamic_height').each(function () {
            var item = $(this);
            var dynamic_height = $(window).height();
            item.siblings(':visible').each(function () {
                dynamic_height -= $(this).outerHeight(true);
            });
            item.height(dynamic_height);
        });
    },
    goTo: function (url) {
        this.hidePage(function () {
            window.location = url;
        });
    },
    goToEvent: function () {
        var self = this;
        $('.goToLink').each(function () {
            var href_str = $(this).attr('href');
            if (window.location.href.indexOf(href_str) != -1) {
                $(this).addClass('active');
            }
        });
        $('.goToLink').click(function (e) {
            e.preventDefault();
            var url = $(this).attr('href');
            self.goTo(url);
        })
    },
    initFooter: function () {
        $('#footer a').click(
            function () {
                $(this).addClass('active');
            },
            function () {
                $(this).removeClass('active');
            }
        )
    },
    initHeader: function () {
        $('#imglogoInPage').show();
        $('#header').show();
    },
    dataFromForm: function (form) {
        var return_data = {};
        var raw_data = $(form).serializeArray();
        $(raw_data).each(function () {
            return_data[this.name] = this.value;
        });
        return return_data;
    },
    getUser: function () {
        var user = localStorage.getItem("CoinzUser");
        if (typeof (user) == 'string' && user != "") {
            user = JSON.parse(user);
        } else {
            user = false;
        }
        return user;
    },
    userExists: function () {
        return this.getUser() != false;
    },
    getUserId: function () {
        var user_id = false;
        var user = this.getUser();
        if (typeof (user) == 'object') {
            user_id = user.user_id;
        }
        return user_id;
    },
    setUser: function (data) {
        if (typeof (data) != "string") {
            var user = JSON.stringify(data);
            localStorage.setItem("CoinzUser", user);
        } else {
            localStorage.setItem("CoinzUser", data);
        }
    },
    removeUser: function () {
        //localStorage.removeItem("CoinzUser");
    },
    log: function (obj) {
        var ind = "";
        if (arguments.length > 1) {
            ind = arguments[1];
        }

        if (typeof obj == "undefined" || obj == null) {
            console.log("<null>");
            return;
        }

        if (typeof obj != "object") {
            console.log(obj);
            return;
        }

        for (var key in obj) {
            if (typeof obj[key] == "object") {
                console.log(ind + key + "={");
                logObject(obj[key], ind + "  ");
                console.log(ind + "}");
            }
            else {
                console.log(ind + key + "=" + obj[key]);
            }
        }
    },
    selectDonation: function () {
        $('#moneyType').change(function () {
            localStorage.setItem('lastDonation', $('#moneyType option:selected').attr('data-goToPage'));
            window.location.href = $('#moneyType option:selected').attr('data-goToPage');
        });
    },
    goToDonate: function () {
        $('.donate').click(function (e) {
            e.preventDefault();
            if (localStorage.getItem('lastDonation') == null) {
                window.location.href = 'donate.html';
            } else {
                window.location.href = localStorage.getItem('lastDonation');
            }
        });
    }
}