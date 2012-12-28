Release steps:

1. Add `Changelog.md` entry
2. Change version in `shaman.js`
3. Git work:

        $ git tag --annotate $version
        $ git push
        $ git push --tags

        $ git checkout gh-pages
        $ git merge master
        $ git push
