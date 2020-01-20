import { firestore, firestoreHelpers } from "./firebase";
import { writable, get } from "svelte/store";

export const siteId = writable();
export const slug = writable();
export const deploy = writable();
export const draggedPage = writable();

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

	const replaceBranch = (newNode, branch) => {
		if (branch.key == newNode.key) {
			branch = newNode;
		}
		if (branch.children && branch.children.length) {
			let children = [];
			for (let child of branch.children) {
				children = [...children, replaceBranch(newNode, child)];
			}
			return { ...branch, children };
		} else {
			return { ...branch };
		}
	};

	return {
		subscribe,
		pages: {
			add: async page => {
				const db = await firestore();
				page.ref = await db
					.collection("sites")
					.doc(get(siteId))
					.collection("pages")
					.add(page);

				let content = get(site).content;
				const path = page.path ? page.path.split("/").filter(i => i) : [];

				let currentNode = content;
				if (path[0] != "index")
					for (const slug of path) {
						currentNode = currentNode.children.find(child => child.key == slug);
					}

				const newNode = currentNode.children
					? { ...currentNode, children: [...currentNode.children, page] }
					: { ...currentNode, children: [page] };

				await db
					.collection("sites")
					.doc(get(siteId))
					.update({
						content: replaceBranch(newNode, content)
					});
			},
			move: async (page, target, pos = 0, dir) => {
				const checkIfMoveIsValid = (page, target, valid = true) => {
					valid = !(page == target);
					if (valid && page.children) {
						for (let child of page.children) {
							valid = checkIfMoveIsValid(child, target, valid);
							if (!valid) return false;
						}
					}
					return valid;
				};
				if (!checkIfMoveIsValid(page, target)) {
					console.log("can't move into itself...");
					return;
				}
				// Remove page from old parent
				let content = get(site).content;
				let pagePath = page.path ? page.path.split("/").filter(i => i) : [];

				// get the moved page's parent
				let pageParentNode = { ...content };
				for (let node of pagePath) {
					pageParentNode = pageParentNode.children.find(
						child => child.key == node
					);
				}
				pageParentNode = {
					...pageParentNode,
					children: pageParentNode.children.filter(
						child => child.key != page.key
					)
				};

				target = replaceBranch(pageParentNode, target);

				const targetPath = target.path
					? `${target.path}/${target.key}`
					: target.key == "index"
					? null
					: target.key;

				const replacePath = (page, targetPath) => {
					if (page.children && page.children.length) {
						let newPath = targetPath
							? `${targetPath}/${page.key}`
							: page.key == "index"
							? null
							: page.key;
						let pageChildren = [];
						for (let child of page.children) {
							pageChildren = [...pageChildren, replacePath(child, newPath)];
						}
						page = { ...page, children: pageChildren };
					}
					return { ...page, path: targetPath };
				};

				page = replacePath(page, targetPath);
				let newContent = replaceBranch(pageParentNode, content);

				// Add page to new parent

				let targetChildren;
				if (target.children && target.children.length) {
					targetChildren = [...target.children];
					targetChildren.splice(dir == "above" ? pos : pos + 1, 0, page);
				} else {
					targetChildren = [page];
				}

				target = { ...target, children: targetChildren };

				newContent = replaceBranch(target, newContent);

				await db
					.collection("sites")
					.doc(get(siteId))
					.update({
						content: newContent
					});

				// Update path in all children & their documents
			},
			update: async pages => {
				const db = await firestore();
				await db
					.collection("sites")
					.doc(get(siteId))
					.update({ pages });
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
