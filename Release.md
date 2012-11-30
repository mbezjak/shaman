Release steps:

1. Add `Changelog.md` entry
2. Git work:

        $ git tag --annotate $version
        $ git push
        $ git push --tags

        $ git checkout gh-pages
        $ git merge master
        $ git push
