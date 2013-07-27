function Flickr(api_key){this.api_key = api_key;};
Flickr.prototype = {
    //I dont understand it... But this website told me to add the jsoncallback arg, and it worked - http://blog.michaelhamrah.com/2010/02/using-flickr-and-jquery-to-learn-jsonp/
    api_url : "http://api.flickr.com/services/rest/?jsoncallback=?",
    currentUser : '',
    
    getUserId : function(query,callback) {
        this.callApi('flickr.people.findByUsername',{username:query}).done(function(data) {
            currentUser = data.user.id;
            callback(data.user.id);
        });
    },
    
    getListOfSets : function(user_id,callback) {
        this.callApi('flickr.photosets.getList',{user_id:user_id}).done(function(data){
            callback(data.photosets.photoset);
        });
    },
    
    getListOfPhotosInSet : function(set_id,callback) {
        var _this = this;
        this.callApi('flickr.photosets.getPhotos',{photoset_id:set_id}).done(function(data) {
            callback(data.photoset.photo);
        });
    },
    
    getUrlsFromPhotos : function(photos,size) {
        var urls = [];
        for(var i in photos) {
            urls.push({
                source: this.generateSourceUrlFromImage(photos[i],this.ImageSizes[size]),
                page: this.generatePageUrlFromImage(photos[i],currentUser),
                thumb: this.generateSourceUrlFromImage(photos[i],this.ImageSizes.SMALL_240)
            });  
        }
        return urls;
    },
    
    generateSourceUrlFromImage : function(photo,size) {
        // http://farm{farm-id}.staticflickr.com/{server-id}/{id}_{secret}_[mstzb].jpg
        return 'http://farm'+photo.farm+'.staticflickr.com/'+photo.server+'/'+photo.id+'_'+photo.secret+'_'+size+'.jpg';
    },
    
    generatePageUrlFromImage : function(photo,user_id) {
        // http://www.flickr.com/photos/{user-id}/{photo-id}
        return 'http://www.flickr.com/photos/'+user_id+'/'+photo.id;
    },
    
    linkGenerators : {
        bbcode : function(urls) {
            var bbcode = '';
            for(var url in urls) {
                bbcode += '[url='+urls[url].page+'][img]'+urls[url].source+'[/img][/url]\n\n';
            }
            return bbcode;
        },
        html : function(urls) {
            var html = '';
            for(var url in urls) {
                html += '<a href="'+urls[url].page+'"><img src="'+urls[url].source+'" /></a>\n\n';
            }
            return html;
        },
        direct : function(urls) {
            var links = '';
            for(var url in urls) {
                links += urls[url].source+'\n\n';
            }
            return links;
        }
    },
    generateLinks : function(urls,type) {
        return this.linkGenerators[type](urls);
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
};


