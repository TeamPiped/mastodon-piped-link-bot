import { JSDOM } from "jsdom";

export const getPipedLinks = (htmlContent: string): string[] => {
    const document: Document = new JSDOM(htmlContent.trim()).window.document;
    let links = Array.from(document.querySelectorAll("a"))
        .filter((a: HTMLElement) => a.textContent)
        .map(a => a.href)
        .map(href => new URL(href));

    const hostnames = ["youtube.com", "youtube-nocookie.com", "youtu.be"];

    links = links.filter(link => {
        const isYt = link.hostname.endsWith(".youtube.com") || hostnames.some(hostname => link.hostname === hostname);
        return isYt;
    });

    // convert youtube links to piped links
    const pipedLinks: string[] = links.map(link => {
        link.hostname = "piped.video";
        return link.toString();
    });

    return pipedLinks;
};
