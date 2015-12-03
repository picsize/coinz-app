var pushNotify = {
	plugin:null,
	config:{
		projectid: "4234860331",
		appid : appData.appid
	},
	init:function() {
		var self = this;
		this.startPlugin(function(){
				self.bindPushEvent();
		});
	},
	bindPushEvent:function(){
		document.addEventListener('push-notification', function(event) {
               var title = event.notification.title;
               var userData = event.notification.userdata;
               if(typeof(userData) != "undefined") {
					console.warn('user data: ' + JSON.stringify(userData));
				}
               console.log('PUSH: ' + title);
				//alert(title);
				/*
				pushNotification.stopGeoPushes();
				*/
			  });
	},
	startPlugin:function(callback){
		var self = this;
		var exists  = (typeof(window.plugins)!='undefined' && typeof(window.plugins.pushNotification)!='undefined');
        console.log("exists = " + exists);
        console.log("typeof(window.plugins) = " + typeof(window.plugins));
		if (!exists){
			return false;
		} else {
		    this.plugin = cordova.require("com.pushwoosh.plugins.pushwoosh.PushNotification");
			this.plugin.onDeviceReady(this.config);
			this.plugin.getPushToken(function(token){
				if (token==''){
					self.register(function(token){
						self.sendTokenToServer(token);
						callback();
					});
				} else {
					self.sendTokenToServer(token);
					callback();
				}
			})
		}
	},
	register:function(success){
		var self = this;
		this.plugin.registerDevice(
			function(token) {
				success(token);
			},
			function(status) {
			}
		);
	},
	sendTokenToServer:function(pushwoosh_token){
		coinz.ajax('update_pushwoosh_token' , {'pushwoosh_token':pushwoosh_token});
	},
	setTags:function(){
		var self = this;
		self.tagsExist(function(exists){
			if (!exists){
				var user_id = coinz.getUserId();
				var tags = {'coinz_user_id':parseInt(user_id)};
				self.plugin.setTags( tags,
		            function(status) {
		                console.log('setTags success');
		            },
		            function(status) {
		            	console.log('setTags failed');
		            }
				);
			}
		})
	},
	tagsExist:function(callback){
		this.plugin.getTags( function(tags) {
			var user_id = coinz.getUserId();
			var exists = (user_id == tags.coinz_user_id);
			callback(exists);
		});
	}
}