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
    
    getListOfPhotosInSet : function(set_id,callback) {
        var _this = this;
        this.callApi('flickr.photosets.getPhotos',{photoset_id:set_id}).done(function(data) {
            var urls = [];
            for(var i in data.photoset.photo) {
                urls.push({
                    source: _this.generateSourceUrlFromImage(data.photoset.photo[i],_this.ImageSizes.MEDIUM_800),
                    page: _this.generatePageUrlFromImage(data.photoset.photo[i],data.photoset.owner)  
                });  
            }
            callback(_this.generateBBCodeLinks(urls));
        });
    },
    
    generateSourceUrlFromImage : function(photo,size) {
        // http://farm{farm-id}.staticflickr.com/{server-id}/{id}_{secret}_[mstzb].jpg
        return 'http://farm'+photo.farm+'.staticflickr.com/'+photo.server+'/'+photo.id+'_'+photo.secret+'_'+size+'.jpg';
    },
    
    generatePageUrlFromImage : function(photo,user_id) {
        // http://www.flickr.com/photos/{user-id}/{photo-id}
        return 'http://www.flickr.com/photos/'+user_id+'/'+photo.id;
    },
    
    generateBBCodeLinks : function(urls) {
        var bbcode = '';
        for(var url in urls) {
            bbcode += '[url='+urls[url].page+'][img]'+urls[url].source+'[/img][/url]\n\n';
        }
        return bbcode;
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
    },
    
    ImageSizes : {
        SMALL_SQUARE    : 's',
        LARGE_SQUARE    : 'q',
        THUMBNAIL       : 't',
        SMALL_240       : 'm',
        SMALL_320       : 'n',
        MEDIUM_500      : '-',
        MEDIUM_640      : 'z',
        MEDIUM_800      : 'c',
        LARGE           : 'b',
        ORIGINAL        : 'o'
    }
}