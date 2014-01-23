(function ($) {
    var peeps;
    var contacts = [
  {
    "name":"bob barker",
    "phone":"999-or-1999",
    "email":"bob@WOF.com",
    "image":"img/bob.jpg",
    "notes":"met him at tanning salon" 
  },
  {
    "name":"mcGyver",
    "phone":"911-911-2222",
    "email":"mc@gyver.com",
    "image":"img/mc.jpg",
    "notes":"Met him through Barack. Very handy!"

  },
  {
    "name":"Barack Obama",
    "phone":"202-456-1111",
    "email":"obama@whitehouse.gov",
    "image":"img/obama.jpg",
    "notes":" what is there to say about this man? Love him or hate him, he is the president of the United States."
  },
  {
    "name":"sal",
    "phone":"123-456-7890",
    "email":"sal@khan.edu",
    "image":"img/sal.jpg",
    "notes":""
  },
  {
    "name":"Sir Tony",
    "phone":"900-mix-alot",
    "email":"via@1992.com",
    "image":"img/mix.jpg",
    "notes":"He don't lie"
  },
  {
    "name":"Walter",
    "phone":"05-31-1819",
    "email":"O@captain.com",
    "image":"img/walt.jpg",
    "notes":"So Good-bye my Fancy."
  }
];
//                   __    __                   ____        __  _         
//    __ _  ___  ___/ /__ / /  ____   _______  / / /__ ____/ /_(_)__  ___ 
//   /  ' \/ _ \/ _  / -_) /  /___/  / __/ _ \/ / / -_) __/ __/ / _ \/ _ \
//  /_/_/_/\___/\_,_/\__/_/          \__/\___/_/_/\__/\__/\__/_/\___/_//_/
//                                                                                                                                                  

    var Contact = Backbone.Model.extend({
        defaults:{
            name:"",
            phone:"",
            email:"",
            image:"img/pic.jpg",
            notes:""

        }
    });

    var Contacts = Backbone.Collection.extend({
       model:Contact
    });
//                                                     _           
//  ___  ___  ___   ___  ___ _______ ___  ___    _  __(_)__ _    __
// / _ \/ _ \/ -_) / _ \/ -_) __(_-</ _ \/ _ \  | |/ / / -_) |/|/ /
// \___/_//_/\__/ / .__/\__/_/ /___/\___/_//_/  |___/_/\__/|__,__/ 
//               /_/                                               
    var ContactView = Backbone.View.extend({
        tagName:"div",
        className:"contactContainer ",
        template:$("#contactTemplate").html(),
        events: {
                "click .delete": "deleteContact",
                "click .edit": "openForm"
        },
        render:function () {
            var tmpl = _.template(this.template); //tmpl is a function that takes a JSON object and returns html

            this.$el.html(tmpl(this.model.toJSON())); //this.el is what we defined in tagName. use $el to get access to jQuery html() function
            
            return this;
        },
        deleteContact:function () {
            // removes letter bar if nothing left
            if($(this.el).prev().is('p')){
                if($(this.el).next().is('p') || $(this.el).next().length == 0){
                    $(this.el).prev('p').remove();
                }
            }
            //Delete model
            this.model.destroy();
            //Delete view
            this.remove();
        },
        openForm:function () {
            var that = this
            $('input').val('')
            $('#lightbox, #editContact').fadeIn('fast');
            $('#editOk').on('click', function() {
                that.editContact(this);
            });
        },
        editContact:function (argument) {
            event.preventDefault();
            $('#lightbox, #editContact').fadeOut('fast');
            // gets all form data
            var formData = {};
            $("#editContact div").children("input").each(function(i, el){
                if ($(el).val() !== "") {
                    formData[el.id] = $(el).val();
                }
            });
            console.log(formData)
            this.model.set(formData)
            // localStorage.setItem("contacts", JSON.stringify(contacts));
            contactsView.sortPeople();

        }
    });
//               _             _           
//   __ _  ___ _(_)__    _  __(_)__ _    __
//  /  ' \/ _ `/ / _ \  | |/ / / -_) |/|/ /
// /_/_/_/\_,_/_/_//_/  |___/_/\__/|__,__/ 
// it's a big one!                                        
    var ContactsView = Backbone.View.extend({
        el:$("#contacts"),
        events:{
            "click #ok":"addContact",
            "click #cancel":"cancel"
        },
        initialize:function(){
            // checks if localStorage data exists
            if(localStorage.getItem("contacts") === null){
                this.collection = new Contacts(contacts);
            }else{
                var peep = localStorage.getItem("contacts");
                contacts = eval(peep);
                this.collection = new Contacts(contacts);
            }
            this.sortPeople();
            // listens for contacts and renders it.. or removes it
            // from collection
            this.collection.on("add", this.sortPeople, this);
            this.collection.on("remove", this.removeContact, this);
            // listener for add button. not worth new view. 
            $('#add').on('click', function () {
                $('input').val('')
                $('#lightbox, #addContact').fadeIn('fast');
            });
        },
        sortPeople: function () {
            var that = this;
            // this.collection = new Contacts(contacts);
            var people = this.collection.models;
            var compare = function(a, b) {
                // this function will compare two people objects.
                return a.attributes.name.localeCompare(b.attributes.name);
            };
            // people sorted alphabetically by name.
            people.sort(compare);
            var letters = '', groups = {};
            // creates the categories sorted by letter
            for (var i = 0, len = people.length; i < len; i++) {
                // get the first letter
                var letterKey = people[i].attributes.name.charAt(0).toLowerCase();
                if (letters.indexOf(letterKey) === -1) {
                    letters += letterKey;
                    groups[letterKey] = [people[i]];// index the people by unique letters.
                } else {
                if(groups[letterKey] === undefined){
                    groups[letterKey] = [];
                }
                   groups[letterKey].push(people[i]);// add to the existing list.
                };
          };
          // clears the board for e re-render
          $('.contactContainer').remove();
          $('.letter').remove();
          $.each(groups, function (key, value) {
             $('#contacts').append('<p class="letter">'+ key +'</p>');
                that.render(value);
            });
        },
        render: function(value){
            var that = this;
            _.each(value, function(item){
                that.renderContact(item);
            }, this);
        },
        // fires for every sorted model
        renderContact:function(item){
            var contactView = new ContactView({
                model: item
            });
            this.$el.append(contactView.render().el);
            
        },
        // fires on add model "ok" button
        addContact: function(event){
            event.preventDefault();
            $('#lightbox, #addContact').fadeOut('fast');
            var formData = {};
            // select all inputs of form
            $("#addContact div").children("input").each(function(i, el){
                if ($(el).val() !== "") {
                    formData[el.id] = $(el).val();
                }
            });
            // put in  object
            contacts.push(formData);
            // add to our collection
            this.collection.add(new Contact(formData));
            localStorage.setItem("contacts", JSON.stringify(contacts));
        },
        // fires on any remove event
        removeContact: function(removedContact){
            // whenever something is removed this fires
            var removedContactData = removedContact.attributes;
            // sorts through attr. and removes defaults
            _.each(removedContactData, function(val, key){
                if(removedContactData[key] === removedContact.defaults[key]){
                    delete removedContactData[key];
                }
            });
            // this removes the object
            _.each(contacts, function(contact){
                if(_.isEqual(contact, removedContactData)){
                    contacts.splice(_.indexOf(contacts, contact), 1);
                }
            });
            localStorage.setItem("contacts", JSON.stringify(contacts));
        },
        // fires on "cancel" click in pop up
        cancel:function () {
            $('#lightbox, #addContact').fadeOut('fast');
        }
    });


    // kick it off
    var contactsView = new ContactsView();

})(jQuery);


