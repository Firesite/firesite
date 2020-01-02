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
		if (!$site || !$slug) return;
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

	return {
		subscribe,
		elements: {
			add: async element => {
				const db = await firestore();
				const { arrayUnion, arrayRemove } = await firestoreHelpers();
				const siteRef = db.collection("sites").doc(get(siteId));

				let $$page = { ...$page };

				$page.elements = $page.elements
					? [...$page.elements, element]
					: [element];

				await db.runTransaction(async transaction => {
					await transaction.update(siteRef, {
						pages: arrayUnion($page)
					});
					await transaction.update(siteRef, {
						pages: arrayRemove($$page)
					});
				});
			}
		}
	};
};

export const page = createPageStore(site, slug);
