$(function(){
    var api_key = "090c874c23e3c0e5b33c580e98310153";
    var flickr = new Flickr(api_key);
    
    $('[data-action=getListOfSets]').click(function() {
        flickr.getListOfSets('9325532@N07');    
    });
    $('body').on('click','[data-action=getListOfPhotosInSet]',function() {
        flickr.getListOfPhotosInSet($(this).attr('data-set-id'),function(bbcode) {
            console.log(bbcode);
        });    
    });
});
