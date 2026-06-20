(function () {
	var storageKey = 'rgd.sidebar.collapsed';
	var desktopQuery = '(min-width: 768px)';

	try {
		var isDesktop = window.matchMedia(desktopQuery).matches;
		var isCollapsed = isDesktop && window.localStorage.getItem(storageKey) === 'true';
		document.documentElement.dataset.sidebarCollapsed = String(isCollapsed);
	} catch (_) {
		document.documentElement.dataset.sidebarCollapsed = 'false';
	}
})();
