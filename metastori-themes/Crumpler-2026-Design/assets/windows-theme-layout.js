$(document).ready(function(){

  var z_index = 1;

    // $('.main_item_draggable').draggable({
    //     containment: ".windows_layout_main_relative",
    //     cursor: "grab",
    //     cursorAt: { top: 50, left: 50 },
    //     start: function(event, ui) {
    //         $(this).css('transform', 'none');
    //     }
    // });

 let isDragging = false;
let startX, startY;

// Ensure position is absolute and keep initial position
$('.main_item_draggable').each(function () {
    let $this = $(this);
    let offset = $this.offset(); // Get the current position in the document

    // Set absolute positioning to prevent shifting
    $this.css({
        position: 'absolute',
        top: offset.top + 'px',
        left: offset.left + 'px',
        margin: 0, // Remove any margins that might cause shifts
        transform: "none",
        transition: "unset"// Ensure no transform affects position
    });
});

$('.main_item_draggable')
    .draggable({
        containment: ".windows_layout_main_relative",
        cursor: "grab",
        cursorAt: { top: 50, left: 50 },
        start: function (event, ui) {
            isDragging = true;
            startX = event.pageX;
            startY = event.pageY;

            // Prevent shift by locking position
            $(this).css({
                top: ui.position.top + "px",
                left: ui.position.left + "px"
            });
        },
        stop: function () {
            setTimeout(() => { isDragging = false; }, 100);
        }
    })
    .on('mousedown', function (event) {
        startX = event.pageX;
        startY = event.pageY;
    })
    .on('click', function (e) {
        if (isDragging) {
            e.stopImmediatePropagation();
            return false;
        }
    });

    function paint() {
        const canvas = document.getElementById("drawingCanvas");
        const ctx = canvas.getContext("2d");
    
        let drawing = false;
    
        // Function to get correct coordinates for both mouse and touch events
        function getPosition(e) {
            const rect = canvas.getBoundingClientRect();
            return {
                x: (e.touches ? e.touches[0].clientX : e.clientX) - rect.left,
                y: (e.touches ? e.touches[0].clientY : e.clientY) - rect.top
            };
        }
    
        // Start drawing
        function startDrawing(e) {
            e.preventDefault(); // Prevent scrolling on touch
            drawing = true;
            const pos = getPosition(e);
            ctx.beginPath();
            ctx.moveTo(pos.x, pos.y);
        }
    
        // Draw as the user moves the cursor/finger
        function draw(e) {
            if (!drawing) return;
            e.preventDefault();
            const pos = getPosition(e);
            ctx.lineTo(pos.x, pos.y);
            ctx.stroke();
        }
    
        // Stop drawing
        function stopDrawing() {
            drawing = false;
            ctx.closePath();
        }
    
        // Mouse Events
        canvas.addEventListener("mousedown", startDrawing);
        canvas.addEventListener("mousemove", draw);
        canvas.addEventListener("mouseup", stopDrawing);
        canvas.addEventListener("mouseleave", stopDrawing);
    
        // Touch Events (for mobile)
        canvas.addEventListener("touchstart", startDrawing);
        canvas.addEventListener("touchmove", draw);
        canvas.addEventListener("touchend", stopDrawing);
        canvas.addEventListener("touchcancel", stopDrawing);
    
        // Set up pen styles
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.strokeStyle = "black";
    }
    function mobilePaint(){
        const canvas = document.getElementById("drawingCanvas");
        const ctx = canvas.getContext("2d");

        let drawing = false;

        // Fix canvas resolution for mobile
        function resizeCanvas() {
            const rect = canvas.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;

            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;

            ctx.scale(dpr, dpr);
        }

        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);

        function getPosition(e) {
            const rect = canvas.getBoundingClientRect();
            let clientX, clientY;

            if (e.touches) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
            } else {
            clientX = e.clientX;
            clientY = e.clientY;
            }

            return {
            x: clientX - rect.left,
            y: clientY - rect.top
            };
        }

        function startDrawing(e) {
            e.preventDefault();
            drawing = true;
            const pos = getPosition(e);
            ctx.beginPath();
            ctx.moveTo(pos.x, pos.y);
        }

        function draw(e) {
            if (!drawing) return;
            e.preventDefault();
            const pos = getPosition(e);
            ctx.lineTo(pos.x, pos.y);
            ctx.stroke();
        }

        function stopDrawing() {
            drawing = false;
            ctx.closePath();
        }

        canvas.addEventListener("mousedown", startDrawing);
        canvas.addEventListener("mousemove", draw);
        canvas.addEventListener("mouseup", stopDrawing);
        canvas.addEventListener("mouseleave", stopDrawing);

        canvas.addEventListener("touchstart", startDrawing, { passive: false });
        canvas.addEventListener("touchmove", draw, { passive: false });
        canvas.addEventListener("touchend", stopDrawing);
        canvas.addEventListener("touchcancel", stopDrawing);

        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.strokeStyle = "black";
    }


  $('.paint_win_btn').click(function () {
    if (isDragging) {
        e.stopImmediatePropagation();
        return false;
    }
    $('.paint_popup').css({ display: 'flex', zIndex: 2 });
    // $('.paint_popup').draggable({
    //     containment: ".windows_layout_main_relative"
    // });
    if(window.innerWidth > 768) paint();
    if(window.innerWidth < 767) mobilePaint();
  });

  $('.child_icon_popup .popup__close').click(function () {
    $(this).closest('.child_icon_popup').hide();
    $(this).closest('.absolute_item').removeClass('active_child');

    const query_handle = $(this).attr('query_handle');

    if (query_handle == '') return;
    const url = new URL(window.location.href);
    const current = url.searchParams.get('open');
    if (!current) return;

    let values = current.split(',');
    values = values.filter(val => val !== query_handle);
    if (values.length) {
        url.searchParams.set('open', values.join(','));
    } else {
        url.searchParams.delete('open');
    }
    window.history.pushState({}, '', url);

  });
  $('.main_close').click(function () {
    var main_ele = $(this).closest('.popup_main').closest('.main_item_draggable');
    main_ele.css('z-index',0);
    $(this).closest('.popup_main').hide();
    main_ele.removeClass('active_popup');

    const query_handle = $(this).attr('query_handle');

    if (query_handle == '') return;
    const url = new URL(window.location.href);
    const current = url.searchParams.get('open');
    if (!current) return;

    let values = current.split(',');
    values = values.filter(val => val !== query_handle);
    if (values.length) {
        url.searchParams.set('open', values.join(','));
    } else {
        url.searchParams.delete('open');
    }
    window.history.pushState({}, '', url);

  });
  $('.paint_popup .popup__close').click(function () {
    $('.paint_popup').hide();
  });
    

  $('.popup_main').click(function(){
    z_index = z_index + 1;
    $(this).css('z-index',z_index);
  });

