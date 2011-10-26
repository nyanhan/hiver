(function(window) {

if(typeof window.Main === "undefined"){
    window.Main = {};
}

var Workspace = Backbone.Router.extend({
    
    routes: {
        "passenger": "passenger",
        "passenger/:id": "passenger",
        "linkman": "linkman",
        "linkman/:id": "linkman"
    },
    
    parts: {
        passenger: null,
        pass_list: null
    },
  
    initialize: function() { },
  
    passenger: function(id) {
        var M = Main.model, 
            V = Main.view,
            p = this.parts;
        
        if (!id) {
            console.log(0)
            this.buildPassList(new V.pass_list());
            
            if (p.passenger) {
                this.clearPassenger();
            }
            
        } else if (id === "--") {
            console.log(1)
            if (!p.pass_list) {
                this.buildPassList(new V.pass_list());
            }
            
            this.buildPassenger(new V.passenger());
            
        } else{
            console.log(2)
            if (!p.pass_list) {
                this.buildPassList(new V.pass_list());
            }
            
            this.buildPassenger(new V.passenger());
            
        }
    },

    linkman: function(id) {
        
        if (!id) {
            
        } else if (id === "--") {
            if (!p.pass_list) {
                this.buildPassList(new V.pass_list());
            }
            
            this.buildPassenger(new V.passenger());
        } else{
            
        }
    },
  
    link: function(id, name) {
        this.navigate([name, id].join("/"), true);
    },
    
    buildPassenger: function(view) {
        var self = this;
        $.when(view.load()).done(function(){
            view.render({});
            self.parts.passenger = view;
        });
    },
    
    buildPassList: function(view) {
        var self = this;
        $.when(view.load()).done(function(){
            view.render({});
            self.parts.pass_list = view;
        });
    },
    
    clearPassenger: function(){
        var ps = this.parts.passenger;
        
        if(!ps){
            return;
        }
        
        ps.clear();
        ps = null;
    },
    
    clearPassList: function(){
        var pl = this.parts.pass_list;
        
        if(!pl){
            return;
        }
        
        pl.clear();
        pl = null;
    }

});

/* main */
Main.controller = new Workspace();
Backbone.history.start(/*{pushState: true}*/);

})(this);