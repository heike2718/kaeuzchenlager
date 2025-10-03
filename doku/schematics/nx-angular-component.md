# generate an nx-angular component

```
npx nx g @nx/angular:component --name=home --path=src/app/home/home --style=scss --dry-run

npx nx g @nx/angular:component --name=sidenav --path=src/app/layout/sidenav/sidenav --style=scss --dry-run

npx nx g @nx/angular:component --name=navbar --path=src/app/layout/navbar/navbar --style=scss --dry-run

npx nx g @nx/angular:component --name=gaefaesstypen-list --path=src/app/gefaesstypen/features/gaefaesstypen-list/gaefaesstypen-list --style=scss --dry-run
```

```
npx nx generate @nx/angular:component --help

 NX   generate @nx/angular:component [path] [options,...]


From:  @nx/angular (v21.5.3)
Name:  component (aliases: c)


  Creates a new Angular component.


Options:
    --path                     The file path to the component. Relative to the current                                                           [string]
                               working directory.
    --export                   Specifies if the component should be exported in the                                                             [boolean]
                               declaring `NgModule`. Additionally, if the project is a
                               library, the component will be exported from the project's
                               entry point (normally `index.ts`) if the module it belongs to
                               is also exported or if the component is standalone.
    --standalone               Whether the generated component is standalone.                                                   [boolean] [default: true]
    --changeDetection, -c      The change detection strategy to use in the new component.    [string] [choices: "Default", "OnPush"] [default: "Default"]
    --displayBlock, -b         Specifies if the style will contain `:host { display: block;                                                     [boolean]
                               }`.
    --exportDefault            Use default export for the component instead of a named                                                          [boolean]
                               export.
    --inlineStyle, -s          Include styles inline in the component.ts file. Only CSS                                                         [boolean]
                               styles can be included inline. By default, an external styles
                               file is created and referenced in the component.ts file.
    --inlineTemplate, -t       Include template inline in the component.ts file. By default,                                                    [boolean]
                               an external template file is created and referenced in the
                               component.ts file.
    --module, -m               The filename or path to the NgModule that will declare this                                                       [string]
                               component.
    --name                     The component symbol name. Defaults to the last segment of                                                        [string]
                               the file path.
    --ngHtml                   Generate component template files with an '.ng.html' file                                                        [boolean]
                               extension instead of '.html'.
    --prefix, -p               The prefix to apply to the generated component selector.                                                          [string]
    --selector                 The HTML selector to use for this component.                                                                      [string]
    --skipImport               Do not import this component into the owning NgModule.                                                           [boolean]
    --skipSelector             Specifies if the component should have a selector or not.                                                        [boolean]
    --skipTests                Do not create `spec.ts` test files for the new component.                                                        [boolean]
    --style                    The file extension or preprocessor to use for style files, or    [string] [choices: "css", "scss", "sass", "less", "none"]
                               `none` to skip generating the style file.                                                                 [default: "css"]
    --type                     Append a custom type to the component's filename. It defaults                                                     [string]
                               to 'component' for Angular versions below v20. For Angular
                               v20 and above, no type is appended unless specified.
    --viewEncapsulation, -v    The view encapsulation strategy to use in the new component.           [string] [choices: "Emulated", "None", "ShadowDom"]
    --skipFormat               Skip formatting files.                                                                                           [boolean]


```

[information and examples](https://nx.dev/nx-api/angular/generators/component)
