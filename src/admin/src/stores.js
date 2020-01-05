import { firestore, firestoreHelpers } from "./firebase";
import { writable, get } from "svelte/store";

export const siteId = writable();
export const slug = writable();
export const deploy = writable();

const createSiteStore = siteId => {
	const { subscribe, set } = writable();
	siteId.subscribe(async $siteId => {
		if (!$siteId) return;
		const db = await firestore();
		const unsubscribe = db
			.collection("sites")
			.doc($siteId)
			.onSnapshot(siteDoc => {
				let site = {};
				if (siteDoc.exists) {
					site = { id: siteDoc.id, ...siteDoc.data() };
				}
				set(site);
			});
	});
	return {
		subscribe,
		pages: {
			add: async page => {
				const db = await firestore();
				const { arrayUnion } = await firestoreHelpers();
				await db
					.collection("sites")
					.doc(get(siteId))
					.update({
						pages: arrayUnion(page)
					});
			}
		}
	};
};

export const site = createSiteStore(siteId);

const createPageStore = (site, slug) => {
	const { subscribe, set } = writable();
	let $site, $slug, $page;
	const setPage = ($site, $slug) => {
		if (!$site || !$slug || !Array.isArray($site.pages)) return;
		$page = $site.pages.find(page => page.slug === $slug);
		set($page);
	};
	site.subscribe($$site => {
		$site = $$site;
		if ($site) setPage($site, $slug);
	});
	slug.subscribe($$slug => {
		$slug = $$slug;
		if ($slug) setPage($site, $slug);
	});

	const updatePage = async (oldPage, newPage) => {
		const db = await firestore();
		const siteRef = db.collection("sites").doc(get(siteId));
		const { arrayUnion, arrayRemove } = await firestoreHelpers();
		await db.runTransaction(async transaction => {
			console.log("removing", oldPage);
			await transaction.update(siteRef, {
				pages: arrayRemove(oldPage)
			});
			console.log("adding", newPage);
			await transaction.update(siteRef, {
				pages: arrayUnion(newPage)
			});
		});
	};

	return {
		subscribe,
		update: async updatedPage => {
			await updatePage($page, updatedPage);
		},
		elements: {
			add: async element => {
				console.log(`$page = ${$page}`);
				let oldPage = { ...$page };
				let newPage = { ...$page };
				newPage.elements = newPage.elements
					? [...newPage.elements, element]
					: [element];
				await updatePage(oldPage, newPage);
			},
			update: async (elementId, content) => {
				let oldPage = { ...$page };
				let newPage = { ...$page };

				newPage.elements = oldPage.elements.map(element => {
					return element.id === elementId
						? { ...element, content }
						: { ...element };
				});

				await updatePage(oldPage, newPage);
			},
			remove: async elementId => {
				let oldPage = { ...$page };
				let newPage = { ...$page };

				newPage.elements = oldPage.elements.filter(element => {
					return element.id != elementId;
				});

				await updatePage(oldPage, newPage);
			}
		}
	};
};

export const page = createPageStore(site, slug);
