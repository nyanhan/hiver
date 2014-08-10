(function(window, $, undefined){
    "use strict";

    $.widget("ui.calendar", {
        options: {
            def_date: '',
            current_date: '',
            start_date: '',
            end_date: '',
            disable_list: [],
            highlight_list: [],
            classNames: {
                disable: "dis",
                current: "current",
                normal: "normal",
                highlight: "p"
            },
            select: function(/*date*/) {}
        },
        _create: function() {
            var self = this,
                op = self.options;

            op.def_date = self._formateDateString(op.def_date);

            if (!op.def_date) {
                op.def_date = self.date2String(new Date());
            }

            op.current_date = op.def_date;

            self._drawStructure(op.current_date);
        },

        _init: function() {

        },

        _toHtml: function(dateObjs) {
            $.each(dateObjs, function(i, item){

            });
        },

        setCurrentDate: function(date) {

            var dateString = this.date2String(date);

            this.options.current_date = dateString;
            this._drawStructure(dateString);
        },

        setRevealMonth: function(month, year) {},

        _drawStructure: function(date, year) {

            var month, 
                dateInMonth = [],
                startDay, datesOfMonth,
                i, t;

            if (year) {
                month = date;
            } else {
                date = date.split("-");

                year = date[0];
                month = date[1];
            }

            startDay = new Date(year, month - 1, 1).getDay();
            datesOfMonth = new Date(year, month - 1, 0).getDate();

            for (i = 1 - startDay, t = 42 + i; i <= t; i++) {
                dateInMonth.push(this._date2Obj(year, month, i, datesOfMonth));
            }

            this._toHtml(dateInMonth);

            
        },

        _date2Obj: function(y, m, d, datesOfMonth) {

            var self      = this;
            var classHash = self.options.classNames;
            var date      = new Date(y, m - 1, d);
            var ds        = self.date2String(date);
            var realDate  = date.getDate();
            var status    = [];

            if (self.options.start_date && ds < self.options.start_date) {
                status.push(classHash.disable);
            } else if (self.options.end_date && ds > self.options.end_date) {
                status.push(classHash.disable);
            }

            if ($.inArray(ds, self.options.disable_list) >= 0) {
                status.push(classHash.disable);
            }

            if (d > datesOfMonth || d < 1) {
                status.push(classHash.disable);
            }

            if (ds === self.options.current_date) {
                status.push(classHash.current);
            }

            if ($.inArray(ds, self.options.highlight_list) >= 0) {
                status.push(classHash.highlight);
            }


            return {
                n: realDate,
                cls: status.join(" ")
            };
        },

        _formateDateString: function(str){
            var temp, tempDate;

            if (typeof str === "string") {
                temp = str.match(/(\d{4})\-(\d{1,2})\-(\d{1,2})/);

                if (temp) {
                    tempDate = new Date(parseInt(temp[1], 10), parseInt(temp[2], 10) - 1, parseInt(temp[3], 10));

                    if (tempDate.getFullYear() === parseInt(temp[1], 10) &&
                        tempDate.getMonth() === parseInt(temp[2], 10) - 1 &&
                        tempDate.getDate() === parseInt(temp[3], 10)) {
                        return this.date2String(tempDate);
                    }
                }
            }

            return null;
        },

        date2String: function(date) {
            var y = date.getFullYear();
            var m = date.getMonth() + 1;
            var d = date.getDate();

            return y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d);
        }

    });


})(this, jQuery);