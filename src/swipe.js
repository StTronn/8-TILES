var xDown = null;
var yDown = null;

export function getTouches(evt) {
  return (
    evt.touches || evt.originalEvent.touches // browser API
  ); // jQuery
}

export function handleTouchStart(evt) {
  const firstTouch = getTouches(evt)[0];
  xDown = firstTouch.clientX;
  yDown = firstTouch.clientY;
}

export function handleTouchMove(evt) {
  if (!xDown || !yDown) {
    return 0;
  }

  var xUp = evt.touches[0].clientX;
  var yUp = evt.touches[0].clientY;

  var xDiff = xDown - xUp;
  var yDiff = yDown - yUp;
  let val = 0;
  if (Math.abs(xDiff) > Math.abs(yDiff)) {
    /*most significant*/
    if (xDiff > 0) {
      /* left swipe */
      val = 37;
    } else {
      /* right swipe */
      val = 39;
    }
  } else {
    if (yDiff > 0) {
      /* up swipe */
      val = 38;
    } else {
      val = 40;
      /* down swipe */
    }
  }
  /* reset values */
  xDown = null;
  yDown = null;
  return val;
}
