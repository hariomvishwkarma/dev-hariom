window.addEventListener('DOMContentLoaded', function () {
    document.addEventListener('click', function (e) {
    // Open sidebar/popup
    if (e.target.closest('.mobile_filter_button')) {
      e.preventDefault();
      document.querySelector('.ms_popup_wr')?.classList.add('visible');
      document.body.classList.add('overflow_hidden');
    }
  
    // Close sidebar/popup
    if (e.target.closest('.ms_popup_overlay') || e.target.closest('.ms_close_btn')) {
      document.querySelector('.ms_popup_wr')?.classList.remove('visible');
      document.body.classList.remove('overflow_hidden');
    }
  });
  const sidebar = document.getElementById('side_bar');
  const sidebarOuter = document.getElementById('side_bar_outer');
  if (sidebar && sidebarOuter) {
    sidebarOuter.appendChild(sidebar);
  }

  document.querySelectorAll('.productgrid--sidebar-item .navmenu-item .navmenu-link-active').forEach(function(element) {
      const details = element.closest('details');
      if (details && !details.hasAttribute('open')) {
          details.setAttribute('open', '');
      }
  });
  
});