export function getHeaderHeight(header, announcementBar, breadcrumbs) {
  let header1 = header,
    announcementBar1 = announcementBar,
    breadcrumbs1 = breadcrumbs;
  if (!header1) header1 = document.querySelector('.section-header');
  if (!announcementBar1) announcementBar1 = document.querySelector('.section-usp-bar');
  if (!breadcrumbs1) breadcrumbs1 = document.querySelector('breadcrumbs-nav');

  return {
    headerHeight: header1 ? header1.offsetHeight : 0,
    announcementBarHeight: announcementBar1 ? announcementBar1.offsetHeight : 0,
    breadcrumbsHeight: breadcrumbs1 ? breadcrumbs1.offsetHeight : 0,
    headerBottomPosition: header1 ? header1.getBoundingClientRect().bottom : 0,
  };
}
