export const SITE_TITLE = "Zach Bentsen  Portfolio";
export const SITE_DESCRIPTION = "Portfolio and blog of Zach Bentsen (zachcbenny)";
export const SITE_URL = "https://zachcbenny.com";
export const BLOG_HOST = "blog.zachcbenny.com";

export const THEMES = ["boring", "neobrutal", "hyper"] as const;
export type Theme = (typeof THEMES)[number];
export const DEFAULT_THEME: Theme = THEMES[0]; // default theme key (matches theme toggle order)
