(function(window){

	if (typeof QNR === "undefined") {
		window.QNR = {};
	}

	var QNR = window.QNR;

	QNR.mix_up = function(){
		this._ = {};
	};

	QNR.mix_up.prototype = {
		unpack: function(root){
			var s = this;

			s._ = root;

			var ml = s.mixedList(),
				sl = s.staticList(),
				power = s.powerList(),
				seed, size = s._ml.length,
				temp;

			for ( var i = 0; i < size; i += 10) {

				var n = size - i - 1;

				if (n > 12){ n = 12; }

				seed = (Math.abs(s.mxl(sl[i])) - 1) % power[n] + 1;

				while (seed > 1){

					if (seed === 2) {

						temp = ml[i+n];

						ml[i+n] = ml[i+n-1];

						ml[i+n-1] = temp;

						break;

					} else if (seed > 2) {

						for ( var j = 0, pos = 0; j <= n; j++){
							if (power[j] >= seed) { pos = j; break; }
						}

						var left = n - pos;

						if (power[pos] === seed) {

							s.revert(ml, i + left, i + n);
							break;

						} else {

							var r = Math.floor(seed / power[pos - 1]) + left;

							seed %= power[pos - 1];

							if (seed === 0){ r--; }

							temp = ml[i + r];

							for ( j = i + r; j > i + left; j--){ ml[j] = ml[j - 1]; }
								
							ml[i + left] = temp;

							if (seed === 0){ s.revert(ml, i + left + 1, i + n); }
								
						}
					}
				}

				i++;
			}

			s.fixPrice();
			return s.makeUp();
			
		},
		fixPrice: function(){
			var d, one, s = this,
				ml = s._ml,
				sl = s._sl;

			for ( var i = 0; i < ml.length; i++) {
				
				d = s.delta(ml[i]);

				one = sl[i];

				for (var j = 0, len = one.length; j < len; j++) {
					one[j].pr = (parseFloat(one[j].pr) - d).toString();
				}

			}
		},
		makeUp: function(){
			var ml = this._ml,	
				sl = this._sl,
				len = ml.length,
				returnResult = {};

			for (var i = 0; i < len; i++) {
				returnResult[ml[i]] = sl[i];
			}

			return returnResult;
		},
		mxl: function(context){
			// order config
			return context[0].mxl;
		},
		delta: function(sn){
			// price config
			var f = sn.split("~")[0].split("/")[0];

			return (parseInt(f.substr(0, 2) + f.substr(f.length - 1), 36) + parseInt("0" + f.substr(2, f.length - 3), 10) * 36 * 36 * 36) % 97;
		},
		revert: function(list, from, to){
			var temp;

			while (from < to) {

				temp = list[from];

				list[from ++] = list[to];

				list[to --] = temp;

			}
		},
		staticList: function(){
			var data = this._,
				ml = this._ml,
				sl = [];

			for ( var p = 0, l = ml.length; p < l; p++) {
				sl[sl.length] = data[ml[p]];
			}

			this._sl = sl;

			return sl;
		},
		mixedList: function(){
			var data = this._,
				ml = [];

			for (var k in data){
				if (data.hasOwnProperty(k)) { ml[ml.length] = k; }
			}

			this._ml = ml.sort();

			return ml;
		},
		powerList: function(){
			var power = [1],
				ml = this._ml;
			
			for ( var p = 0, l = ml.length; p < l; p++) {
				power[p + 1] = power[p] * (p + 2);
			}

			return power;
		}
	};

})(this);
