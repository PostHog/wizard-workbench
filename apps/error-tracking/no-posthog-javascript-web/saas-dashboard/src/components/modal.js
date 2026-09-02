/**
 * Reusable modal dialog.
 *
 * Usage:
 *   showModal('Title', '<p>HTML body</p>', (modalEl) => {
 *     // attach event listeners to modalEl
 *   });
 */
export function showModal(title, bodyHtml, onMount) {
  // Remove any existing modal
  document.getElementById('modal-overlay')?.remove();

  const overlay = document.createElement('div');
  overlay.id = 'modal-overlay';
  overlay.className = 'modal-overlay';

  overlay.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <h3>${title}</h3>
        <button class="modal-close" title="Close">&times;</button>
      </div>
      <div class="modal-body">
        ${bodyHtml}
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  // Close on overlay click
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.remove();
  });

  // Close on X button
  overlay.querySelector('.modal-close').addEventListener('click', () => {
    overlay.remove();
  });

  // Close on Escape
  const onKeydown = (e) => {
    if (e.key === 'Escape') {
      overlay.remove();
      document.removeEventListener('keydown', onKeydown);
    }
  };
  document.addEventListener('keydown', onKeydown);

  if (onMount) {
    onMount(overlay);
  }
}
