// document.addEventListener('scroll', function() {
//   var targetElement = document.querySelector('div#removed_sticky');
  
//   // Ensure the element exists before trying to access its properties
//   if (targetElement) {
//     var targetOffset = targetElement.getBoundingClientRect();
    
//     if (targetOffset) {
//       var targetOffsetTop = targetOffset.top + window.scrollY;
//       var targetOffsetBottom = targetOffsetTop + targetElement.offsetHeight;
      
//       var windowHeight = window.innerHeight;
//       var scrollTop = window.scrollY;

//       var applyStickyForm = document.querySelector('div#apply_sticky form');
//       var stickyInner = document.querySelector('#apply_sticky .sticky_inner');

//       if (scrollTop + windowHeight >= targetOffsetTop && scrollTop <= targetOffsetBottom) {
//         console.log("Removed from bottom");
//           // targetElement.parentNode.insertBefore(applyStickyForm, targetElement.nextSibling);
//             document.querySelector('#apply_sticky').style.display = 'none';
//       } else {
//         console.log("Add in bottom");
//         if (stickyInner) {
//             document.querySelector('#apply_sticky').style.display = 'block';
          
//           // var removedStickyForm = document.querySelector('div#removed_sticky + form');
//             // stickyInner.parentNode.insertBefore(removedStickyForm, stickyInner);
//         }
//       }
//     } else {
//       console.log('Target element offset could not be determined.');
//     }
//   } else {
//     // console.log('Target element not found.');
//   }
// });

// // Trigger scroll event on page load
// document.addEventListener('DOMContentLoaded', function() {
//   window.dispatchEvent(new Event('scroll'));
// });

