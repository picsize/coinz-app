var DATADIR;
var downloadImage = {
    init:function(){
        var self = this;
        alert("init1");
        document.addEventListener("deviceready", self.onDeviceReady, true);
        alert("init2");
    },
    onDeviceReady: function() {
        alert("onDeviceReady");
        var self = this;
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, self.onFSSuccess, null);
    },
    onFSSuccess: function(fileSystem) {
        alert("onFSSuccess1");
        var self = this;
        fileSystem.root.getDirectory("Android/data/com.bit2be.coinzBietHatavshil",{create:true},self.gotDir,self.onError);
        alert("onFSSuccess2");
    },
    gotDir: function(d){
    alert("gotDir");
    var self = this;
    DATADIR = d;
    var reader = DATADIR.createReader();
    reader.readEntries(self.gotFiles,self.onError);
    },
    gotFiles: function(entries) {
    alert("gotFiles");
    alert("The dir has "+entries.length+" entries.");
    for (var i=0; i<entries.length; i++) {
        console.log(entries[i].name+' '+entries[i].isDirectory);
        }
    },
    onError: function(e){
    alert("ERROR");
    alert(JSON.stringify(e));
    }
}