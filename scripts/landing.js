var animatePoints = function() {
           
    var points = document.getElementsByClassName('point');
    
    var revealPoint = function(index) {
        points[index].style.opacity = 1;
        points[index].style.transform = "scale(1) translateY(0)";
        points[index].style.msTransform = "scaleX(1) translateY(0)";
        points[index].styleWebkitTransform = "scaleX(1) translateY(0)";
    }
                
    for (var i = 0; i < points.length; i++) {
                    revealPoint(i);
    }
};