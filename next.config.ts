import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_PAGES === "true";
const basePath = isGithubPages ? "/KIDS-JUNCTION" : "";

type ImageRemotePattern = {
  protocol: "http" | "https";
  hostname: string;
  pathname?: string;
  port?: string;
  search?: string;
};

function getSupabaseImagePatterns(): ImageRemotePattern[] {
  const patterns: ImageRemotePattern[] = [
    {
      protocol: "https",
      hostname: "**.supabase.co",
      pathname: "/storage/v1/object/public/**",
    },
  ];

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (supabaseUrl) {
    try {
      const { hostname } = new URL(supabaseUrl);
      patterns.unshift({
        protocol: "https",
        hostname,
        pathname: "/storage/v1/object/public/**",
      });
    } catch {
      // ignore invalid URL
    }
  }

  return patterns;
}

const nextConfig: NextConfig = {
  ...(isGithubPages
    ? {
        output: "export",
        basePath,
        assetPrefix: `${basePath}/`,
        trailingSlash: true,
        env: {
          NEXT_PUBLIC_BASE_PATH: basePath,
        },
      }
    : {}),
  images: {
    unoptimized: isGithubPages,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "ui-avatars.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      ...getSupabaseImagePatterns(),
    ],
  },
};

export default nextConfig;
