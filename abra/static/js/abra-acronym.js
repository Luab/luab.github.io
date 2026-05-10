// Resolve the ABRA acronym to a slightly different expansion on each load.
// The visible H1 changes; meta tags, BibTeX, and the abstract stay canonical
// so search engines and citation managers see the stable title.
(function () {
  const variants = {
    A1: ['Agent', 'Agentic', 'Autonomous', 'Automated', 'Adaptive', 'Auditable', 'Anchored'],
    B:  ['Benchmark', 'Battery', 'Baseline', 'Benchsuite'],
    R:  ['Radiology', 'Radiographic', 'Radiologists', 'Radiographers'],
    A2: ['Applications', 'Agents', 'Assessment', 'Analysis', 'Assistants', 'Activities'],
  };

  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function render(word) {
    return '<span class="initial">' + word[0] + '</span>' + word.slice(1);
  }

  function resolve() {
    const slots = document.querySelectorAll('.acronym-expansion .word');
    if (slots.length !== 4) return;
    const keys = ['A1', 'B', 'R', 'A2'];
    slots.forEach((slot, i) => {
      slot.innerHTML = render(pick(variants[keys[i]]));
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', resolve);
  } else {
    resolve();
  }
})();
