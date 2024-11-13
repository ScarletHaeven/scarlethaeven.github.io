const views = ['intro', 'programming', 'games', 'music'];

function openPageSection(className) {
  views.forEach((view) => {
    document.querySelectorAll('.' + view.toLowerCase()).forEach((viewElement) => {
      viewElement.classList.toggle('hidden', view !== className);
    });
  });

  const footerInfoSelector = document.querySelector('.footer-info-selector');

  if (footerInfoSelector) {
    footerInfoSelector.classList.toggle('hidden', className === 'intro');
  }
}
