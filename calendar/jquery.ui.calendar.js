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
                disable: "disable",
                current: "current",
                normal: "normal",
                highlight: "highlight"
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
        },

        setCurrentDate: function() {},

        setRevealMonth: function(month, year) {},

        _drawStructure: function() {},

        _isLeap: function(year) {
            return new Date(year, 1, 29).getMonth() === 1;
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