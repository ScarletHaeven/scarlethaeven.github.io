const views = ['intro', 'programming', 'games', 'music'];

function openPageSection(id) {
  views.forEach((view) => {
    let viewElement = document.getElementById(view.toLowerCase());
    viewElement.classList.toggle('hidden', view !== id);
  });
}
