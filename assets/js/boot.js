/* boot.js - runs in <head> before first paint: decides loader mode and scroll-restore mode */
(function () {
  var H = document.documentElement, S;
  H.classList.add('js');
  function get(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } }
  function del(k) { try { sessionStorage.removeItem(k); } catch (e) {} }
  var page = (document.documentElement.getAttribute('data-page') || 'index');
  var st = null, raw = get('stk_restore');
  if (raw) { try { st = JSON.parse(raw); } catch (e) { st = null; } }
  if (st && st.page === page && Date.now() - (st.t || 0) < 30 * 60 * 1000) {
    H.classList.add('is-restoring');
    try { history.scrollRestoration = 'manual'; } catch (e) {}
    window.__stkRestore = st; window.__stkLoaderMode = 'none';
  } else {
    if (raw) del('stk_restore');
    window.__stkLoaderMode = get('stk_seen') === '1' ? 'short' : 'full';
    H.classList.add('js-loading');
  }
  // fail-safes so a page can never stay hidden
  setTimeout(function () { H.classList.remove('is-restoring'); }, 2500);
  setTimeout(function () { H.classList.remove('js-loading'); }, 9000);
})();
