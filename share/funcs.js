
function A() {
    B(function() {
        C(function() {
            D(function() {
                
            });
        });
    });
}

A();




async.waterfall([
    function A(callback){
        callback(null, 'one', 'two');
    },
    function B(arg1, arg2, callback){
        callback(null, 'three');
    },
    function C(arg1, callback){
        callback(null, 'done');
    }
], function (err, result) {
   // result now equals 'done'    
});
