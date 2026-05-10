// Slot-machine animation: each word in "Agent Benchmark for Radiology
// Applications" cycles rapidly through variants on page load, then lands on
// the canonical word. Slots are staggered so they settle left-to-right.
// Meta tags, BibTeX, and the abstract stay canonical so SEO and citation
// extraction are unaffected.
(function () {
  const variants = {
    A1: ['Agent', 'Agile', 'Aided', 'Astute', 'Active', 'Applied', 'Agentic'],
    B:  ['Battery', 'Benchmark', 'Baseline'],
    R:  ['Radiology', 'Radiation', 'Radiologic'],
    A2: ['Assessments', 'Assistants', 'Algorithms', 'Annotations', 'Activities', 'Applications', 'Acquisition'],
  };
  const canonical = {
    A1: 'Agent',
    B:  'Benchmark',
    R:  'Radiology',
    A2: 'Applications',
  };

  const keys = ['A1', 'B', 'R', 'A2'];
  // All slots spin at the same pace and land together. Tick rate is slow
  // enough that each variant is comfortably readable.
  const totalMs = 3000;
  const spinDurations = [totalMs, totalMs, totalMs, totalMs];
  const tickMs = 500; // how often each slot swaps text while spinning

  function render(word) {
    return '<span class="initial">' + word[0] + '</span>' + word.slice(1);
  }

  // Measure the widest variant for a slot and lock the slot's min-width to
  // that, so the capital letter at the left of every variant stays pinned in
  // place instead of dancing horizontally as the word changes.
  function lockSlotWidth(slot, key) {
    const choices = variants[key].concat(canonical[key]);
    const original = slot.innerHTML;
    let max = 0;
    for (const w of choices) {
      slot.innerHTML = render(w);
      const px = slot.getBoundingClientRect().width;
      if (px > max) max = px;
    }
    slot.innerHTML = original;
    slot.style.minWidth = Math.ceil(max) + 'px';
    slot.style.textAlign = 'left';
  }

  function spinSlot(slot, key, totalMs) {
    const choices = variants[key];
    slot.classList.add('is-spinning');

    let last = slot.textContent.trim();
    const interval = setInterval(() => {
      // Avoid showing the same word twice in a row to amplify the rolling feel.
      let next;
      do {
        next = choices[Math.floor(Math.random() * choices.length)];
      } while (next === last && choices.length > 1);
      last = next;
      slot.innerHTML = render(next);
    }, tickMs);

    setTimeout(() => {
      clearInterval(interval);
      slot.innerHTML = render(canonical[key]);
      slot.classList.remove('is-spinning');
      slot.classList.add('has-landed');
    }, totalMs);
  }

  function start() {
    const slots = document.querySelectorAll('.acronym-expansion .word');
    if (slots.length !== 4) return;
    // Lock widths first (sequentially, before any animation starts) so the
    // line of text never reflows during the spin.
    slots.forEach((slot, i) => lockSlotWidth(slot, keys[i]));
    slots.forEach((slot, i) => spinSlot(slot, keys[i], spinDurations[i]));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
