function Flickr(api_key){this.api_key = api_key;};
Flickr.prototype = {
    api_url : "http://api.flickr.com/services/rest/?jsoncallback=?",
    
    getListOfSets : function(user_id) {
        this.callApi('flickr.photosets.getList',{user_id:user_id}).done(function(data){
            for(var i in data.photosets.photoset) {
                $('body').append('<button data-action="getListOfPhotosInSet" data-set-id="'+data.photosets.photoset[i].id+'">'+data.photosets.photoset[i].title._content+'</button>');
            }
        });
    },
    
    getListOfPhotosInSet : function(set_id) {
        this.callApi('flickr.photosets.getPhotos',{photoset_id:set_id}).done(function(data) {
            for(var i in data.photoset.photo) {
                console.log(data.photoset.photo[i].title);   
            }
        });
    },
    
    callApi : function(flickr_method,args,http_method,format) {
        format = format || "json";
        http_method = http_method || "GET";
        
        return $.ajax({
                    url : this.api_url,
                    type : http_method,
                    data : $.extend(args,{method:flickr_method,api_key:this.api_key,format:format}),
                    dataType : 'jsonp'
                });
    }
}