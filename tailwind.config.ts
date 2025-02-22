// tailwind.config.ts
import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";
import animate from "tailwindcss-animate";

export default {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  plugins: [
    typography, // 添加官方排版插件
    animate,
  ],
  theme: {
    extend: {
      typography: {
        // 自定义排版样式
        DEFAULT: {
          css: {
            pre: {
              backgroundColor: "#1f2937",
              padding: "1rem",
              borderRadius: "0.5rem",
              overflowX: "auto",
            },
            code: {
              backgroundColor: "#f3f4f6",
              padding: "0.25rem 0.5rem",
              borderRadius: "0.25rem",
              fontWeight: "400",
            },
          },
        },
      },
    },
  },
} satisfies Config;
