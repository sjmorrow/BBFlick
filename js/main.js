$(function(){
    var api_key = "090c874c23e3c0e5b33c580e98310153";
    var flickr = new Flickr(api_key);
    
    var setTemplate = '<div data-set-id="{id}" data-action="getListOfPhotosInSet"><p>{title._content}</p></div>';
    var $setContainer = $('.set-list');
    $('#username_input').submit(function(event) {
        //TODO: Get userId from username
        flickr.getListOfSets('9325532@N07',function(sets) {
            $setContainer.html('');
            for(var set in sets) {
                //sets[set].title = sets[set].title._content; //Remove that annoying wrapper object
                $setContainer.append(nano(setTemplate,sets[set]));
            }
        });
        return false;
    });
    $('body').on('click','[data-action=getListOfPhotosInSet]',function() {
        flickr.getListOfPhotosInSet($(this).attr('data-set-id'),function(bbcode) {
            console.log(bbcode);
        });    
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