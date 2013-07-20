$(function(){
    var api_key = "090c874c23e3c0e5b33c580e98310153";
    var flickr = new Flickr(api_key);
    
    var setTemplate = '<div data-set-id="{id}" data-action="getListOfPhotosInSet" class="set"><p>{title._content}</p><div class="thumbs"></div></div>';
    var $setContainer = $('.set-list');
    $('#username_input').submit(function(event) {
        //TODO: Get userId from username
        flickr.getUserId($(this).find('input').val(),function(user_id) {
            flickr.getListOfSets(user_id,function(sets) {
                $setContainer.html('');
                for(var set in sets) {
                    (function(set){
                        flickr.getListOfPhotosInSet(set.id,function(urls) {
                        var $set = $(nano(setTemplate,set)).appendTo($setContainer);
                        var i=0;
                        for(var url in urls) {
                            if(i==5) {i=0;break;}
                            $set.find('.thumbs').append('<img src="'+urls[url].thumb+'" />')
                            i++;
                        }
                    });
                    })(sets[set]);
                }
            });
        });
        
        return false;
    });
    $('body').on('click','[data-action=getListOfPhotosInSet]',function() {
        flickr.getListOfPhotosInSet($(this).attr('data-set-id'),function(urls) {
            $('textarea.code-text').html(flickr.generateBBCodeLinks(urls));
            $('span.blur-wrapper').addClass('enabled');
            $('.code-window').addClass('enabled');
        });    
    });
    $('span.blur-wrapper, .close').on('click',function() {
       $('span.blur-wrapper').removeClass('enabled'); 
       $('.code-window').removeClass('enabled');
    });
    $('.code-window').on('click',function(event) {
        event.stopPropagation();
        event.preventDefault();
        return false;
    });
});




/* Nano Templates (Tomasz Mazur, Jacek Becela) */

function nano(template, data) {
  return template.replace(/\{([\w\.]*)\}/g, function(str, key) {
    var keys = key.split("."), v = data[keys.shift()];
    for (var i = 0, l = keys.length; i < l; i++) v = v[keys[i]];
    return (typeof v !== "undefined" && v !== null) ? v : "";
  });
}