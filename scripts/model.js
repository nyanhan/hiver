(function(window) {
    
if(typeof window.Main === "undefined"){
    window.Main = {};
}

Main = window.Main;

Main.model = {};

Main.model.passenger = Backbone.Model.extend({
    
    initialize: function() {
        this.bind("change", _.bind(this.change, this));
    },

    change: function(model, name){

    },

    loaded: function(){

    }

});

Main.model.pass_list = Backbone.Collection.extend({
    
});

Main.model.linkman = Backbone.Model.extend({
    
});

Main.model.link_list = Backbone.Collection.extend({
    
});

})(this);