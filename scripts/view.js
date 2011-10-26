(function(window) {
    
if(typeof window.Main === "undefined"){
    window.Main = {};
}

Main = window.Main;

Main.view = {
    templates: {}
};

var add_container = $("#add_new_user"),
    list_container = $("#content_list");
    
Main.view.Base = Backbone.View.extend({
    
    inCache: function(){
        return !!Main.view.templates[this.url];
    },
    
    loaded: function(){
        return !!this.template;
    },
    
    load: function(){
        var df = $.Deferred(),
            self = this;
        
        if (self.inCache()) {
            self.template = Main.view.templates[self.url];
            return df.resolve();
        } else {
            $.get(self.url, function(txt){
                Main.view.templates[self.url] = txt;
                self.template = txt;
                df.resolve();
            });
            
            return df.promise();
        }
    }
    
});

Main.view.passenger = Main.view.Base.extend({
    
    el: add_container,
    
    url: "templates/passenger_new.html",
    
    events: {

    },
    
    render: function(model){
        this.el.html(_.template(this.template, model));
        return this;
    },
    
    clear: function() {
        this.el.html("");
    }
    
});

Main.view.pass_list = Main.view.Base.extend({
    
    el: list_container,
    
    url: "templates/passenger_list.html",
    
    render: function(model){
        this.el.html(_.template(this.template, model));
        return this;
    },
     
    clear: function() {
        this.el.html("");
    }
});

Main.view.linkman = Main.view.Base.extend({
    el: add_container
});

Main.view.link_list = Main.view.Base.extend({
    el: list_container
});

})(this);