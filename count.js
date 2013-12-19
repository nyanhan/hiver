//count the 1 in a bit number

function cal(n){
	var i = 0;
	while(n){
		n &= n - 1;
		i ++;
	}
	return i;
}

function cal(n){
	var i = 0;
	do{
		if(n & 1) {
			i ++;
		}
		n = n >> 1;	
	} while (n);
	return i;
}
