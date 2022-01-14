import type { BreadcrumbPart, Jam } from "src/global";
import kojima from "./kojima-jam";

export const jams: Jam[] = [
	kojima,
].sort((a, b) => a.start - b.start)

export const breadcrumbs: BreadcrumbPart[] = [
	{ title: "Главная", href: "/" },
	{ title: "Джемы", href: "/jams" }
]