$('.child_icon_item').click(function (event) {
    let _this = $(this);
    let mouseX = event.pageX - 20;
    let mouseY = event.pageY - 50;
    let query_handle = _this.attr('query_handle');

    setTimeout(function () {
        z_index = z_index + 1;
        let popup = $('[popup__id="' + _this.attr('popup_id') + '"]');
        let container = $(".windows_layout_main_relative");

        let containerOffset = container.offset();
        let containerWidth = container.width(); 
        let containerHeight = container.height();

        let popupWidth = popup.outerWidth();
        let popupHeight = popup.outerHeight();

        if (mouseX < containerOffset.left) {
            mouseX = containerOffset.left;
        } else if (mouseX + popupWidth > containerOffset.left + containerWidth) {
            mouseX = containerOffset.left + containerWidth - popupWidth;
        }

        if (mouseY < containerOffset.top) {
            mouseY = containerOffset.top;
        } else if (mouseY + popupHeight > containerOffset.top + containerHeight) {
            mouseY = containerHeight - popupHeight;
        }

        console.log(mouseY, containerOffset.top);
      
        popup.css({
            position: "absolute",
            top: '21px',
            //top: (mouseY - containerOffset.top) + "px", // FIXED
            left: (mouseX - containerOffset.left) + "px", // FIXED
            zIndex: z_index
        }).show();

        // Make Popup Draggable (Strictly Inside Container)
        // popup.draggable({
        //     containment: container,
        //     handle: ".popup_header"
        // });
        popup.draggable({
            containment: container,
            handle: ".popup_header",
            drag: function (event, ui) {
                const top = ui.position.top;

                if (top < 0) {
                    ui.position.top = 0; // top se bahar nahi jayega
                }
            }
        });

    }, 100);

        const url = new URL(window.location.href);
        const current = url.searchParams.get('open');
        let values = current ? current.split(',') : [];
        if (!values.includes(query_handle)) {
            values.push(query_handle);
        }
        url.searchParams.set('open', values.join(','));
        window.history.pushState({}, '', url);

});

