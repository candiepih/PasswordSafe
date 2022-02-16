const navButtons: Element[] = [...document.getElementsByClassName('holder').item(0).children];
const generateContainer: HTMLElement = document.querySelector('.generate');
const available: HTMLElement =document.querySelector('.available');

/**
 * @method toggleContainers
 * @description toggles the visibility available containers
 * @returns {void}
 */
const toggleContainers = (): void => {
  if (generateContainer.style.display === 'block') {
    generateContainer.style.display = 'none';
    available.style.display = 'block';
  } else {
    generateContainer.style.display = 'block';
    available.style.display = 'none';
  }
};

/**
 * @method toggleNavButtons
 * @description toggle active class on click
 * @param {number} index
 * @returns {void}
 */
const toggleClasses = (target: HTMLElement): void => {
    if (!target.classList.contains('holder')) {
      target.classList.add('active');
      toggleContainers();
      navButtons.forEach((el: Element) => {
        if (el !== target) {
          el.classList.remove('active');
        }
      });
    }
};


// Event Listeners
navButtons.forEach((item: Element) => {
  item.addEventListener('click', (e: Event): void => toggleClasses(<HTMLElement>e.target));
});
