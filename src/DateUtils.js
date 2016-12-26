/***
 * Created by DannyTam
 * @Date 2016-08-07
 * @Email tanhaican@126.com
 */
(function() {
    function getDateTime(obj) {
        if(typeof obj === "string") {
            var dateStr ;
            if ( DateStaticFun.FORMAT_A_REG.test(obj) || DateStaticFun.FORMAT_B_REG.test(obj) ) {
                dateStr = obj;
            } else if(DateStaticFun.FORMAT_C_REG.test(obj)) {
                dateStr = RegExp.$1 + '-' + RegExp.$2 + '-' + RegExp.$3;
            } else {
                return -1;// 传入的不是日期格式[YYYY-MM-DD 或者 YYYY/MM/DD 或者 YYYYMMDD]的字符串
            }
            return Date.parse(dateStr);
        } else if(obj instanceof Date) {
            return obj.getTime();
        } else {
            return -2;// 传入的不是日期或者日志格式[YYYY-MM-DD 或者 YYYY/MM/DD 或者 YYYYMMDD]的字符串
        }
    }

    var DateStaticFun = {
        FORMAT_A_REG: /^([12]\d{3})-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])( (0\d|1\d|2[0-4])(:[0-5]\d(:\d{2})?)?)?$/,//正则表达式 YYYY-MM-DD
        FORMAT_B_REG: /^[12]\d{3}\/(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])( (0\d|1\d|2[0-4])(:[0-5]\d(:\d{2})?)?)?$/,//正则表达式 YYYY/MM/DD
        FORMAT_C_REG: /^[12]\d{3}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])$( (0\d|1\d|2[0-4])(:[0-5]\d(:\d{2})?)?)?/,// YYYYMMDD

        strToDate: function(dateStr) {
            return new Date(getDateTime(dateStr));
        },
        /**
         * 求两个时间的天数差（一个入参，则跟当前时间比）
         * 参数为Date或者String类型，String类型日期格式支持 [YYYY-MM-dd | YYYY/MM/DD | YYYYMMDD]
         * @returns {number}
         */
        daysBetween: function() {
            var dateOne, dateTwo,
                dayBetween, dateOneTime, dateTwoTime;

            if(arguments.length) {
                dateOne = arguments[0];
                dateTwo = arguments[1];

                if(1 === arguments.length) {
                    dateTwo = new Date();
                }
            } else {
                throw '请至少传入一个参数';
            }

            dateOneTime = getDateTime(dateOne);
            dateTwoTime = getDateTime(dateTwo);
            if(dateOneTime === -1 || dateTwoTime === -1) {
                throw '传入的不是日期格式[YYYY-MM-DD 或者 YYYY/MM/DD]的字符串';
            }
            if(dateOneTime === -2 || dateTwoTime === -2) {
                throw '传入的不是日期或者日志格式[YYYY-MM-DD 或者 YYYY/MM/DD]的字符串';
            }

            dayBetween = (dateOneTime - dateTwoTime) / 86400000;

            return Math.floor(dayBetween);
        },
        /**
         * 是否日期字符串 [YYYY-MM-dd | YYYY/MM/DD | YYYYMMDD]，可带时分秒（YYYY-MM-dd hh:mm:ss）
         * @param str [YYYY-MM-dd | YYYY/MM/DD | YYYYMMDD]
         * @returns {boolean}
         */
        isDateStr: function(str) {
            if ( DateStaticFun.FORMAT_A_REG.test(str) || DateStaticFun.FORMAT_B_REG.test(str) ||
                DateStaticFun.FORMAT_C_REG.test(str) ) {
                return true;
            } else {
                return false;
            }
        },
        isDate: function(obj) {
            return DateStaticFun.isDateStr(obj) || obj instanceof Date;
        },
        /**
         * 是否闰年
         * @param date Date类型或者日期字符串 [YYYY-MM-dd | YYYY/MM/DD | YYYYMMDD]，可带时分秒（YYYY-MM-dd hh:mm:ss）
         * @returns {boolean}
         */
        isLeapYear: function(date) {
            if(DateStaticFun.isDate(date)) {
                var year;
                if(!(date instanceof  Date)) {
                    date = DateStaticFun.strToDate(date);
                }
                year = date.getFullYear();
                return (0 === year % 4 && ((year % 100 !== 0) || (year % 400 === 0)));
            } else {
                throw '非日期字符串或者Date类型参数';
            }
        },
        //---------------------------------------------------
        // 日期格式化
        // 格式 YYYY/yyyy/YY/yy 表示年份
        // MM/M 月份
        // W/w 星期
        // dd/DD/d/D 日期
        // hh/HH/h/H 时间
        // mm/m 分钟
        // ss/SS/s/S 秒
        //---------------------------------------------------
        format: function(date, formatStr) {
            if(!DateStaticFun.isDate(date)) {
                throw '非日期字符串或者Date类型参数';
            }
            var format = /^(yyyy)?(?:-)?(mm)?(?:-)?(dd)? ?(hh)?(?::)?(mi)?(?::)?(ss)?$/i;
            if(!format.test(formatStr)) {
                throw 'format字符串有误';
            }

            var str = formatStr;
            var Week = ['日','一','二','三','四','五','六'];

            str = str.replace(/yyyy|YYYY/,this.getFullYear());
            str=str.replace(/yy|YY/,(this.getYear() % 100)>9?(this.getYear() % 100).toString():'0' + (this.getYear() % 100));

            var month = this.getMonth() + 1;
            str=str.replace(/MM/,month>9?month.toString():'0' + month);
            str=str.replace(/M/g,month);

            str=str.replace(/w|W/g,Week[this.getDay()]);

            str=str.replace(/dd|DD/,this.getDate()>9?this.getDate().toString():'0' + this.getDate());
            str=str.replace(/d|D/g,this.getDate());

            str=str.replace(/hh|HH/,this.getHours()>9?this.getHours().toString():'0' + this.getHours());
            str=str.replace(/h|H/g,this.getHours());
            str=str.replace(/mm/,this.getMinutes()>9?this.getMinutes().toString():'0' + this.getMinutes());
            str=str.replace(/m/g,this.getMinutes());

            str=str.replace(/ss|SS/,this.getSeconds()>9?this.getSeconds().toString():'0' + this.getSeconds());
            str=str.replace(/s|S/g,this.getSeconds());

            return str;
        }
    };
    var DateFun = {
        //+---------------------------------------------------
        //| 日期计算
        // q: 季度
        //+---------------------------------------------------
        dateAdd: function(strInterval, Number) {
            var dtTmp = this;
            switch (strInterval) {
                case 's' :return new Date(Date.parse(dtTmp) + (1000 * Number));
                case 'n' :return new Date(Date.parse(dtTmp) + (60000 * Number));
                case 'h' :return new Date(Date.parse(dtTmp) + (3600000 * Number));
                case 'd' :return new Date(Date.parse(dtTmp) + (86400000 * Number));
                case 'w' :return new Date(Date.parse(dtTmp) + ((86400000 * 7) * Number));
                case 'q' :return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + Number*3, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
                case 'm' :return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + Number, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
                case 'y' :return new Date((dtTmp.getFullYear() + Number), dtTmp.getMonth(), dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
            }
        },

        //+---------------------------------------------------
        //| 比较日期差 dtEnd 格式为日期型或者 有效日期格式字符串
        //+---------------------------------------------------
        dateDiff: function(strInterval, dtEnd) {
            var dtStart = this;
            if (typeof dtEnd == 'string' )//如果是字符串转换为日期型
            {
                dtEnd = strToDate(dtEnd);
            }
            switch (strInterval) {
                case 's' :return parseInt((dtEnd - dtStart) / 1000);
                case 'n' :return parseInt((dtEnd - dtStart) / 60000);
                case 'h' :return parseInt((dtEnd - dtStart) / 3600000);
                case 'd' :return parseInt((dtEnd - dtStart) / 86400000);
                case 'w' :return parseInt((dtEnd - dtStart) / (86400000 * 7));
                case 'm' :return (dtEnd.getMonth()+1)+((dtEnd.getFullYear()-dtStart.getFullYear())*12) - (dtStart.getMonth()+1);
                case 'y' :return dtEnd.getFullYear() - dtStart.getFullYear();
            }
        },

        //+---------------------------------------------------
        //| 日期输出字符串，重载了系统的toString方法
        //+---------------------------------------------------
        toString: function(isShowWeek) {
            var myDate= this;
            var str = myDate.toLocaleDateString();
            if (isShowWeek) {
                var Week = ['日','一','二','三','四','五','六'];
                str += ' 星期' + Week[myDate.getDay()];
            }
            return str;
        },


        //+---------------------------------------------------
        //| 把日期分割成数组
        //+---------------------------------------------------
        toArray: function() {
            var myDate = this;
            var myArray = Array();
            myArray[0] = myDate.getFullYear();
            myArray[1] = myDate.getMonth();
            myArray[2] = myDate.getDate();
            myArray[3] = myDate.getHours();
            myArray[4] = myDate.getMinutes();
            myArray[5] = myDate.getSeconds();
            return myArray;
        },

        //+---------------------------------------------------
        //| 取得日期数据信息
        //| 参数 interval 表示数据类型
        //| y 年 m月 d日 w星期 ww周 h时 n分 s秒
        //+---------------------------------------------------
        datePart: function(interval) {
            var myDate = this;
            var partStr='';
            var Week = ['日','一','二','三','四','五','六'];
            switch (interval)
            {
                case 'y' :partStr = myDate.getFullYear();break;
                case 'm' :partStr = myDate.getMonth()+1;break;
                case 'd' :partStr = myDate.getDate();break;
                case 'w' :partStr = Week[myDate.getDay()];break;
                case 'ww' :partStr = myDate.WeekNumOfYear();break;
                case 'h' :partStr = myDate.getHours();break;
                case 'n' :partStr = myDate.getMinutes();break;
                case 's' :partStr = myDate.getSeconds();break;
            }
            return partStr;
        },

        //+---------------------------------------------------
        //| 取得当前日期所在月的最大天数
        //+---------------------------------------------------
        maxDayOfMonth: function() {
            var myDate = this;
            var arr = myDate.toArray();
            var date1 = (new Date(arr[0],arr[1]+1,1));
            var date2 = date1.dateAdd('d',-1);
            arr = date2.toArray();

            return arr[2];
        }

    };

    var extend = function(o, n, override){
        for(var p in n) {
            if(n.hasOwnProperty(p) && (!o.hasOwnProperty(p) || override)) {
                o[p] = n[p];
            }
        }
    };
    extend(Date, DateStaticFun, true);
    extend(Date.prototype, DateFun, true);
})();
