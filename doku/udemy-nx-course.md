# nx

Meine Notizen aus dem Udemy-Kurs über nx monorepos. Es wird zunächst ein komplett leeres Monorepo generiert und anschließend werden schrittweise die apps hinzugefügt mittels nx cli

## create a workspace

```
npx create-nx-workspace@latest my-workspace
```

## create an angular app

Vorbereitung @nx/angular ist noch unbekannt. Daher

```
npm install @nx/angular --save-dev
```

```
# For Nx 21.5.3:
npx nx generate @nx/angular:application my-app
```

Fehlermeldung:

```
 NX   The "@nx/angular:application" generator doesn't yet support the existing TypeScript setup

We're working hard to support the existing TypeScript setup with the "@nx/angular:application" generator. We'll soon release a new version of Nx with support for it.


 NX   The "@nx/angular:application" generator doesn't yet support the existing TypeScript setup. See the error above.
```

Daher Vorschlag von DeepSeek:

```
npx generate @nx/angular:app my-app
```

Klappt nicht. Daher keinen none-Workspace sondern preset-angular

```
npx create-nx-workspace@latest my-angular-workspace --preset=angular
```

## create an angular library

```
npx nx generate @nx/angular:library my-lib
```

Das Teil landet nicht im libs-Verzeichnis, weil in nx.json das default apps- und libs-Verzeichnis nicht definiert ist.

Schöne Übung in refactor-move mit nx:

```
# Zur richtigen Location moven
npx nx generate @nx/workspace:move \
  --project my-lib \
  --destination libs/my-lib
```

Also besser gleich so:

```
npx nx g @nx/angular:library --name shared-utils --directory libs/shared-utils --style=scss --dry-run
```

## globale nx-Konfigurationsänderugen

Damit apps unter apps und libs unter libs landen, in nx.json dies hier einfügen:

```
"workspaceLayout": {
    "appsDir": "apps",
    "libsDir": "libs"
  }
```

## nx schematics

### neue component

```
# So geht's in modernen Nx Versionen:
npx nx g @nx/angular:component --name=my-component --path=apps/my-app/src/my-component --changeDetection=OnPush --style=scss --dry-run
```

### nx plugins

```
npm add @nx/plugin -D
```

```
npx nx g @nx/plugin:plugin automation --directory=tools/plugins/automation --dry-run
```

Generator generieren

```
npx nx g @nx/plugin:generator --name=my-generator --path=tools/plugins/automation/src/generators/my-generator --description="my custom generator" --dry-run
```

## executors

### generate an nx-executor

```
npx nx g @nx/plugin:executor --name=echo --path=tools/plugins/automation/src/executors/echo --dry-run
```

## nx-workflows

Automatisieren häufig ausgeführter commands.

in my-app/project.json unter targets dies hier:

```
"custom-workflow": {
      "executor": "nx:run-commands",
      "options": {
        "commands": [
          {"command": "nx build my-app"},
          {"command": "nx test my-app"}
        ],
        "parallel": false
      }
    },

```

und ausführen mit

```
npx nx custom-workflow my-app
```

## Further learning resources

1. NX Documentation The official NX documentation is a comprehensive resource for learning everything about NX. It includes detailed guides, API references, tutorials, and examples that cater to both beginners and advanced users.

   Website: nx.dev

2. Angular Documentation For those using Angular with NX, the official Angular documentation provides extensive information on Angular's features, best practices, and advanced topics.

   Website: angular.io/docs

3. Node.js Documentation If you're working with Node.js in your NX workspace, the official Node.js documentation is an excellent resource for understanding the runtime, APIs, and best practices.

   Website: nodejs.org/en/docs/

4. TypeScript Documentation TypeScript plays a crucial role in NX projects. The official TypeScript documentation offers in-depth guides on the language's features, syntax, and advanced usage.

   Website: typescriptlang.org/docs/

Community and Forums

5. NX GitHub Repository The NX GitHub repository is a great place to find the source code, report issues, and contribute to the project. It's also an excellent resource for seeing how others use NX and getting involved in the development community.

   Repository: NX GitHub

6. Stack Overflow Stack Overflow is a valuable resource for finding solutions to specific problems and learning from the questions and answers posted by other developers. Tag your questions with "nx" and "monorepo" to find relevant discussions.

   Website: Stack Overflow NX Questions

Blogs and Tutorials

7. NX Blog The NX blog features articles from the NX team and community members on new features, best practices, case studies, and more. It's an excellent way to stay updated on the latest developments.

8. Dev.to Dev.to is a community of developers where you can find articles, tutorials, and discussions on a wide range of topics, including NX and monorepos. Use tags like "nx", "angular", and "monorepo" to find relevant content.

   Website: Dev.to

9. Medium Medium hosts a variety of articles and tutorials written by developers worldwide. Search for NX and monorepo topics to find in-depth guides and experiences shared by the community.

   Website: Medium

---

## NX Version 21.5.2 Command Updates

In the latest version of NX some of the commands have changed slightly. If you are working on a later version of NX than what is in these lectures please refer to this document in case any commands are not working.

NX 19.3.0 Command

nx g @nx/angular:my-app

NX 21.5.2 Command

nx g @nx/angular:application my-app

---

NX 19.3.0 Command

nx dep-graph

NX 21.5.2 Command

nx graph

---

NX 19.3.0 Command

nx affected:build

NX 21.5.2 Command

nx affected --target=build

---

NX 19.3.0 Command

nx affected:test

NX 21.5.2 Command

nx affected --target=test

---

NX 19.3.0 Command

nx watch my-app

NX 21.5.2 Command

nx watch --projects=my-app

---

NX 19.3.0 Command

nx g @nx/angular:app task-manager —routing

NX 21.5.2 Command

nx g @nx/angular:application task-manager --routing
