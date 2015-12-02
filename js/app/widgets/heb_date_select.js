var heb_date_select = {
    month_to_day:{
        1:{'name':'תשרי', 'dayLimit':30},
        2:{'name':'חשוון', 'dayLimit':30},
        3:{'name':'כסלו', 'dayLimit':30},
        4:{'name':'טבת', 'dayLimit':29},
        5:{'name':'שבט', 'dayLimit':30},
        6:{'name':'אדר', 'dayLimit':29},
        7:{'name':'אדר ב', 'dayLimit':30},
        8:{'name':'ניסן', 'dayLimit':30},
        9:{'name':'אייר', 'dayLimit':29},
        10:{'name':'סיוון', 'dayLimit':30},
        11:{'name':'תמוז', 'dayLimit':29},
        12:{'name':'אב', 'dayLimit':30},
        13:{'name':'אלול', 'dayLimit':29}
    },
    numberToHebDay:{
      1:'א',2:'ב',3:'ג',4:'ד',5:'ה',6:'ו',7:'ז',8:'ח',9:'ט',10:'י',
      11:'יא',12:'יב',13:'יג',14:'יד',15:'טו',16:'טז',17:'יז',18:'יח',19:'יט',20:'כ',
      21:'כא',22:'כב',23:'כג',24:'כד',25:'כה',26:'כו',27:'כז',28:'כח',29:'כט',30:'ל'
    },
    apply:function(container){
        this.populateMonth(container);
        this.populateDay(container);
        //this.changeEvent(container);
    },
    populateMonth:function(container){
        var month_select = $('.monthSelect' , container);
        $.each(this.month_to_day , function(month_num,month_data){
            var option = "<option value='" + month_num + "'>" + month_data.name + "</option>";
            month_select.append(option);
        });
        month_select.val(1);
    },
    populateDay:function(container){
        var self = this;
        var month_select = $('.monthSelect' , container);
        var current_month = parseInt(month_select.val());
        var day_select = $('.daySelect' , container);
        var month_data = this.month_to_day[current_month];
        day_select.empty();
        for (var i = 1; i <= month_data.dayLimit; i++) {
            var day_letter = self.numberToHebDay[i];
            var option = "<option value='" + i + "'>" + day_letter + "</option>";
            day_select.append(option);
        }
    },
    changeEvent:function(container){
        var self = this;
        var select = $('.monthSelect' , container);
        select.change(function(){
            self.populateDay(container);
        });
    }
}