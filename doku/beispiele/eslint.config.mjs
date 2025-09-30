// eslint.config.mjs
import nx from "@nx/eslint-plugin";
import prettier from "eslint-config-prettier";

export default [
  // Basis (ES, TS, JS) – von Nx vordefiniert
  ...nx.configs["flat/base"],
  ...nx.configs["flat/typescript"],
  ...nx.configs["flat/javascript"],

  // Globale Ignorierliste
  {
    ignores: [
      "**/dist/**",
      "**/coverage/**",
      "**/.nx/**",
      "**/vite.config.*.timestamp*",
      "**/vitest.config.*.timestamp*",
    ],
  },

  // Angular (TS + Templates) – Nx Flat-Configs
  ...nx.configs["flat/angular"],
  ...nx.configs["flat/angular-template"],

  // Projektspezifische TS-Regeln (inkl. Selector-Konventionen & Dep-Rules)
  {
    files: ["**/*.ts"],
    rules: {
      // Angular Selektoren
      "@angular-eslint/directive-selector": [
        "error",
        { type: "attribute", prefix: "app", style: "camelCase" },
      ],
      "@angular-eslint/component-selector": [
        "error",
        { type: "element", prefix: "app", style: "kebab-case" },
      ],

      // 🔒 Abhängigkeits-/Layer-Regeln über Tags
      // -> Tags kommen aus den jeweiligen project.json (z. B. "tags": ["domain:auth", "type:api"])
      "@nx/enforce-module-boundaries": [
        "error",
        {
          // optional, aber gute Defaults
          enforceBuildableLibDependency: true,
          allow: [],

          // Dep-Constraints:
          // - auth ⟷ profil: keine Abhängigkeit zueinander
          // - shared darf von allen genutzt werden
          // - innerhalb derselben Domain okay
          // - zusätzlich immer type:* erlaubt (z. B. type:ui, type:model, type:api, type:util)
          depConstraints: [
            // domain:auth darf NICHT von domain:profil abhängen
            {
              sourceTag: "domain:auth",
              onlyDependOnLibsWithTags: [
                "domain:auth",
                "domain:shared",
                "type:*",
              ],
            },
            // domain:profil darf NICHT von domain:auth abhängen
            {
              sourceTag: "domain:profil",
              onlyDependOnLibsWithTags: [
                "domain:profil",
                "domain:shared",
                "type:*",
              ],
            },
            // shared ist neutral – darf nur von shared und type:* abhängen
            {
              sourceTag: "domain:shared",
              onlyDependOnLibsWithTags: ["domain:shared", "type:*"],
            },
            // (optional) generische Regel: jede Domain darf nur sich selbst + shared + type:* referenzieren
            // -> hilft, wenn noch weitere Domains entstehen (users, tasks, …)
            {
              sourceTag: "domain:*",
              onlyDependOnLibsWithTags: [
                "domain:shared",
                "type:*",
                "{projectTag}",
              ],
            },
          ],
        },
      ],
    },
  },

  // Template-spezifische Regeln (optional erweitern)
  {
    files: ["**/*.html"],
    rules: {
      // Beispiel: '@angular-eslint/template/alt-text': 'error',
    },
  },

  // ➜ Ganz zum Schluss: Prettier-Konfig zum Abschalten formatierender ESLint-Regeln
  prettier,
];
