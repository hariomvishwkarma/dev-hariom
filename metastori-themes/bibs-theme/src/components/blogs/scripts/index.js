const blogTagFilter = document.querySelector('.blog-tag-filters');

if (blogTagFilter) {
  const blogTagFilters = blogTagFilter.querySelectorAll('a');
  const sectionId = blogTagFilter.dataset.sectionId;
  if (blogTagFilters.length >= 1 && sectionId) {
    blogTagFilters.forEach((filter) => {
      filter.href += `#${sectionId}`;
    });
  }
}
