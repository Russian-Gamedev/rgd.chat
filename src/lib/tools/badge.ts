import type { Badge } from "src/global";

export function badgeColor(badge: Badge): string {
	switch (badge.color) {
		case "gold":
			return "bg-gold";
		case "silver":
			return "bg-silver";
		case "bronze":
			return "bg-bronze";
		case "success":
			return "bg-success";
		case "notify":
			return "bg-notify";
		case "error":
			return "bg-error";
		case "live":
			return "bg-live";
		case "control":
			return "bg-control";
		case "midnight":
			return "bg-midnight";
		case "black":
			return "bg-black";
		default:
			return "bg-primary";
	}
}
