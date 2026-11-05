import type { MetadataRoute } from "next";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

function getFileDate(relativePath: string, fallbackDate: Date): Date {
  const root = process.cwd();
  try {
    const gitDate = execSync(`git log -1 --format=%cI -- "${relativePath}"`, {
      cwd: root,
      encoding: "utf8",
      stdio: ["pipe", "pipe", "ignore"],
    }).trim();
    if (gitDate) {
      const parsed = new Date(gitDate);
      if (!isNaN(parsed.getTime())) {
        return parsed;
      }
    }
  } catch {
    // Git command unavailable or file uncommitted
  }
  try {
    const stat = fs.statSync(path.join(root, relativePath));
    return stat.mtime;
  } catch {
    return fallbackDate;
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://runfix.live";
  const defaultDate = new Date("2026-10-13T18:54:50.000Z");

  return [
    {
      url: `${baseUrl}`,
      lastModified: getFileDate("app/page.tsx", defaultDate),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/security`,
      lastModified: getFileDate("app/security/page.tsx", defaultDate),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: getFileDate("app/about/page.tsx", defaultDate),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: getFileDate("app/terms/page.tsx", defaultDate),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: getFileDate("app/privacy/page.tsx", defaultDate),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/llms.txt`,
      lastModified: getFileDate("public/llms.txt", defaultDate),
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/llms-full.txt`,
      lastModified: getFileDate("public/llms-full.txt", defaultDate),
      changeFrequency: "weekly",
      priority: 0.5,
    },
  ];
}