$('.popup_btn').click(function (event) {
    if (isDragging) {
        event.stopImmediatePropagation();
        return false;
    }
    
    let _this = $(this);
    let mouseX = event.pageX - 20;
    let mouseY = event.pageY - 50;
    let query_handle = _this.attr('query_handle');

    setTimeout(function () {
        z_index = z_index + 1;
        let popup = $('[popup__id="' + _this.attr('popup_id') + '"]');
        let container = $(".windows_layout_main_relative");

        // Container Dimensions
        let containerOffset = container.offset();
        let containerWidth = container.width();
        let containerHeight = container.height();

        // Popup Dimensions
        let popupWidth = popup.outerWidth();
        let popupHeight = popup.outerHeight();

        // Adjust Horizontal Position (Left-Right)
        if (mouseX < containerOffset.left) {
            mouseX = containerOffset.left;
        } else if (mouseX + popupWidth > containerOffset.left + containerWidth) {
            mouseX = containerOffset.left + containerWidth - popupWidth;
        }

        // Adjust Vertical Position (Top-Bottom)
        if (mouseY < containerOffset.top) {
            mouseY = containerOffset.top;
        } else if (mouseY + popupHeight > containerOffset.top + containerHeight) {
            mouseY = containerHeight - popupHeight;
        }

        // Set Adjusted Position
        popup.css({
            position: "absolute",
            top: mouseY + "px",
            left: mouseX + "px",
            zIndex: z_index
        }).show();

        // Make Popup Draggable (Strictly Inside Container)
        popup.draggable({
            containment: container
        });

    }, 100);

        const url = new URL(window.location.href);
        const current = url.searchParams.get('open');
        let values = current ? current.split(',') : [];
        if (!values.includes(query_handle)) {
            values.push(query_handle);
        }
        url.searchParams.set('open', values.join(','));
        window.history.pushState({}, '', url);

});


  // $('.popup_btn').click(function (event) {
  //   if (isDragging) {
  //       e.stopImmediatePropagation();
  //       return false;
  //   }
  //   let _this = $(this);
  //   setTimeout(function () {
  //       z_index = z_index + 1;
  //       let popup = $('[popup__id="' + _this.attr('popup_id') + '"]');
  //       popup.css({ zIndex: z_index }).show();
  //       popup.draggable({
  //           containment: ".windows_layout_main_relative"
  //       });
  //   }, 100);
  // });

  $('.child_icon_popup').click(function(){
      z_index = z_index + 1;
      $(this).css('z-index',z_index);
  });

  $('.flip_main_container').click(function(){
    $('.windows_layout_main_relative').toggleClass('active');
  });

  $('.minesweeper_btn').click(function(){
    $('.minesweeper_game_main').toggleClass('show_mine');
  });

  $('.mine_close_btn').click(function(){
    $('.minesweeper_game_main').toggleClass('show_mine');
  });

  function formatTime() {
        const now = new Date();
        let hours = now.getHours();
        let minutes = now.getMinutes();
        //let seconds = now.getSeconds();
        const ampm = hours >= 12 ? "PM" : "AM";
        
        hours = hours % 12 || 12; 
        hours = hours.toString().padStart(2, "0"); 
        minutes = minutes.toString().padStart(2, "0"); 
        //seconds = seconds.toString().padStart(2, "0"); 
    
        return `${hours}:${minutes} ${ampm}`;
    }
    function updateClock() {
        $('.faq_time').html(formatTime());
    }
    setInterval(updateClock, 1000);
    updateClock();
  
  
});

document.addEventListener("DOMContentLoaded", function () {
  setTimeout(() => {
    const params = new URLSearchParams(window.location.search);
    let openParam = params.get("open");

    if (!openParam) return;

    openParam = decodeURIComponent(openParam);

    const values = openParam
      .split(',')
      .map(v => v.trim())
      .filter(Boolean);

    values.forEach(val => {
      const popupElements = document.querySelectorAll(
        `[query_handle="${CSS.escape(val)}"]`
      );

      popupElements.forEach(el => el.click());
    });

  }, 500);
});


