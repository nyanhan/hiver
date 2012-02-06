var a = "/bbb/*/ccc";
var obj = {
    "bbb" : [
        1,
        2,
        {
            "ccc": 2
        }
    ]
};

function walk(root, path, func){
    var arr = a.split("/"),
        item, temp, tl,
        i = 0, j = 0,
        group = [ {v: root, c: null} ];

    for(var len = arr.length; i < len; i++){
        item = arr[i];

        if(item === ""){ continue; }
        
        if(item === "*" ){
            tl = group;
            group = [];

            j = 0;

            for (var l = tl.length; j < l; j++) {
                temp = tl[j].v;

                for(var k in temp){
                    if(temp.hasOwnProperty(k)){
                        group.push({ v: temp[k], c: temp });
                    }
                }

            }
        
        } else {
            for (j = 0; j < group.length; j++) {

                temp = group[j];

                if (typeof temp.v !== "object") {
                    group.splice(j, 1);
                    j--;
                    continue;
                }

                temp.c = temp.v;
                temp.v = temp.v[item];
            }
        }
    }
    
    i = 0; len = group.length;

    for (; i < len; i++) {
        func.call(group[i], group[i].v, group[i].c);
    }

    arr = item = tl = group = null;
}


walk(obj, a, function(data, context){
    console.log(data, context);
});
